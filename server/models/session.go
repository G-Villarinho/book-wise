package models

import (
	"errors"

	"github.com/google/uuid"
)

var (
	ErrSessionNotFound = errors.New("session not found in the cache")
)

type Session struct {
	UserID    uuid.UUID `json:"userId"`
	SessionID uuid.UUID `json:"sessionId"`
	Role      Role      `json:"role"`
	Token     string    `json:"token"`
	CreatedAt int64     `json:"createdAt"`
}
