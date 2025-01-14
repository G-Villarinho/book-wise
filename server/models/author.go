package models

import (
	"database/sql"
	"errors"
	"mime/multipart"
	"time"

	"github.com/G-Villarinho/book-wise-api/utils"
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

type AuthorPagination struct {
	Pagination
	AuthorID *string `json:"authorId"`
	FullName *string `json:"fullName"`
}

type CreateAuthorPayload struct {
	FullName    string                `json:"label" validate:"required,min=1,max=255"`
	Nationality string                `json:"nationality" validate:"required,min=1,max=70"`
	Biography   string                `json:"biography" validate:"required,min=1,max=1000"`
	Image       *multipart.FileHeader `json:"image" validate:"required"`
}

type AuthorBasicInfoResponse struct {
	ID        string `json:"id"`
	AvatarURL string `json:"avatarUrl"`
	FullName  string `json:"fullName"`
}

type AuthorDetailsResponse struct {
	ID          string    `json:"id"`
	FullName    string    `json:"fullName"`
	Nationality string    `json:"nationality"`
	Biography   string    `json:"biography"`
	AvatarURL   string    `json:"avatarUrl"`
	CreatedAt   time.Time `json:"createdAt"`
}

func (a *Author) ToAuthorBasicInfoResponse() *AuthorBasicInfoResponse {
	return &AuthorBasicInfoResponse{
		ID:       a.BaseModel.ID.String(),
		FullName: a.FullName,
	}
}

func (a *Author) ToAuthorDetailsResponse() *AuthorDetailsResponse {
	return &AuthorDetailsResponse{
		ID:          a.BaseModel.ID.String(),
		FullName:    a.FullName,
		Nationality: a.Nationality,
		Biography:   a.Biography,
		AvatarURL:   a.AvatarURL.String,
		CreatedAt:   a.CreatedAt,
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

func NewAuthorPagination(page, limit, sort, fullName, authorID string) (*AuthorPagination, error) {
	pagination, err := NewPagination(page, limit, sort)
	if err != nil {
		return nil, err
	}

	authorPagination := &AuthorPagination{
		Pagination: *pagination,
		FullName:   utils.GetQueryStringPointer(fullName),
		AuthorID:   utils.GetQueryStringPointer(authorID),
	}

	return authorPagination, nil
}
