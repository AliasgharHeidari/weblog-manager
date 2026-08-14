package models

import (
	"time"
	"gorm.io/gorm"
)

type Post struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Title     string         `json:"title" gorm:"size:255;not null"`
	Content   string         `json:"content" gorm:"type:text;not null"`
	Section   string         `json:"section" gorm:"size:50;index"`
	ImageURL  string         `json:"image_url" gorm:"size:255"`
	Published bool           `json:"published" gorm:"default:true"`
	Views     int            `json:"views" gorm:"default:0"`
	AuthorID  uint           `json:"author_id" gorm:"not null"`
	Author    User           `json:"author" gorm:"foreignKey:AuthorID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
