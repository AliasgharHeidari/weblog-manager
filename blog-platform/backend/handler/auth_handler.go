package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"

	"blog-platform/database"
	"blog-platform/models"
	"blog-platform/service"
	"blog-platform/utils"
)

type AuthHandler struct {
	authService *service.AuthService
	session     *session.Store
}

func NewAuthHandler(authService *service.AuthService, session *session.Store) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		session:     session,
	}
}

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	user, err := h.authService.Register(req.Username, req.Email, req.Password)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	sess, _ := h.session.Get(c)
	sess.Set("user_id", user.ID)
	sess.Set("is_admin", user.IsAdmin)
	sess.Save()

	return c.Status(fiber.StatusCreated).JSON(user)
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	user, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	sess, _ := h.session.Get(c)
	sess.Set("user_id", user.ID)
	sess.Set("is_admin", user.IsAdmin)
	sess.Save()

	return c.JSON(user)
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	sess, _ := h.session.Get(c)
	sess.Destroy()
	return c.JSON(fiber.Map{"message": "Logged out"})
}

func (h *AuthHandler) GetCurrentUser(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Not authenticated",
		})
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(fiber.Map{
		"user_id":    user.ID,
		"is_admin":   user.IsAdmin,
		"username":   user.Username,
		"email":      user.Email,
		"avatar_url": user.AvatarURL,
		"github_url": user.GitHubURL,
		"bio":        user.Bio,
	})
}

// GetPublicProfile - نمایش پروفایل عمومی
func (h *AuthHandler) GetPublicProfile(c *fiber.Ctx) error {
	userID := c.Params("id")
	
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(fiber.Map{
		"id":         user.ID,
		"username":   user.Username,
		"email":      user.Email,
		"avatar_url": user.AvatarURL,
		"github_url": user.GitHubURL,
		"bio":        user.Bio,
	})
}

// UpdateProfile - آپدیت پروفایل
func (h *AuthHandler) UpdateProfile(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User ID not found",
		})
	}

	var req struct {
		Username  string `json:"username"`
		Email     string `json:"email"`
		GitHubURL string `json:"github_url"`
		Bio       string `json:"bio"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.Username = req.Username
	user.Email = req.Email
	user.GitHubURL = req.GitHubURL
	user.Bio = req.Bio

	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update profile",
		})
	}

	return c.JSON(fiber.Map{
		"username":   user.Username,
		"email":      user.Email,
		"github_url": user.GitHubURL,
		"bio":        user.Bio,
	})
}

// UploadAvatar - آپلود تصویر پروفایل
func (h *AuthHandler) UploadAvatar(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User ID not found",
		})
	}

	file, err := c.FormFile("avatar")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No avatar file",
		})
	}

	avatarURL, err := utils.SaveImageWithCompression(file, "uploads/avatars")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save avatar",
		})
	}

	if err := database.DB.Model(&models.User{}).Where("id = ?", userID).Update("avatar_url", avatarURL).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update avatar",
		})
	}

	return c.JSON(fiber.Map{"avatar_url": avatarURL})
}
