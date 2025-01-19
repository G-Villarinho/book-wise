package repositories

import (
	"context"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"gorm.io/gorm"
)

type EvaluationRepository interface {
	CreateEvaluation(ctx context.Context, evaluation models.Evaluation) error
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
	if err := e.DB.WithContext(ctx).Create(evaluation).Error; err != nil {
		return err
	}

	return nil
}
