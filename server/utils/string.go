package utils

import (
	"errors"
	"reflect"
	"strings"
	"unicode"
)

func TrimStrings(payload any) error {
	v := reflect.ValueOf(payload)
	t := reflect.TypeOf(payload)

	if t.Kind() != reflect.Ptr || v.Elem().Kind() != reflect.Struct {
		return errors.New("TrimStrings: payload deve ser um ponteiro para um struct")
	}

	v = v.Elem()
	t = t.Elem()

	for i := 0; i < t.NumField(); i++ {
		field := v.Field(i)

		if field.Kind() == reflect.String {
			field.SetString(strings.TrimSpace(field.String()))
		}

		if field.Kind() == reflect.Struct {
			err := TrimStrings(field.Addr().Interface())
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func NormalizeString(str string) string {
	normalized := strings.ToLower(strings.TrimSpace(str))

	var result []rune
	for _, r := range normalized {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || unicode.IsSpace(r) {
			result = append(result, r)
		}
	}
	return string(result)
}

func GetQueryStringPointer(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}
