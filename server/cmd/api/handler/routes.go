package handler

import (
	"log"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/middleware"
	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo, di *internal.Di) {
	setupAuthRoutes(e, di)
	setupAuthorHandler(e, di)
	setupBookRoutes(e, di)
	setupCategoryRoutes(e, di)
	setupUserRoutes(e, di)
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
	group.GET("/:id", bookHandler.GetBook)
	group.GET("", bookHandler.GetBooks)
	group.DELETE("/:id", bookHandler.DeleteBook)
	group.PATCH("/:id/publish", bookHandler.PublishBook)
	group.PATCH("/:id/unpublish", bookHandler.UnpublishBook)
}

func setupCategoryRoutes(e *echo.Echo, di *internal.Di) {
	categoryHandler, err := internal.Invoke[CategoryHandler](di)
	if err != nil {
		log.Fatal("error to create category handler: ", err)
	}

	group := e.Group("/v1/categories", middleware.EnsureAuthenticated(di))

	group.GET("", categoryHandler.GetCategories)
}

func setupAuthorHandler(e *echo.Echo, di *internal.Di) {
	authorHandler, err := internal.Invoke[AuthorHandler](di)
	if err != nil {
		log.Fatal("error to create book handler: ", err)
	}

	group := e.Group("/v1/authors", middleware.EnsureAuthenticated(di))

	group.GET("/lite", authorHandler.GetAuthorsBasicInfos)
	group.GET("", authorHandler.GetAuthors)
	group.POST("", authorHandler.CreateAuthor)
	group.DELETE("/:id", authorHandler.DeleteAuthor)
}
