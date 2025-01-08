package models

type Book struct {
	BaseModel
	Title            string `gorm:"column:Title;type:varchar(500);not null"`
	Description      string `gorm:"column:Description;type:varchar(2000);not null"`
	TotalPages       uint   `gorm:"column:TotalPages;type:INT UNSIGNED;not null;default:0"`
	TotalEvaluations uint   `gorm:"column:TotalEvaluations;type:INT UNSIGNED;not null;default:0"`
	CoverImageURL    string `gorm:"column:Avatar;type:varchar(500);not null"`

	Authors []Author `gorm:"many2many:BookAuthors;"`
}

func (b *Book) TableName() string {
	return "Books"
}
