package handler

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/G-Villarinho/book-wise-api/cmd/api/responses"
	"github.com/G-Villarinho/book-wise-api/cmd/api/validation"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/services"
	"github.com/G-Villarinho/book-wise-api/utils"
	"github.com/labstack/echo/v4"
)

type AuthorHandler interface {
	GetAuthors(ctx echo.Context) error
	CreateAuthor(ctx echo.Context) error
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

func (a *authorHandler) CreateAuthor(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "author"),
		slog.String("func", "CreateAuthor"),
	)

	file, err := ctx.FormFile("avatar_author")
	if err != nil {
		log.Error(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "invalid_image", "Somente arquivos de imagem com tamanho até 5 MB e nos formatos JPG, JPEG e PNG são permitidos.")
	}

	if err := utils.ValidateImage(file); err != nil {
		log.Error(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "invalid_image", "Somente arquivos de imagem com tamanho até 5 MB e nos formatos JPG, JPEG e PNG são permitidos.")
	}

	payload := models.CreateAuthorPayload{
		FullName: ctx.FormValue("fullName"),
		Image:    file,
	}

	validationErrors, err := validation.ValidateStruct(&payload)
	if err != nil {
		log.Warn(err.Error())
		return responses.CannotBindPayloadAPIErrorResponse(ctx)
	}

	if validationErrors != nil {
		log.Warn("Error to validate JSON payload")
		return responses.NewValidationErrorResponse(ctx, validationErrors)
	}

	if err := a.authorService.CreateAuthor(ctx.Request().Context(), payload); err != nil {
		log.Error(err.Error())

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.NoContent(http.StatusCreated)
}
