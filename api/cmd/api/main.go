package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"tabletime/internal/auth"
	"tabletime/internal/config"
	"tabletime/internal/middleware"
	"tabletime/internal/platform/database"
	"tabletime/internal/user"

	_ "tabletime/docs"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//	@title			TableTime API
//	@version		1.0
//	@description	API สำหรับระบบจองโต๊ะร้านอาหารและรีวิวร้าน
//	@host			localhost:8080
//	@BasePath		/api/v1
//	@schemas		http https

// @securityDefinitions.apikey	BearerAuth
// @in							header
// @name						Authorization
// @description				พิมพ์ "Bearer" ตามด้วย space แล้วตามด้วย access token เช่น "Bearer eyJhbGci..."
func main() {
	if err := run(); err != nil {
		slog.Error("service stopped", "error", err)
		os.Exit(1)
	}
}

func run() error {
	// Default logger
	slog.SetDefault(newLogger(os.Stdout, "tabletime", config.Logging{Level: slog.LevelDebug.String(), Format: "text"}))

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load configuration:\n%s", config.Humanize(err))
	}

	// Setup logger
	logger := newLogger(os.Stdout, cfg.App.Name, cfg.Logging)
	slog.SetDefault(logger)

	// Signal context
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Database connection
	db, sqldb, err := database.Open(ctx, cfg.Database.PostgresDSN, cfg.Logging)
	if err != nil {
		log.Fatal("database connection:", err)
	}
	defer sqldb.Close()

	// Discovery from Keycloak
	// ใน compose api เรียก Keycloak ผ่าน http://keycloak:8080 (ชื่อ service ใน network ของ docker)
	// แต่ browser ใช้ http://localhost:8180 และ token ก็มี issuer เป็น URL นั้น
	// จึงบอก go-oidc ว่า issuer ที่ต้องตรวจใน token คือ cfg.Keycloak.IssuerURL()
	providerCtx := oidc.InsecureIssuerURLContext(ctx, cfg.Keycloak.IssuerURL())
	oidcProvider, err := oidc.NewProvider(providerCtx, cfg.Keycloak.RealmURL())
	if err != nil {
		return fmt.Errorf("discover keycloak provider: %w", err)
	}

	oidcVerifer := oidcProvider.Verifier(&oidc.Config{ClientID: cfg.Keycloak.ClientID})

	// Dependency injection
	userRepo := user.NewRepository(db)
	userService := user.NewService(userRepo)
	userHandler := user.NewHandler(userService)

	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, userService, auth.KeycloakDeps{
		Config:   cfg.Keycloak,
		Provider: oidcProvider,
		Verifier: oidcVerifer,
	})
	authHandler := auth.NewHandler(authService)

	// Register path
	router := gin.Default()
	if cfg.App.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	// Register cors
	router.Use(cors.Default())

	// Group version
	v1 := router.Group("/api/v1")

	// Auth resource
	authGroup := v1.Group("/auth")
	authGroup.GET("/login", authHandler.Login)
	authGroup.GET("/callback", authHandler.Callback)
	authGroup.POST("/exchange", authHandler.Exchange)
	authGroup.POST("/logout", authHandler.Logout)
	authGroup.POST("/refresh-token", authHandler.RefreshToken)

	// User resource
	userGroup := v1.Group("/users")
	userGroup.Use(middleware.JWT(oidcVerifer, userService))
	userGroup.GET("/:id", userHandler.GetUser)
	userGroup.PUT("/:id", userHandler.UpdateUser)

	// Register swagger
	router.GET("swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Server
	serv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		if err := serv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.ErrorContext(ctx, "server error", "error", serv.Addr)
		}
	}()
	slog.InfoContext(ctx, "server started", "addr", serv.Addr)

	// Graceful shutdown
	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.App.ShutdownTimeout)
	defer cancel()

	slog.InfoContext(shutdownCtx, "shutting down server")

	return serv.Shutdown(shutdownCtx)
}

func newLogger(writer io.Writer, name string, log config.Logging) *slog.Logger {
	opts := &slog.HandlerOptions{Level: log.SlogLevel()}

	var handler slog.Handler = slog.NewJSONHandler(writer, opts)
	if log.Format == "text" {
		handler = slog.NewTextHandler(writer, opts)
	}

	return slog.New(handler).With("service", name)
}
