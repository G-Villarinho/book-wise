package utils

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
)

const (
	MaxImageSize = 5 * 1024 * 1024
)

func ValidateImage(file *multipart.FileHeader) error {
	if file.Size > MaxImageSize {
		return fmt.Errorf("file size exceeds the maximum allowed size of 5 MB")
	}

	src, err := file.Open()
	if err != nil {
		return fmt.Errorf("unable to open file: %w", err)
	}
	defer src.Close()

	buffer := make([]byte, 512)
	if _, err := src.Read(buffer); err != nil {
		return fmt.Errorf("unable to read file: %w", err)
	}

	fileType := http.DetectContentType(buffer)

	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
		"image/gif":  false,
		"image/webp": false,
		"image/bmp":  false,
		"image/tiff": false,
	}

	if !allowedTypes[fileType] {
		return fmt.Errorf("file type '%s' is not allowed. Allowed types are: JPEG, PNG, GIF, WEBP, BMP, TIFF", fileType)
	}

	if _, err := src.Seek(0, 0); err != nil {
		return errors.New("file is corrupted or unreadable")
	}

	return nil
}

func ConvertImageToBytes(image *multipart.FileHeader) ([]byte, error) {
	file, err := image.Open()
	if err != nil {
		return nil, fmt.Errorf("open image file: %v", err)
	}
	defer file.Close()

	imageBytes, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("read image file: %v", err)
	}

	return imageBytes, nil
}
