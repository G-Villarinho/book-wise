package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

var (
	ErrUserAlreadyEvaluteBook = errors.New("the user has already evaluated this book")
)

type Evaluation struct {
	BaseModel
	Rate        uint8     `gorm:"column:Rate;type:TINYINT;not null;default:0"`
	Description string    `gorm:"column:Description;type:varchar(500);not null"`
	UserID      uuid.UUID `gorm:"column:UserId;type:char(36);not null"`
	BookID      uuid.UUID `gorm:"column:BookId;type:char(36);not null"`
	User        User      `gorm:"foreignKey:UserID;references:ID"`
	Book        Book      `gorm:"foreignKey:BookID;references:ID"`
}

func (e *Evaluation) TableName() string {
	return "Evaluations"
}

type CreateEvaluationPayload struct {
	Rate        uint8  `json:"rate" validate:"required,gte=1,lte=5"`
	Description string `json:"description" validate:"required,max=500"`
}

type EvaluationBasicInfoResponse struct {
	ID            string    `json:"id"`
	UserFullName  string    `json:"userFullName"`
	UserAvatarURL string    `json:"userAvatarUrl,omitempty"`
	Rate          uint8     `json:"rate"`
	Description   string    `json:"description"`
	CreatedAt     time.Time `json:"createdAt"`
}

func (cep *CreateEvaluationPayload) ToEvaluation(userID, bookID uuid.UUID) *Evaluation {
	ID, _ := uuid.NewV7()

	return &Evaluation{
		BaseModel: BaseModel{
			ID:        ID,
			CreatedAt: time.Now().UTC(),
		},
		Rate:        cep.Rate,
		Description: cep.Description,
		UserID:      userID,
		BookID:      bookID,
	}
}
func (e *Evaluation) ToEvaluationBasicInfoResponse(user User) *EvaluationBasicInfoResponse {
	return &EvaluationBasicInfoResponse{
		ID:            e.ID.String(),
		UserFullName:  user.FullName,
		UserAvatarURL: user.Avatar.String,
		Rate:          e.Rate,
		Description:   e.Description,
		CreatedAt:     e.CreatedAt,
	}
}
