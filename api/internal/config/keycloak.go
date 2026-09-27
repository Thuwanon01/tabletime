package config

import "fmt"

type Keycloak struct {
	// BaseURL คือ URL ที่ api ใช้คุยกับ Keycloak เอง (ใน compose คือ http://keycloak:8080)
	BaseURL string `env:"KEYCLOAK_BASE_URL" envDefault:"http://localhost:8180" validate:"required"`
	// PublicURL คือ URL ของ Keycloak ที่ browser เห็น และเป็น issuer ที่อยู่ใน token
	PublicURL    string `env:"KEYCLOAK_PUBLIC_URL" envDefault:"http://localhost:8180" validate:"required"`
	Realm        string `env:"KEYCLOAK_REALM" envDefault:"tabletime" validate:"required"`
	ClientID     string `env:"KEYCLOAK_CLIENT_ID" validate:"required"`
	ClientSecret string `env:"KEYCLOAK_CLIENT_SECRET" validate:"required"`
	RedirectURL  string `env:"KEYCLOAK_REDIRECT_URL" envDefault:"http://localhost:8080/api/v1/auth/callback" validate:"required"`
	FrontendURL  string `env:"FRONTEND_URL" envDefault:"http://localhost:3000" validate:"required"`
}

// RealmURL ใช้ตอน api เรียก Keycloak (discovery, token, logout)
func (keycloak Keycloak) RealmURL() string {
	return fmt.Sprintf("%s/realms/%s", keycloak.BaseURL, keycloak.Realm)
}

// IssuerURL คือค่า "iss" ใน token ที่ Keycloak ออกให้ ใช้ตรวจว่า token มาจาก realm ของเราจริง
func (keycloak Keycloak) IssuerURL() string {
	return fmt.Sprintf("%s/realms/%s", keycloak.PublicURL, keycloak.Realm)
}

func (keycloak Keycloak) Validate() error {
	return validate.Struct(keycloak)
}
