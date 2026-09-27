-- +goose Up
CREATE TABLE
  users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    bio TEXT,
    uid VARCHAR(255) NOT NULL,
    image_url TEXT,
    preferred_username VARCHAR(255),
    last_signed_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    deleted_at TIMESTAMPTZ
  );

CREATE UNIQUE INDEX idx_users_uid ON users (uid);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_deleted_at ON users (deleted_at);

-- +goose Down
DROP TABLE IF EXISTS users;