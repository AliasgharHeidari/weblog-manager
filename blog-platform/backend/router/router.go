package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"

	"blog-platform/handler"
	"blog-platform/middleware"
	"blog-platform/service"
)

func SetupRoutes(app *fiber.App, session *session.Store) {
	authService := service.NewAuthService()
	postService := service.NewPostService()

	authHandler := handler.NewAuthHandler(authService, session)
	postHandler := handler.NewPostHandler(postService)

	api := app.Group("/api")

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/logout", authHandler.Logout)
	auth.Get("/me", middleware.AuthRequired(session), authHandler.GetCurrentUser)

	api.Get("/users/:id", authHandler.GetPublicProfile)

	api.Get("/posts", postHandler.GetPosts)
	api.Get("/posts/:id", postHandler.GetPost)
	api.Get("/sections", postHandler.GetSections)

	admin := api.Group("/admin", middleware.AdminRequired(session))
	admin.Post("/posts", postHandler.CreatePost)
	admin.Put("/posts/:id", postHandler.UpdatePost)
	admin.Delete("/posts/:id", postHandler.DeletePost)
	admin.Patch("/posts/:id/toggle", postHandler.TogglePublish)
	admin.Get("/posts/all", postHandler.GetAllPosts)
	admin.Put("/profile", authHandler.UpdateProfile)
	admin.Post("/avatar", authHandler.UploadAvatar)
	admin.Get("/posts/all", postHandler.GetAllPosts)
}
