package auth

import (
	"context"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// state และ ticket อยู่ในตารางเดียวกัน จึงใส่ prefix ให้ key เพื่อไม่ให้ปนกัน
const (
	statePrefix  = "state:"
	ticketPrefix = "ticket:"
)

// authTicket คือแถวหนึ่งในตาราง auth_tickets (ใช้แทน Redis)
type authTicket struct {
	Key       string
	Payload   []byte // JSON ของ Credential, เป็น NULL สำหรับ state
	ExpiresAt time.Time
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *repository {
	return &repository{
		db: db,
	}
}

func (repo *repository) SaveState(ctx context.Context, state string, ttl time.Duration) error {
	// ลบแถวที่หมดอายุแล้วทิ้งก่อน ตารางจะได้ไม่โตขึ้นเรื่อย ๆ (เช่น คนกด login แล้วไม่ login ต่อ)
	if err := repo.db.WithContext(ctx).Exec("DELETE FROM auth_tickets WHERE expires_at <= now()").Error; err != nil {
		return err
	}

	return repo.db.WithContext(ctx).Exec(
		"INSERT INTO auth_tickets (key, expires_at) VALUES (?, ?)",
		statePrefix+state, time.Now().Add(ttl),
	).Error
}

func (repo *repository) ConsumeState(ctx context.Context, state string) error {
	_, err := repo.consume(ctx, statePrefix+state)
	return err
}

func (repo *repository) SaveTicket(ctx context.Context, ticket string, credential Credential, ttl time.Duration) error {
	payload, err := json.Marshal(credential)
	if err != nil {
		return err
	}

	return repo.db.WithContext(ctx).Exec(
		"INSERT INTO auth_tickets (key, payload, expires_at) VALUES (?, ?, ?)",
		ticketPrefix+ticket, string(payload), time.Now().Add(ttl),
	).Error
}

func (repo *repository) ConsumeTicket(ctx context.Context, ticket string) (Credential, error) {
	payload, err := repo.consume(ctx, ticketPrefix+ticket)
	if err != nil {
		return Credential{}, err
	}

	var credential Credential
	if err := json.Unmarshal(payload, &credential); err != nil {
		return Credential{}, err
	}

	return credential, nil
}

// consume ลบแถวของ key นี้และคืน payload กลับมาในคำสั่งเดียว
// ถ้าสองคำขอใช้ key เดียวกันพร้อมกัน จะมีแค่คำขอเดียวที่ลบได้ จึงใช้ได้ครั้งเดียวจริง
// แถวที่หมดอายุแล้วจะไม่ถูกลบตรงนี้ จึงได้ ErrNotFound เหมือนไม่มี key
func (repo *repository) consume(ctx context.Context, key string) ([]byte, error) {
	var row authTicket

	result := repo.db.WithContext(ctx).
		Raw("DELETE FROM auth_tickets WHERE key = ? AND expires_at > now() RETURNING payload", key).
		Scan(&row)
	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return row.Payload, nil
}
