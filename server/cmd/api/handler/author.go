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

type AuthorHandler interface {
	GetAuthors(ctx echo.Context) error
}

type authorHandler struct {
	di            *internal.Di
	authorService services.AuthorService
}

func NewAuthorHandler(di *internal.Di) (AuthorHandler, error) {
	authorService, err := internal.Invoke[services.AuthorService](di)
	if err != nil {
		return nil, err
	}

	return &authorHandler{
		di:            di,
		authorService: authorService,
	}, nil
}

func (a *authorHandler) GetAuthors(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "author"),
		slog.String("func", "GetAuthors"),
	)

	response, err := a.authorService.GetAllAuthors(ctx.Request().Context())
	if err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrAuthorsNotFound) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "not_found", "Nenhum autor foi encontrado.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}
