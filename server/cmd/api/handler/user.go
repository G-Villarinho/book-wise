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
	jsoniter "github.com/json-iterator/go"
	"github.com/labstack/echo/v4"
)

type UserHandler interface {
	CreateMember(ctx echo.Context) error
	CreateAdmin(ctx echo.Context) error
	GetUser(ctx echo.Context) error
}

type userHandler struct {
	di          *internal.Di
	userService services.UserService
}

func NewUserHandler(di *internal.Di) (UserHandler, error) {
	userService, err := internal.Invoke[services.UserService](di)
	if err != nil {
		return nil, err
	}

	return &userHandler{
		di:          di,
		userService: userService,
	}, nil
}

func (u *userHandler) CreateMember(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "user"),
		slog.String("func", "CreateMember"),
	)

	var payload models.CreateUserPayload
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

	if err := u.userService.CreateUser(ctx.Request().Context(), payload, models.Member); err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrEmailAlreadyExists) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusConflict, "Conflito", "O e-mail informado já está em uso. Por favor, tente novamente com outro e-mail.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.NoContent(http.StatusCreated)
}

func (u *userHandler) CreateAdmin(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "user"),
		slog.String("func", "CreateAdmin"),
	)

	var payload models.CreateUserPayload
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

	if err := u.userService.CreateUser(ctx.Request().Context(), payload, models.Admin); err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrEmailAlreadyExists) {
			return responses.NewCustomValidationAPIErrorResponse(ctx, http.StatusConflict, "Conflito", "O e-mail informado já está em uso por outro admin. Por favor, tente novamente com outro e-mail.")
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.NoContent(http.StatusCreated)
}

func (u *userHandler) GetUser(ctx echo.Context) error {
	log := slog.With(
		slog.String("handler", "user"),
		slog.String("func", "GetUser"),
	)

	response, err := u.userService.GetUser(ctx.Request().Context())
	if err != nil {
		log.Error(err.Error())

		if errors.Is(err, models.ErrUserNotFound) {
			return responses.AccessDeniedAPIErrorResponse(ctx)
		}

		if errors.Is(err, models.ErrUserNotFoundInContext) {
			return responses.AccessDeniedAPIErrorResponse(ctx)
		}

		return responses.InternalServerAPIErrorResponse(ctx)
	}

	return ctx.JSON(http.StatusOK, response)

}
