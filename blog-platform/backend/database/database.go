package database

import (
	"fmt"
	"log"

	"blog-platform/config"
	"blog-platform/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(cfg *config.Config) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")

	// Auto migrate
	err = DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Setting{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	log.Println("Database migration completed")

	// Seed default settings
	seedSettings()
}

func seedSettings() {
	// Check if registration_enabled setting exists
	var count int64
	DB.Model(&models.Setting{}).Where("key = ?", "registration_enabled").Count(&count)
	
	if count == 0 {
		setting := models.Setting{
			Key:   "registration_enabled",
			Value: "true",
		}
		if err := DB.Create(&setting).Error; err != nil {
			log.Println("Failed to seed registration_enabled setting:", err)
		} else {
			log.Println("Seeded registration_enabled setting")
		}
	}
}
