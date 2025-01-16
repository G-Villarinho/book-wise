package services

import (
	"context"
	"fmt"
	"time"

	"github.com/G-Villarinho/book-wise-api/cache"
	"github.com/G-Villarinho/book-wise-api/config"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
	"github.com/google/uuid"
)

type UserService interface {
	CreateUser(ctx context.Context, payload models.CreateUserPayload, role models.Role) error
	GetUser(ctx context.Context) (*models.UserResponse, error)
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

func (u *userService) CreateUser(ctx context.Context, payload models.CreateUserPayload, role models.Role) error {
	user, err := u.userRepository.GetUserByEmail(ctx, payload.Email, role)
	if err != nil {
		return fmt.Errorf("get user by email: %w", err)
	}

	if user != nil {
		return models.ErrEmailAlreadyExists
	}

	user = payload.ToUser(role)
	if err := u.userRepository.CreateUser(ctx, *user); err != nil {
		return fmt.Errorf("create user: %w", err)
	}

	return nil
}

func (u *userService) GetUser(ctx context.Context) (*models.UserResponse, error) {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return nil, models.ErrUserNotFoundInContext
	}

	var userResponse models.UserResponse
	err := u.cacheService.Get(ctx, getUserKey(session.UserID), &userResponse)
	if err == nil {
		return &userResponse, nil
	}

	if err != cache.ErrCacheMiss {
		return nil, fmt.Errorf("get user from cache: %w", err)
	}

	user, err := u.userRepository.GetUserByID(ctx, session.UserID)
	if err != nil {
		return nil, fmt.Errorf("get user by id: %w", err)
	}

	if user == nil {
		return nil, models.ErrUserNotFound
	}

	ttl := time.Duration(config.Env.Cache.CacheExp) * time.Minute
	if err := u.cacheService.Set(ctx, getUserKey(session.UserID), userResponse, ttl); err != nil {
		return nil, fmt.Errorf("set user to cache: %w", err)
	}

	return &userResponse, nil
}

func getUserKey(userID uuid.UUID) string {
	return fmt.Sprintf("user:%s", userID.String())
}
