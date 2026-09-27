-- +goose Up
-- เก็บ OAuth state และ login ticket ชั่วคราว (ใช้แทน Redis)
-- key     = "state:<ค่า>" หรือ "ticket:<ค่า>"
-- payload = credential (JSON) ของ ticket, เป็น NULL สำหรับ state
CREATE TABLE
  auth_tickets (
    key TEXT PRIMARY KEY,
    payload JSONB NULL,
    expires_at TIMESTAMPTZ NOT NULL
  );

-- +goose Down
DROP TABLE IF EXISTS auth_tickets;
