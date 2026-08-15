package service

import (
	"blog-platform/models"
	"blog-platform/repository"
)

type PostService struct {
	postRepo *repository.PostRepository
}

func NewPostService() *PostService {
	return &PostService{
		postRepo: repository.NewPostRepository(),
	}
}

func (s *PostService) CreatePost(post *models.Post) error {
	return s.postRepo.Create(post)
}

func (s *PostService) UpdatePost(post *models.Post) error {
	return s.postRepo.Update(post)
}

func (s *PostService) DeletePost(id uint) error {
	return s.postRepo.Delete(id)
}

func (s *PostService) GetPost(id uint) (*models.Post, error) {
	return s.postRepo.FindByID(id)
}

func (s *PostService) GetPosts(section string, includeUnpublished bool) ([]models.Post, error) {
	return s.postRepo.FindAll(section, includeUnpublished)
}

func (s *PostService) IncrementViews(id uint) error {
	return s.postRepo.IncrementViews(id)
}

func (s *PostService) GetSections() ([]string, error) {
	return s.postRepo.GetSections()
}
