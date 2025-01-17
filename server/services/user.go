package services

import (
	"context"
	"errors"
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
	GetPaginatedAdmins(ctx context.Context, pagination *models.UserPagination) (*models.PaginatedResponse[*models.AdminDetailsResponse], error)
	BlockAdminByID(ctx context.Context, adminID uuid.UUID) error
}

type userService struct {
	di             *internal.Di
	cacheService   cache.CacheService
	sessionService SessionService
	userRepository repositories.UserRepository
}

func NewUserService(di *internal.Di) (UserService, error) {
	cacheService, err := internal.Invoke[cache.CacheService](di)
	if err != nil {
		return nil, err
	}

	sessionService, err := internal.Invoke[SessionService](di)
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
		sessionService: sessionService,
		userRepository: userRepository,
	}, nil
}

func (u *userService) CreateUser(ctx context.Context, payload models.CreateUserPayload, role models.Role) error {
	user, err := u.userRepository.GetUserByEmail(ctx, payload.Email, []models.Role{role})
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
	if err := u.cacheService.Set(ctx, getUserKey(session.UserID), user.ToUserResponse(), ttl); err != nil {
		return nil, fmt.Errorf("set user to cache: %w", err)
	}

	return user.ToUserResponse(), nil
}

func (u *userService) GetPaginatedAdmins(ctx context.Context, pagination *models.UserPagination) (*models.PaginatedResponse[*models.AdminDetailsResponse], error) {
	pagiantedUsers, err := u.userRepository.GetPaginatedUsersByRole(ctx, models.Admin, pagination)
	if err != nil {
		return nil, fmt.Errorf("get paginated authors: %w", err)
	}

	paginatedAdminsResponse := models.MapPaginatedResult(pagiantedUsers, func(user models.User) *models.AdminDetailsResponse {
		return user.ToAdminDetailsResponse()
	})

	return paginatedAdminsResponse, err
}

func (u *userService) BlockAdminByID(ctx context.Context, adminID uuid.UUID) error {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return models.ErrUserNotFoundInContext
	}

	if session.UserID == adminID {
		return models.ErrCannotBlockYourself
	}

	user, err := u.userRepository.GetUserByID(ctx, adminID)
	if err != nil {
		return fmt.Errorf("get user by id %q: %w", adminID, err)
	}

	if user == nil {
		return models.ErrUserNotFound
	}

	if user.Status == models.Blocked {
		return models.ErrUserAlredyBlocked
	}

	if err := u.userRepository.UpdateStatus(ctx, adminID, models.Blocked); err != nil {
		return fmt.Errorf("update user status %q: %w", adminID, err)
	}

	if err := u.sessionService.DeleteAllSessions(ctx, adminID); err != nil {
		if !errors.Is(err, models.ErrSessionNotFound) {
			return err
		}
	}

	return nil
}

func getUserKey(userID uuid.UUID) string {
	return fmt.Sprintf("user:%s", userID.String())
}
