package handler

import (
	"errors"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/G-Villarinho/book-wise-api/cmd/api/responses"
	"github.com/G-Villarinho/book-wise-api/cmd/api/validation"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/services"
	"github.com/G-Villarinho/book-wise-api/utils"
	"github.com/google/uuid"
	jsoniter "github.com/json-iterator/go"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

type BookHandler interface {
	CreateBook(ctx echo.Context) error
	SearchExternalBooks(ctx echo.Context) error
	GetExternalBookByID(ctx echo.Context) error
	GetBookByID(ctx echo.Context) error
	GetBooks(ctx echo.Context) error
}

type bookHandler struct {
	di          *internal.Di
	bookService services.BookService
}

func NewBookHandler(di *internal.Di) (BookHandler, error) {
	bookService, err := internal.Invoke[services.BookService](di)
	if err != nil {
		return nil, err
	}

	return &bookHandler{
		di:          di,
		bookService: bookService,
	}, nil
}

func (b *bookHandler) CreateBook(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "book"),
		slog.String("func", "CreateBook"),
	)

	var payload models.CreateBookPayload
	if err := jsoniter.NewDecoder(ctx.Request().Body).Decode(&payload); err != nil {
		log.Warn("Error to decode JSON payload", slog.String("error", err.Error()))
		return responses.CannotBindPayloadAPIErrorResponse(ctx)
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

	response, err := b.bookService.CreateBook(ctx.Request().Context(), payload)
	if err != nil {
		log.Error(err.Error())

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (b *bookHandler) SearchExternalBooks(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "book"),
		slog.String("func", "SearchExternalBooks"),
	)

	page, err := strconv.Atoi(ctx.QueryParam("page"))
	if err != nil {
		log.Error(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusBadRequest, "invalid_pagination", "Parametros de busca inválidos.")
	}

	response, err := b.bookService.SearchExternalBook(ctx.Request().Context(), ctx.QueryParam("q"), page)
	if err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrSearchExternalBooksEmpty) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "not_found", "Nenhum livro foi encontrado para a sua procura.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (b *bookHandler) GetExternalBookByID(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "book"),
		slog.String("func", "GetExternalBookByID"),
	)

	response, err := b.bookService.GetExternalBookByID(ctx.Request().Context(), ctx.Param("externalId"))
	if err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrExternalBookNotFound) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "not_found", "Nenhum livro foi encontrado para a sua procura.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (b *bookHandler) GetBookByID(ctx echo.Context) error {
	ID, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		log.Error(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusBadRequest, "invalid_params", "Parametros de busca inválidos.")
	}

	response, err := b.bookService.GetBookByID(ctx.Request().Context(), ID)
	if err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrBookNotFound) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "not_found", "Nenhum livro foi encontrado.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (b *bookHandler) GetBooks(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "books"),
		slog.String("func", "GetBooks"),
	)

	pagination, err := models.NewPagination(ctx.QueryParam("page"), ctx.QueryParam("limit"), ctx.QueryParam("sort"))
	if err != nil {
		log.Error(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusBadRequest, "invalid_pagination", "Parâmetros de buscas inválidos")
	}

	bookPagination := &models.BookPagination{
		Pagination: *pagination,
		Title:      utils.GetQueryStringPointer(ctx.QueryParam("title")),
		BookID:     utils.GetQueryStringPointer(ctx.QueryParam("bookId")),
		AuthorID:   utils.GetQueryStringPointer(ctx.QueryParam("authorId")),
		CategoryID: utils.GetQueryStringPointer(ctx.QueryParam("categoryId")),
	}

	response, err := b.bookService.GetPaginatedBooks(ctx.Request().Context(), bookPagination)
	if err != nil {
		log.Error(err.Error())
		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
}
