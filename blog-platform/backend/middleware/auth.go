package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

func AuthRequired(sessionStore *session.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		sess, err := sessionStore.Get(c)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Session error"})
		}

		userID := sess.Get("user_id")
		if userID == nil {
			return c.Status(401).JSON(fiber.Map{"error": "Authentication required"})
		}

		c.Locals("user_id", userID.(uint))
		c.Locals("is_admin", sess.Get("is_admin"))

		return c.Next()
	}
}

func AdminRequired(sessionStore *session.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		sess, err := sessionStore.Get(c)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Session error"})
		}

		userID := sess.Get("user_id")
		isAdmin := sess.Get("is_admin")

		if userID == nil {
			return c.Status(401).JSON(fiber.Map{"error": "Authentication required"})
		}

		if isAdmin == nil || !isAdmin.(bool) {
			return c.Status(403).JSON(fiber.Map{"error": "Admin access required"})
		}

		c.Locals("user_id", userID.(uint))
		c.Locals("is_admin", true)

		return c.Next()
	}
}
