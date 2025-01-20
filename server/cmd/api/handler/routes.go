package handler

import (
	"log"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/middleware"
	"github.com/G-Villarinho/book-wise-api/models"
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

	userGroup := e.Group("/v1/users")
	userGroup.POST("/member", userHandler.CreateMember)
	userGroup.GET("/me", userHandler.GetUser, middleware.EnsureAuthenticated(di))

	adminGroup := userGroup.Group("/admins", middleware.EnsureAuthenticated(di))
	adminGroup.POST("", userHandler.CreateAdmin, middleware.EnsurePermission(models.CreateAdminPermission))
	adminGroup.GET("", userHandler.GetAdmins, middleware.EnsurePermission(models.ListAdminsPermission))
	adminGroup.PATCH("/block", userHandler.BlockAdmin, middleware.EnsurePermission(models.BlockAdminPermission))
	adminGroup.PATCH("/unblock", userHandler.UnblockAdmin, middleware.EnsurePermission(models.UnblockAdminPermission))
	adminGroup.DELETE("/:adminId", userHandler.DeleteAdmin, middleware.EnsurePermission(models.DeleteAdminPermission))
	adminGroup.GET("/:adminId", userHandler.GetAdmin, middleware.EnsurePermission(models.GetAdminPermission))
	adminGroup.PUT("", userHandler.UpdateAdmin, middleware.EnsurePermission(models.UpdateAdminPermission))
}
func setupAuthRoutes(e *echo.Echo, di *internal.Di) {
	authHandler, err := internal.Invoke[AuthHandler](di)
	if err != nil {
		log.Fatal("error to create auth handler: ", err)
	}

	group := e.Group("/v1/auth")

	group.POST("/member/sign-in", authHandler.SignInMember)
	group.POST("/admin/sign-in", authHandler.SignInAdmin)
	group.GET("/link", authHandler.VeryfyMagicLink)
	group.POST("/sign-out", authHandler.SignOut, middleware.EnsureAuthenticated(di))
}

func setupBookRoutes(e *echo.Echo, di *internal.Di) {
	bookHandler, err := internal.Invoke[BookHandler](di)
	if err != nil {
		log.Fatal("error to create book handler: ", err)
	}

	group := e.Group("/v1/books", middleware.EnsureAuthenticated(di))

	group.POST("", bookHandler.CreateBook, middleware.EnsurePermission(models.CreateBookPermission))
	group.GET("/external/search", bookHandler.SearchExternalBooks, middleware.EnsurePermission(models.ListExternalBooksPermission))
	group.GET("/external/:externalId", bookHandler.GetExternalBookByID, middleware.EnsurePermission(models.GetExternalBooksPermission))
	group.GET("/:id", bookHandler.GetBook, middleware.EnsurePermission(models.GetBookPermission))
	group.GET("", bookHandler.GetBooks, middleware.EnsurePermission(models.ListBooksPermission))
	group.DELETE("/:id", bookHandler.DeleteBook, middleware.EnsurePermission(models.DeleteBookPermission))
	group.PATCH("/:id/publish", bookHandler.PublishBook, middleware.EnsurePermission(models.PublishBookPermission))
	group.PATCH("/:id/unpublish", bookHandler.UnpublishBook, middleware.EnsurePermission(models.UnpublishBookPermission))

	group.POST("/:id/evaluations", bookHandler.EvaluateBook)
	group.GET("/published", bookHandler.GetPublishedBooks)
}

func setupCategoryRoutes(e *echo.Echo, di *internal.Di) {
	categoryHandler, err := internal.Invoke[CategoryHandler](di)
	if err != nil {
		log.Fatal("error to create category handler: ", err)
	}

	group := e.Group("/v1/categories", middleware.EnsureAuthenticated(di))

	group.GET("", categoryHandler.GetCategories)
	group.GET("/top", categoryHandler.GetTopCategories)
}

func setupAuthorHandler(e *echo.Echo, di *internal.Di) {
	authorHandler, err := internal.Invoke[AuthorHandler](di)
	if err != nil {
		log.Fatal("error to create book handler: ", err)
	}

	group := e.Group("/v1/authors", middleware.EnsureAuthenticated(di))

	group.GET("/lite", authorHandler.GetAuthorsBasicInfos, middleware.EnsurePermission(models.ListAuthorsPermission))
	group.GET("", authorHandler.GetAuthors, middleware.EnsurePermission(models.ListAuthorsPermission))
	group.POST("", authorHandler.CreateAuthor, middleware.EnsurePermission(models.CreateAuthorPermission))
	group.DELETE("/:id", authorHandler.DeleteAuthor, middleware.EnsurePermission(models.DeleteAuthorPermission))
}
