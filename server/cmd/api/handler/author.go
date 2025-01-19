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
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type AuthorHandler interface {
	GetAuthorsBasicInfos(ctx echo.Context) error
	CreateAuthor(ctx echo.Context) error
	GetAuthors(ctx echo.Context) error
	DeleteAuthor(ctx echo.Context) error
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

func (a *authorHandler) GetAuthorsBasicInfos(ctx echo.Context) error {
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
		FullName:    ctx.FormValue("fullName"),
		Image:       file,
		Nationality: ctx.FormValue("nationality"),
		Biography:   ctx.FormValue("biography"),
	}

	validationErrors := validation.ValidateStruct(&payload)
	if validationErrors != nil {
		if msg, exists := validationErrors["validation_setup"]; exists {
			log.Warn("Error in validation setup", slog.String("message", msg))
			return responses.CannotBindPayloadAPIErrorResponse(ctx)
		}
		return responses.NewValidationErrorResponse(ctx, validationErrors)
	}
	if err := a.authorService.CreateAuthor(ctx.Request().Context(), payload); err != nil {
		log.Error(err.Error())

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.NoContent(http.StatusCreated)
}

func (a *authorHandler) GetAuthors(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "authors"),
		slog.String("func", "GetAuthors"),
	)

	authorPagination, err := models.NewAuthorPagination(
		ctx.QueryParam("page"),
		ctx.QueryParam("limit"),
		ctx.QueryParam("sort"),
		ctx.QueryParam("fullName"),
		ctx.QueryParam("authorId"),
	)
	if err != nil {
		log.Error(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusBadRequest, "invalid_pagination", "Parâmetros de buscas inválidos")
	}

	response, err := a.authorService.GetPaginatedAuthors(ctx.Request().Context(), authorPagination)
	if err != nil {
		log.Error(err.Error())
		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (a *authorHandler) DeleteAuthor(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "authors"),
		slog.String("func", "DeleteAuthor"),
	)

	ID, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		log.Warn(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusBadRequest, "invalid_params", "Parametros de busca inválidos.")
	}

	if err := a.authorService.DeleteAuthorByID(ctx.Request().Context(), ID); err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrAuthorNotFound) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusBadRequest, "not_found", "Não foi encontrado um autor para remover com esses parâmetros de busca.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.NoContent(http.StatusNoContent)
}
