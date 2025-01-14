package models

import (
	"database/sql"
	"errors"
	"mime/multipart"

	"github.com/google/uuid"
)

var (
	ErrAuthorsNotFound = errors.New("no authors found in database")
)

type Author struct {
	BaseModel
	FullName            string         `gorm:"column:FullName;type:varchar(255);not null"`
	AvatarURL           sql.NullString `gorm:"column:AvatarUrl;type:varchar(355);null;default:null"`
	AvatarImageClientID uuid.UUID      `gorm:"column:AvatarImageClientId;type:char(36);not null;index"`
	Nationality         string         `gorm:"column:Nationality;type:varchar(70);not null"`
	Biography           string         `gorm:"column:Biography;type:varchar(1000);not null"`
	Books               []Book         `gorm:"many2many:BookAuthors;"`
}

func (a *Author) TableName() string {
	return "Authors"
}

type CreateAuthorPayload struct {
	FullName    string                `json:"label" validate:"required,min=1,max=255"`
	Nationality string                `json:"nationality" validate:"required,min=1,max=70"`
	Biography   string                `json:"biography" validate:"required,min=1,max=1000"`
	Image       *multipart.FileHeader `json:"image" validate:"required"`
}

type AuthorResponse struct {
	ID       string `json:"id"`
	FullName string `json:"fullName"`
}

func (a *Author) ToAuthorResponse() *AuthorResponse {
	return &AuthorResponse{
		ID:       a.BaseModel.ID.String(),
		FullName: a.FullName,
	}
}

func (cap *CreateAuthorPayload) ToAuthor() *Author {
	ID, _ := uuid.NewV7()

	return &Author{
		BaseModel: BaseModel{
			ID: ID,
		},
		FullName:    cap.FullName,
		Nationality: cap.Nationality,
		Biography:   cap.Biography,
	}
}
