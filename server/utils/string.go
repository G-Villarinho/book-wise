package utils

import (
	"errors"
	"reflect"
	"strings"
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
