package repository

import (
	"errors"

	"blog-platform/database"
	"blog-platform/models"

	"gorm.io/gorm"
)

type SettingRepository struct{}

func NewSettingRepository() *SettingRepository {
	return &SettingRepository{}
}

func (r *SettingRepository) Get(key string) (string, error) {
	var setting models.Setting
	err := database.DB.Where("key = ?", key).First(&setting).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil
		}
		return "", err
	}
	return setting.Value, nil
}

func (r *SettingRepository) Set(key, value string) error {
	var setting models.Setting
	err := database.DB.Where("key = ?", key).First(&setting).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			setting = models.Setting{Key: key, Value: value}
			return database.DB.Create(&setting).Error
		}
		return err
	}

	setting.Value = value
	return database.DB.Save(&setting).Error
}
