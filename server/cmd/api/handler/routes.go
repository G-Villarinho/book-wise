package handler

import (
	"log"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/middleware"
	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo, di *internal.Di) {
	setupUserRoutes(e, di)
	setupAuthRoutes(e, di)
	setupBookRoutes(e, di)
}

func setupUserRoutes(e *echo.Echo, di *internal.Di) {
	userHandler, err := internal.Invoke[UserHandler](di)
	if err != nil {
		log.Fatal("error to create user handler: ", err)
	}

	group := e.Group("/v1/users")

	group.POST("", userHandler.CreateUser)
}

func setupAuthRoutes(e *echo.Echo, di *internal.Di) {
	authHandler, err := internal.Invoke[AuthHandler](di)
	if err != nil {
		log.Fatal("error to create auth handler: ", err)
	}

	group := e.Group("/v1/auth")

	group.POST("/sign-in", authHandler.SignIn)
	group.GET("/link", authHandler.VeryfyMagicLink)
	group.POST("/sign-out", authHandler.SignOut, middleware.EnsureAuthenticated(di))
}

func setupBookRoutes(e *echo.Echo, di *internal.Di) {
	bookHandler, err := internal.Invoke[BookHandler](di)
	if err != nil {
		log.Fatal("error to create book handler: ", err)
	}

	group := e.Group("/v1/books", middleware.EnsureAuthenticated(di))

	group.POST("", bookHandler.CreateBook)
	group.GET("/external/search", bookHandler.SearchExternalBooks)
	group.GET("/external/:externalId", bookHandler.GetExternalBookByID)
}
