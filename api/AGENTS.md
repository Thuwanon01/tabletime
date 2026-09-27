# Agent Instructions — TableTime API

ดูแผนงานและการออกแบบทั้งหมดที่ [../docs/PLAN.md](../docs/PLAN.md) และ [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)

## Database migrations

ใช้ [goose](https://github.com/pressly/goose) จัดการ migration โดย config อ่านจาก `.env`
(`GOOSE_MIGRATION_DIR=./migrations`, `GOOSE_DRIVER=postgres`, `GOOSE_DBSTRING=...`
ดูตัวอย่างใน `.env.example`)

สร้าง migration ใหม่ด้วยคำสั่ง:

```sh
goose create <ชื่อ_migration> sql
```

ไฟล์ที่สร้างจะอยู่ใน `migrations/` ในรูปแบบ `<timestamp>_<ชื่อ_migration>.sql`
พร้อม block `-- +goose Up` และ `-- +goose Down` ให้เติม SQL เอง

รัน migration กับ Postgres ใน compose:

```sh
goose up
```

## Generated files

หลังแก้ interface หรือ swag comment ให้สร้างไฟล์ใหม่ทุกครั้ง:

```sh
mockery                                                               # mocks_test.go ตาม .mockery.yml
go run github.com/swaggo/swag/cmd/swag@v1.16.6 init -g cmd/api/main.go -o docs   # docs/
```

## Testing

ก่อนเขียนหรือรัน test ให้ดูข้อกำหนดใน [docs/TESTING.md](docs/TESTING.md)
