package services

import (
	"context"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/cache"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
)

type UserService interface {
	CreateUser(ctx context.Context, payload models.CreateUserPayload) error
}

type userService struct {
	di             *internal.Di
	cacheService   cache.CacheService
	userRepository repositories.UserRepository
}

func NewUserService(di *internal.Di) (UserService, error) {
	cacheService, err := internal.Invoke[cache.CacheService](di)
	if err != nil {
		return nil, err
	}

	userRepository, err := internal.Invoke[repositories.UserRepository](di)
	if err != nil {
		return nil, err
	}

	return &userService{
		di:             di,
		cacheService:   cacheService,
		userRepository: userRepository,
	}, nil
}

func (u *userService) CreateUser(ctx context.Context, payload models.CreateUserPayload) error {
	user, err := u.userRepository.GetUserByEmail(ctx, payload.Email)
	if err != nil {
		return fmt.Errorf("get user by email: %w", err)
	}

	if user != nil {
		return models.ErrEmailAlreadyExists
	}

	user = payload.ToUser()
	if err := u.userRepository.CreateUser(ctx, *user); err != nil {
		return fmt.Errorf("create user: %w", err)
	}

	return nil
}
