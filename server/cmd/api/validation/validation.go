package validation

import (
	"strings"

	"github.com/G-Villarinho/book-wise-api/utils"
	"github.com/go-playground/validator/v10"
)

type ValidationErrors map[string]string

func ValidateStruct(s any) ValidationErrors {
	if err := utils.TrimStrings(s); err != nil {
		return ValidationErrors{"validation_setup": err.Error()}
	}

	validate := validator.New()

	if err := SetupCustomValidations(validate); err != nil {
		return ValidationErrors{"validation_setup": err.Error()}
	}

	validationErrors := make(ValidationErrors)
	if err := validate.Struct(s); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			fieldName := strings.ToLower(err.Field())
			validationErrors[fieldName] = getErrorMessage(err)
		}
	}

	if len(validationErrors) > 0 {
		return validationErrors
	}

	return nil
}

func getErrorMessage(err validator.FieldError) string {
	if msg, exists := ValidationMessages[err.Tag()]; exists {
		return msg
	}
	return "Invalid value"
}
