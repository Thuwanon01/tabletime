package auth

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func TestRepositoryState(t *testing.T) {
	db := newIntegrationDB(t)
	repo := NewRepository(db)
	ctx := context.Background()

	t.Run("consume once succeeds", func(t *testing.T) {
		require.NoError(t, repo.SaveState(ctx, "state-1", time.Minute))

		assert.NoError(t, repo.ConsumeState(ctx, "state-1"))
	})

	t.Run("consume twice returns ErrNotFound", func(t *testing.T) {
		require.NoError(t, repo.SaveState(ctx, "state-2", time.Minute))
		require.NoError(t, repo.ConsumeState(ctx, "state-2"))

		assert.ErrorIs(t, repo.ConsumeState(ctx, "state-2"), ErrNotFound)
	})

	t.Run("missing state returns ErrNotFound", func(t *testing.T) {
		assert.ErrorIs(t, repo.ConsumeState(ctx, "never-saved"), ErrNotFound)
	})

	t.Run("expired state returns ErrNotFound", func(t *testing.T) {
		require.NoError(t, repo.SaveState(ctx, "state-3", time.Minute))
		expire(t, db, statePrefix+"state-3")

		assert.ErrorIs(t, repo.ConsumeState(ctx, "state-3"), ErrNotFound)
	})

	t.Run("save state removes expired rows", func(t *testing.T) {
		require.NoError(t, repo.SaveState(ctx, "state-4", time.Minute))
		expire(t, db, statePrefix+"state-4")

		require.NoError(t, repo.SaveState(ctx, "state-5", time.Minute))

		assert.Zero(t, countRows(t, db, statePrefix+"state-4"))
	})
}

func TestRepositoryTicket(t *testing.T) {
	db := newIntegrationDB(t)
	repo := NewRepository(db)
	ctx := context.Background()
	credential := Credential{
		AccessToken:  "access-token",
		RefreshToken: "refresh-token",
		BearerType:   "Bearer",
		ExpiresAt:    time.Date(2026, 10, 11, 12, 0, 0, 0, time.UTC),
	}

	t.Run("consume once returns the saved credential", func(t *testing.T) {
		require.NoError(t, repo.SaveTicket(ctx, "ticket-1", credential, time.Minute))

		got, err := repo.ConsumeTicket(ctx, "ticket-1")

		require.NoError(t, err)
		assert.Equal(t, credential.AccessToken, got.AccessToken)
		assert.Equal(t, credential.RefreshToken, got.RefreshToken)
		assert.Equal(t, credential.BearerType, got.BearerType)
		assert.True(t, credential.ExpiresAt.Equal(got.ExpiresAt))
	})

	t.Run("consume twice returns ErrNotFound", func(t *testing.T) {
		require.NoError(t, repo.SaveTicket(ctx, "ticket-2", credential, time.Minute))
		_, err := repo.ConsumeTicket(ctx, "ticket-2")
		require.NoError(t, err)

		_, err = repo.ConsumeTicket(ctx, "ticket-2")

		assert.ErrorIs(t, err, ErrNotFound)
	})

	t.Run("expired ticket returns ErrNotFound", func(t *testing.T) {
		require.NoError(t, repo.SaveTicket(ctx, "ticket-3", credential, time.Minute))
		expire(t, db, ticketPrefix+"ticket-3")

		_, err := repo.ConsumeTicket(ctx, "ticket-3")

		assert.ErrorIs(t, err, ErrNotFound)
	})

	t.Run("a state cannot be used as a ticket", func(t *testing.T) {
		require.NoError(t, repo.SaveState(ctx, "same-value", time.Minute))

		_, err := repo.ConsumeTicket(ctx, "same-value")

		assert.ErrorIs(t, err, ErrNotFound)
	})
}

// expire ทำให้แถวนี้หมดอายุไปแล้ว 1 วินาที
func expire(t *testing.T, db *gorm.DB, key string) {
	t.Helper()
	require.NoError(t, db.Exec("UPDATE auth_tickets SET expires_at = now() - interval '1 second' WHERE key = ?", key).Error)
}

func countRows(t *testing.T, db *gorm.DB, key string) int64 {
	t.Helper()
	var count int64
	require.NoError(t, db.Raw("SELECT count(*) FROM auth_tickets WHERE key = ?", key).Scan(&count).Error)
	return count
}

func newIntegrationDB(t *testing.T) *gorm.DB {
	t.Helper()
	ctx := context.Background()
	migrationPath := writeMigrationScript(t)
	container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: testcontainers.ContainerRequest{
			Image:        "postgres:17-alpine",
			ExposedPorts: []string{"5432/tcp"},
			Env: map[string]string{
				"POSTGRES_DB":       "tabletime_test",
				"POSTGRES_USER":     "postgres",
				"POSTGRES_PASSWORD": "postgres",
			},
			Files: []testcontainers.ContainerFile{{
				HostFilePath:      migrationPath,
				ContainerFilePath: "/docker-entrypoint-initdb.d/001_migrations.sql",
				FileMode:          0o644,
			}},
			WaitingFor: wait.ForListeningPort("5432/tcp"),
		},
		Started: true,
	})
	require.NoError(t, err)
	t.Cleanup(func() { require.NoError(t, container.Terminate(ctx)) })

	host, err := container.Host(ctx)
	require.NoError(t, err)
	port, err := container.MappedPort(ctx, "5432/tcp")
	require.NoError(t, err)
	dsn := fmt.Sprintf("host=%s port=%s user=postgres password=postgres dbname=tabletime_test sslmode=disable", host, port.Port())
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	require.NoError(t, err)

	return db
}

// writeMigrationScript รวมส่วน "goose Up" ของทุก migration เป็นไฟล์ SQL เดียว
// เพื่อให้ postgres container รันตอนเริ่ม (ไม่ต้องใช้ goose ใน test)
func writeMigrationScript(t *testing.T) string {
	t.Helper()
	paths, err := filepath.Glob(filepath.Join("..", "..", "migrations", "*.sql"))
	require.NoError(t, err)
	require.NotEmpty(t, paths)

	var statements []string
	for _, path := range paths {
		contents, err := os.ReadFile(path)
		require.NoError(t, err)
		up, _, _ := strings.Cut(string(contents), "-- +goose Down")
		up = strings.TrimPrefix(up, "-- +goose Up")
		statements = append(statements, strings.TrimSpace(up))
	}

	scriptPath := filepath.Join(t.TempDir(), "migrations.sql")
	require.NoError(t, os.WriteFile(scriptPath, []byte(strings.Join(statements, "\n\n")), 0o600))
	return scriptPath
}
