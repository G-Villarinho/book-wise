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
	"github.com/G-Villarinho/book-wise-api/services/email"
	"github.com/google/uuid"
	jsoniter "github.com/json-iterator/go"
)

type AuthService interface {
	SignIn(ctx context.Context, email string, roles []models.Role) error
	VeryfyMagicLink(ctx context.Context, code uuid.UUID) (string, error)
	SignOut(ctx context.Context) error
}

type authService struct {
	di              *internal.Di
	emailFactory    email.EmailFactory
	cacheService    cache.CacheService
	queueService    QueueService
	sessionService  SessionService
	userRespository repositories.UserRepository
}

func NewAuthService(di *internal.Di) (AuthService, error) {
	cacheService, err := internal.Invoke[cache.CacheService](di)
	if err != nil {
		return nil, err
	}

	queueService, err := internal.Invoke[QueueService](di)
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

	return &authService{
		di:              di,
		emailFactory:    *email.NewEmailTaskFactory(),
		cacheService:    cacheService,
		queueService:    queueService,
		sessionService:  sessionService,
		userRespository: userRepository,
	}, nil
}

func (a *authService) SignIn(ctx context.Context, email string, roles []models.Role) error {
	user, err := a.userRespository.GetUserByEmail(ctx, email, roles)
	if err != nil {
		return err
	}

	if user == nil {
		return models.ErrUserNotFound
	}

	if user.Status == models.Blocked {
		return models.ErrUserBlocked
	}

	code, err := uuid.NewV7()
	if err != nil {
		return fmt.Errorf("generate code: %w", err)
	}

	var magicLink string
	if containsRole(roles, models.Admin) {
		magicLink = fmt.Sprintf("%s/auth/link?code=%s&redirect=%s", config.Env.APIBaseURL, code.String(), config.Env.RedirectAdminURL)
	} else {
		magicLink = fmt.Sprintf("%s/auth/link?code=%s&redirect=%s", config.Env.APIBaseURL, code.String(), config.Env.RedirectMemberURL)
	}

	if err := a.cacheService.Set(ctx, getMagicLinkKey(code), user.ID.String(), 15*time.Minute); err != nil {
		return fmt.Errorf("set magic link: %w", err)
	}

	message, err := jsoniter.Marshal(a.emailFactory.CreateSignInMagicLinkEmail(user.Email, user.FullName, magicLink))
	if err != nil {
		return fmt.Errorf("marshal email task: %w", err)
	}

	if err := a.queueService.Publish(QueueSendEmail, message); err != nil {
		return fmt.Errorf("publish email task: %w", err)
	}

	return nil
}

func (a *authService) VeryfyMagicLink(ctx context.Context, code uuid.UUID) (string, error) {
	var userID uuid.UUID
	if err := a.cacheService.Get(ctx, getMagicLinkKey(code), &userID); err != nil {
		if errors.Is(err, cache.ErrCacheMiss) {
			return "", models.ErrMagicLinkNotFound
		}
		return "", fmt.Errorf("get magic link: %w", err)
	}

	user, err := a.userRespository.GetUserByID(ctx, userID, nil)
	if err != nil {
		return "", fmt.Errorf("get user by id: %w", err)
	}

	if user == nil {
		return "", models.ErrUserNotFound
	}

	session, err := a.sessionService.CreateSession(ctx, user.ID, user.Role)
	if err != nil {
		return "", fmt.Errorf("create session: %w", err)
	}

	if err := a.cacheService.Delete(ctx, getMagicLinkKey(code)); err != nil {
		return "", fmt.Errorf("delete magic link: %w", err)
	}

	return session.Token, nil
}

func (a *authService) SignOut(ctx context.Context) error {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return models.ErrSessionNotFound
	}

	if err := a.sessionService.DeleteSession(ctx, session.SessionID); err != nil {
		return fmt.Errorf("delete session: %w", err)
	}

	return nil
}

func containsRole(roles []models.Role, role models.Role) bool {
	for _, r := range roles {
		if r == role {
			return true
		}
	}
	return false
}

func getMagicLinkKey(code uuid.UUID) string {
	return fmt.Sprintf("magic-link:%s", code.String())
}
