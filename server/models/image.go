package models

import (
	"github.com/google/uuid"
)

type ImageUploadTask struct {
	RecordID uuid.UUID `json:"recordId"`
	Image    []byte    `json:"image"`
}

type UploadImageResponse struct {
	ID  uuid.UUID
	URL string
}
