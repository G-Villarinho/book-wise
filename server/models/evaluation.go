package models

import "github.com/google/uuid"

type Evaluation struct {
	BaseModel
	Rate        uint8     `gorm:"column:Rate;type:TINYINT;not null;default:0"`
	Description string    `gorm:"column:Description;type:varchar(2000);not null"`
	UserID      uuid.UUID `gorm:"column:UserId;type:char(36);not null"`
	BookID      uuid.UUID `gorm:"column:BookId;type:char(36);not null"`
	User        User      `gorm:"foreignKey:UserID;references:ID"`
	Book        Book      `gorm:"foreignKey:BookID;references:ID"`
}

func (e *Evaluation) TableName() string {
	return "Evaluations"
}
