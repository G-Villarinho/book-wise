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
	UnblockAdminByID(ctx context.Context, adminID uuid.UUID) error
	DeleteAdminByID(ctx context.Context, adminID uuid.UUID) error
	GetAdminByID(ctx context.Context, adminID uuid.UUID) (*models.AdminBasicInfoResponse, error)
	UpdateAdmin(ctx context.Context, payload models.UpdateAdminPayload) error
}

type userService struct {
	di             *internal.Di
	authService    AuthService
	cacheService   cache.CacheService
	sessionService SessionService
	userRepository repositories.UserRepository
}

func NewUserService(di *internal.Di) (UserService, error) {
	authService, err := internal.Invoke[AuthService](di)
	if err != nil {
		return nil, err
	}

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
		authService:    authService,
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

	user, err := u.userRepository.GetUserByID(ctx, session.UserID, nil)
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

	user, err := u.userRepository.GetUserByID(ctx, adminID, []models.Role{models.Admin})
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

func (u *userService) UnblockAdminByID(ctx context.Context, adminID uuid.UUID) error {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return models.ErrUserNotFoundInContext
	}

	if session.UserID == adminID {
		return models.ErrCannotUnblockYourself
	}

	user, err := u.userRepository.GetUserByID(ctx, adminID, []models.Role{models.Admin})
	if err != nil {
		return fmt.Errorf("get user by id %q: %w", adminID, err)
	}

	if user == nil {
		return models.ErrUserNotFound
	}

	if user.Status == models.Active {
		return models.ErrUserAlreadyUnblocked
	}

	if err := u.userRepository.UpdateStatus(ctx, adminID, models.Active); err != nil {
		return fmt.Errorf("update user %q status: %w", adminID, err)
	}

	return nil
}

func (u *userService) DeleteAdminByID(ctx context.Context, adminID uuid.UUID) error {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return models.ErrUserNotFoundInContext
	}

	if session.UserID == adminID {
		return models.ErrCannotDeleteYourself
	}

	user, err := u.userRepository.GetUserByID(ctx, adminID, []models.Role{models.Admin})
	if err != nil {
		return fmt.Errorf("get user by id %q: %w", adminID, err)
	}

	if user == nil {
		return models.ErrUserNotFound
	}

	if err := u.userRepository.DeleteUserByID(ctx, adminID); err != nil {
		return fmt.Errorf("delete user by ID %q: %w", adminID, err)
	}

	if err := u.sessionService.DeleteAllSessions(ctx, adminID); err != nil {
		if !errors.Is(err, models.ErrSessionNotFound) {
			return err
		}
	}

	return nil
}

func (u *userService) GetAdminByID(ctx context.Context, adminID uuid.UUID) (*models.AdminBasicInfoResponse, error) {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return nil, models.ErrUserNotFoundInContext
	}

	if session.UserID == adminID {
		return nil, models.ErrSameIDProvided
	}

	user, err := u.userRepository.GetUserByID(ctx, adminID, []models.Role{models.Admin})
	if err != nil {
		return nil, fmt.Errorf("get user by id %q: %w", adminID, err)
	}

	if user == nil {
		return nil, models.ErrUserNotFound
	}

	return user.ToAdminBasicInfoResponse(), nil
}

func (u *userService) UpdateAdmin(ctx context.Context, payload models.UpdateAdminPayload) error {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return models.ErrUserNotFoundInContext
	}

	if session.UserID == payload.AdminID {
		return models.ErrSameIDProvided
	}

	user, err := u.userRepository.GetUserByID(ctx, payload.AdminID, []models.Role{models.Admin})
	if err != nil {
		return fmt.Errorf("get user by id %q: %w", payload.AdminID, err)
	}

	if err := u.validateEmailChange(ctx, user, payload.Email); err != nil {
		return err
	}

	user.ApplyUpdate(payload)
	if err := u.userRepository.UpdateUser(ctx, *user); err != nil {
		return fmt.Errorf("update user %q: %w", payload.AdminID, err)
	}

	return nil
}

func (u *userService) validateEmailChange(ctx context.Context, user *models.User, newEmail *string) error {
	if newEmail == nil || *newEmail == user.Email {
		return nil
	}

	existsUser, err := u.userRepository.GetUserByEmail(ctx, *newEmail, nil)
	if err != nil {
		return fmt.Errorf("get user by email: %w", err)
	}

	if existsUser != nil {
		return models.ErrEmailAlreadyExists
	}

	return nil
}

func getUserKey(userID uuid.UUID) string {
	return fmt.Sprintf("user:%s", userID.String())
}
