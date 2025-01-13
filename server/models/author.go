package models

import "errors"

var (
	ErrAuthorsNotFound = errors.New("no authors found in database")
)

type Author struct {
	BaseModel
	FullName           string `gorm:"column:FullName;type:varchar(255);not null"`
	NormalizedFullName string `gorm:"column:NormalizedFullName;type:varchar(255);not null;unique"`
	Books              []Book `gorm:"many2many:BookAuthors;"`
}

func (a *Author) TableName() string {
	return "Authors"
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
