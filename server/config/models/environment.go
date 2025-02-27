package models

type Environment struct {
	PrivateKey        string `env:"PRIVATE_KEY"`
	PublicKey         string `env:"PUBLIC_KEY"`
	Redis             RedisEnvironment
	CloudFlare        CloudFlareEnvironment
	Cache             CacheEnvironment
	Email             EmailEnvironment
	APIBaseURL        string `env:"API_BASE_URL"`
	RedirectAdminURL  string `env:"REDIRECT_ADMIN_URL"`
	RedirectMemberURL string `env:"REDIRECT_MEMBER_URL"`
	CookieName        string `env:"COOKIE_NAME"`
	RabbitMQURL       string `env:"RABBITMQ_URL"`
	APIPort           int    `env:"API_PORT"`
	ConnectionString  string `env:"CONNECTION_STRING"`
	AdminFrontURL     string `env:"ADMIN_FRONT_URL"`
	MemberFrontURL    string `env:"MEMBER_FRONT_URL"`
	GoogleBooksApiUrl string `env:"GOOGLE_BOOKS_URL_API"`
}

type RedisEnvironment struct {
	DB       int    `env:"REDIS_DB"`
	Address  string `env:"REDIS_ADDRESS"`
	Password string `env:"REDIS_PASSWORD"`
}

type CloudFlareEnvironment struct {
	CloudFlareImageApiUrl string `env:"CLOUD_FLARE_IMAGE_API_URL"`
	CloudFlareImageApiKey string `env:"CLOUD_FLARE_IMAGE_API_KEY"`
}

type CacheEnvironment struct {
	SessionExp      int `env:"SESSION_EXP"`
	CacheExp        int `env:"CACHE_EXP"`
	Hash2FADuration int `env:"HASH_2FA_DURATION"`
	Code2FADuration int `env:"CODE_2FA_DURATION"`
}

type EmailEnvironment struct {
	EmailClientApiKey  string `env:"EMAIL_CLIENT_API_KEY"`
	EmailClientBaseURL string `env:"EMAIL_CLIENT_BASE_URL"`
	EmailSender        string `env:"EMAIL_SENDER"`
}
