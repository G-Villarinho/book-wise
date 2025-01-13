package handler

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/G-Villarinho/book-wise-api/cmd/api/responses"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/services"
	"github.com/labstack/echo/v4"
)

type CategoryHandler interface {
	GetCategories(ctx echo.Context) error
}

type categoryHandler struct {
	di              *internal.Di
	categoryService services.CategoryService
}

func NewCategoryHandler(di *internal.Di) (CategoryHandler, error) {
	categoryService, err := internal.Invoke[services.CategoryService](di)
	if err != nil {
		return nil, err
	}

	return &categoryHandler{
		di:              di,
		categoryService: categoryService,
	}, nil
}

func (c *categoryHandler) GetCategories(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "category"),
		slog.String("func", "GetCategories"),
	)

	response, err := c.categoryService.GetAllCategories(ctx.Request().Context())
	if err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrCategoriesNotFound) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "not_found", "Nenhuma categoria foi encontrado.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}
