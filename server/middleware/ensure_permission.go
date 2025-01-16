package middleware

import (
	"github.com/G-Villarinho/book-wise-api/cmd/api/responses"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/labstack/echo/v4"
)

func EnsurePermission(requiredPermission models.Permission) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			session, ok := ctx.Request().Context().Value(internal.SessionKey).(models.Session)
			if !ok {
				return responses.AccessDeniedAPIErrorResponse(ctx)
			}

			if hasPermission := models.CheckPermission(session.Role, requiredPermission); !hasPermission {
				return responses.ForbiddenPermissionAPIErrorResponse(ctx)
			}

			return next(ctx)
		}
	}
}
