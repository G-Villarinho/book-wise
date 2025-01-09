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
	jsoniter "github.com/json-iterator/go"
	"github.com/labstack/echo/v4"
)

type BookHandler interface {
	SearchBooks(ctx echo.Context) error
	CreateBook(ctx echo.Context) error
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

func (b *bookHandler) SearchBooks(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "book"),
		slog.String("func", "SearchBooks"),
	)

	page, err := strconv.Atoi(ctx.QueryParam("page"))
	if err != nil {
		log.Error(err.Error())
		return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusBadRequest, "invalid_pagination", "Parametros de busca inválidos.")
	}

	response, err := b.bookService.SearchBook(ctx.Request().Context(), ctx.QueryParam("q"), page)
	if err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrSearchBooksEmpty) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusNotFound, "not_found", "Nenhum livro foi encontrado para a sua procura.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)
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
