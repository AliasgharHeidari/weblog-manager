package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"blog-platform/database"
	"blog-platform/models"
	"blog-platform/service"
	"blog-platform/utils"
)

type PostHandler struct {
	postService *service.PostService
}

func NewPostHandler(postService *service.PostService) *PostHandler {
	return &PostHandler{
		postService: postService,
	}
}

type CreatePostRequest struct {
	Title     string `json:"title"`
	Content   string `json:"content"`
	Section   string `json:"section"`
	Published bool   `json:"published"`
}

func (h *PostHandler) CreatePost(c *fiber.Ctx) error {
	var req CreatePostRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}

	post := &models.Post{
		Title:     req.Title,
		Content:   req.Content,
		Section:   req.Section,
		Published: req.Published,
		AuthorID:  userID,
	}

	if file, err := c.FormFile("image"); err == nil {
		if imageURL, err := utils.SaveImageWithCompression(file, "uploads"); err == nil {
			post.ImageURL = imageURL
		}
	}

	if err := h.postService.CreatePost(post); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create"})
	}

	return c.Status(201).JSON(post)
}

func (h *PostHandler) UpdatePost(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)

	post, err := h.postService.GetPost(uint(id))
	if err != nil || post == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Not found"})
	}

	var req CreatePostRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	post.Title = req.Title
	post.Content = req.Content
	post.Section = req.Section
	post.Published = req.Published

	if file, err := c.FormFile("image"); err == nil {
		if imageURL, err := utils.SaveImageWithCompression(file, "uploads"); err == nil {
			post.ImageURL = imageURL
		}
	}

	if err := h.postService.UpdatePost(post); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update"})
	}

	return c.JSON(post)
}

func (h *PostHandler) TogglePublish(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)

	var post models.Post
	if err := database.DB.First(&post, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Not found"})
	}

	post.Published = !post.Published
	database.DB.Save(&post)

	return c.JSON(post)
}

func (h *PostHandler) DeletePost(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)

	if err := h.postService.DeletePost(uint(id)); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete"})
	}

	return c.JSON(fiber.Map{"message": "Deleted"})
}

func (h *PostHandler) GetPost(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)

	post, err := h.postService.GetPost(uint(id))
	if err != nil || post == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Not found"})
	}

	h.postService.IncrementViews(uint(id))

	return c.JSON(post)
}

func (h *PostHandler) GetPosts(c *fiber.Ctx) error {
	section := c.Query("section", "")

	// چک کردن admin
	includeUnpublished := false
	if isAdmin, ok := c.Locals("is_admin").(bool); ok && isAdmin {
		includeUnpublished = true
	}

	posts, err := h.postService.GetPosts(section, includeUnpublished)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch"})
	}

	return c.JSON(posts)
}

func (h *PostHandler) GetSections(c *fiber.Ctx) error {
	sections, err := h.postService.GetSections()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch"})
	}

	return c.JSON(sections)
}

// GetAllPosts - مخصوص admin برای دیدن همه پست‌ها
func (h *PostHandler) GetAllPosts(c *fiber.Ctx) error {
	posts, err := h.postService.GetPosts("", true)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch"})
	}
	return c.JSON(posts)
}
