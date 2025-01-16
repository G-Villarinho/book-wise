package models

type Permission string

const (
	AllPermissions              Permission = "all_permissions"
	CreateAdminPermission       Permission = "create_admin"
	ListExternalBooksPermission Permission = "list_external_books"
	GetExternalBooksPermission  Permission = "get_external_book"
	CreateAuthorPermission      Permission = "create_author"
	ListAuthorsPermission       Permission = "list_authors"
	GetAuthorPermission         Permission = "get_author"
	DeleteAuthorPermission      Permission = "delete_author"
	CreateBookPermission        Permission = "create_book"
	UpdateBookPermission        Permission = "update_book"
	PublishBookPermission       Permission = "publish_book"
	UnpublishBookPermission     Permission = "unpublish_book"
	DeleteBookPermission        Permission = "delete_book"
	ListBooksPermission         Permission = "list_book"
	GetBookPermission           Permission = "get_book"
)

var rolePermissions = map[Role][]Permission{
	Owner: {
		AllPermissions,
	},
	Admin: {
		ListExternalBooksPermission,
		GetExternalBooksPermission,
		CreateAuthorPermission,
		ListAuthorsPermission,
		GetAuthorPermission,
		DeleteAuthorPermission,
		CreateBookPermission,
		UpdateBookPermission,
		PublishBookPermission,
		UnpublishBookPermission,
		DeleteBookPermission,
		ListBooksPermission,
		GetBookPermission,
	},
	Member: {},
}

func CheckPermission(role Role, permission Permission) bool {
	if role == Owner {
		return true
	}

	permissions, exists := rolePermissions[role]
	if !exists {
		return false
	}
	for _, p := range permissions {
		if p == permission {
			return true
		}
	}
	return false
}
