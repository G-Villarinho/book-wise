package repositories

import (
	"context"
	"errors"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EvaluationRepository interface {
	CreateEvaluation(ctx context.Context, evaluation models.Evaluation) error
	GetUserEvaluationForBook(ctx context.Context, userID, bookID uuid.UUID) (*models.Evaluation, error)
	GetPaginatedEvaluationsByBookID(ctx context.Context, userID, bookID uuid.UUID, pagination *models.Pagination) (*models.PaginatedResponse[models.Evaluation], error)
}

type evaluationRepository struct {
	di *internal.Di
	DB *gorm.DB
}

func NewEvaluationRepository(di *internal.Di) (EvaluationRepository, error) {
	DB, err := internal.Invoke[*gorm.DB](di)
	if err != nil {
		return nil, err
	}

	return &evaluationRepository{
		di: di,
		DB: DB,
	}, nil
}

func (e *evaluationRepository) CreateEvaluation(ctx context.Context, evaluation models.Evaluation) error {
	tx := e.DB.WithContext(ctx).Begin()
	if tx.Error != nil {
		return tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Create(&evaluation).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Model(&models.Book{}).
		Where("ID = ?", evaluation.BookID).
		UpdateColumn("TotalEvaluations", gorm.Expr("TotalEvaluations + ?", 1)).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (e *evaluationRepository) GetUserEvaluationForBook(ctx context.Context, userID, bookID uuid.UUID) (*models.Evaluation, error) {
	var evaluation models.Evaluation
	if err := e.DB.WithContext(ctx).
		Where("UserId = ? AND BookId = ?", userID, bookID).
		First(&evaluation).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}

		return nil, err
	}

	return &evaluation, nil
}

func (e *evaluationRepository) GetPaginatedEvaluationsByBookID(ctx context.Context, userID, bookID uuid.UUID, pagination *models.Pagination) (*models.PaginatedResponse[models.Evaluation], error) {
	query := e.DB.
		WithContext(ctx).
		Model(&models.Evaluation{}).
		Where("BookId = ?", bookID).
		Preload("User")

	userEvaluationSubquery := e.DB.WithContext(ctx).
		Model(&models.Evaluation{}).
		Where("UserId = ? AND BookId = ?", userID, bookID).
		Preload("User").
		Limit(1)

	var userEvaluation models.Evaluation
	if err := userEvaluationSubquery.First(&userEvaluation).Error; err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	if userEvaluation.ID != uuid.Nil {
		query = query.Where("Id != ?", userEvaluation.ID)
	}

	query = query.Order("createdAt DESC")

	evaluations, err := paginate[models.Evaluation](query, pagination, &models.Evaluation{})
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	if userEvaluation.ID != uuid.Nil {
		evaluations.Data = append([]models.Evaluation{userEvaluation}, evaluations.Data...)
	}

	return evaluations, nil
}
