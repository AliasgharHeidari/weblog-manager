package service

import (
	"errors"

	"blog-platform/models"
	"blog-platform/repository"
)

type AuthService struct {
	userRepo    *repository.UserRepository
	settingRepo *repository.SettingRepository
}

func NewAuthService() *AuthService {
	return &AuthService{
		userRepo:    repository.NewUserRepository(),
		settingRepo: repository.NewSettingRepository(),
	}
}

func (s *AuthService) Register(username, email, password string) (*models.User, error) {
	// Check if registration is enabled
	registrationEnabled, err := s.settingRepo.Get("registration_enabled")
	if err != nil {
		return nil, err
	}
	
	if registrationEnabled == "" {
		registrationEnabled = "true"
	}
	
	if registrationEnabled == "false" {
		return nil, errors.New("registration is currently disabled")
	}

	// Check if user exists
	existingUser, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("user with this email already exists")
	}

	existingUser, err = s.userRepo.FindByUsername(username)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("username is already taken")
	}

	user := &models.User{
		Username: username,
		Email:    email,
		IsAdmin:  true, // همه کاربران admin هستند
	}

	err = user.HashPassword(password)
	if err != nil {
		return nil, err
	}

	err = s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(email, password string) (*models.User, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("invalid email or password")
	}

	if !user.CheckPassword(password) {
		return nil, errors.New("invalid email or password")
	}

	return user, nil
}
