package services

import (
	"context"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
	"github.com/google/uuid"
)

type EvaluationService interface {
	CreateEvaluation(ctx context.Context, bookID uuid.UUID, payload models.CreateEvaluationPayload) (*models.EvaluationBasicInfoResponse, error)
	GetPaginatedEvaluationsByBookID(ctx context.Context, bookID uuid.UUID, pagination *models.Pagination) (*models.PaginatedResponse[*models.EvaluationBasicInfoResponse], error)
}

type evaluationService struct {
	di                   *internal.Di
	bookRepository       repositories.BookRepository
	evaluationRepository repositories.EvaluationRepository
	userRepository       repositories.UserRepository
}

func NewEvaluationService(di *internal.Di) (EvaluationService, error) {
	bookRepository, err := internal.Invoke[repositories.BookRepository](di)
	if err != nil {
		return nil, err
	}

	evaluationRepository, err := internal.Invoke[repositories.EvaluationRepository](di)
	if err != nil {
		return nil, err
	}

	userRepository, err := internal.Invoke[repositories.UserRepository](di)
	if err != nil {
		return nil, err
	}

	return &evaluationService{
		di:                   di,
		bookRepository:       bookRepository,
		evaluationRepository: evaluationRepository,
		userRepository:       userRepository,
	}, nil
}

func (e *evaluationService) CreateEvaluation(ctx context.Context, bookID uuid.UUID, payload models.CreateEvaluationPayload) (*models.EvaluationBasicInfoResponse, error) {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return nil, models.ErrUserNotFoundInContext
	}

	evaluation, err := e.evaluationRepository.GetUserEvaluationForBook(ctx, session.UserID, bookID)
	if err != nil {
		return nil, fmt.Errorf("get user %q evaluation to book %q: %w", session.UserID, bookID, err)
	}

	if evaluation != nil {
		return nil, models.ErrUserAlreadyEvaluteBook
	}

	user, err := e.userRepository.GetUserByID(ctx, session.UserID, nil)
	if err != nil {
		return nil, fmt.Errorf("get user by id %q: %w", session.UserID, err)
	}

	if user == nil {
		return nil, models.ErrUserNotFound
	}

	evaluation = payload.ToEvaluation(session.UserID, bookID)
	if err := e.evaluationRepository.CreateEvaluation(ctx, *evaluation); err != nil {
		return nil, fmt.Errorf("create evaluation: %w", err)
	}

	evaluation.User = *user
	return evaluation.ToEvaluationBasicInfoResponse(), nil
}

func (e *evaluationService) GetPaginatedEvaluationsByBookID(ctx context.Context, bookID uuid.UUID, pagination *models.Pagination) (*models.PaginatedResponse[*models.EvaluationBasicInfoResponse], error) {
	session, ok := ctx.Value(internal.SessionKey).(models.Session)
	if !ok {
		return nil, models.ErrUserNotFoundInContext
	}

	paginatedPublishedEvaluations, err := e.evaluationRepository.GetPaginatedEvaluationsByBookID(ctx, session.UserID, bookID, pagination)
	if err != nil {
		return nil, fmt.Errorf("get paginated evaluations by book id %q: %w", bookID, err)
	}

	paginatedPublishedEvaluationsResponse := models.MapPaginatedResult(paginatedPublishedEvaluations, func(evaluation models.Evaluation) *models.EvaluationBasicInfoResponse {
		return evaluation.ToEvaluationBasicInfoResponse()
	})

	return paginatedPublishedEvaluationsResponse, nil
}
