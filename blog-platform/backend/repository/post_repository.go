package repository

import (
	"errors"

	"blog-platform/database"
	"blog-platform/models"

	"gorm.io/gorm"
)

type PostRepository struct{}

func NewPostRepository() *PostRepository {
	return &PostRepository{}
}

func (r *PostRepository) Create(post *models.Post) error {
	return database.DB.Create(post).Error
}

func (r *PostRepository) Update(post *models.Post) error {
	return database.DB.Save(post).Error
}

func (r *PostRepository) Delete(id uint) error {
	return database.DB.Delete(&models.Post{}, id).Error
}

func (r *PostRepository) FindByID(id uint) (*models.Post, error) {
	var post models.Post
	err := database.DB.Preload("Author").First(&post, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &post, nil
}

func (r *PostRepository) FindAll(section string, includeUnpublished bool) ([]models.Post, error) {
	var posts []models.Post
	query := database.DB.Preload("Author").Order("created_at DESC")

	if section != "" {
		query = query.Where("section = ?", section)
	}

	if !includeUnpublished {
		query = query.Where("published = ?", true)
	}

	err := query.Find(&posts).Error
	return posts, err
}

func (r *PostRepository) IncrementViews(id uint) error {
	return database.DB.Model(&models.Post{}).Where("id = ?", id).
		UpdateColumn("views", gorm.Expr("views + ?", 1)).Error
}

func (r *PostRepository) GetSections() ([]string, error) {
	var sections []string
	err := database.DB.Model(&models.Post{}).
		Where("published = ?", true).
		Distinct("section").
		Pluck("section", &sections).Error
	return sections, err
}
