# TableTime

[![ci](https://github.com/Thuwanon01/tabletime/actions/workflows/ci.yml/badge.svg)](https://github.com/Thuwanon01/tabletime/actions/workflows/ci.yml)

เว็บจองโต๊ะร้านอาหารพร้อม community รีวิวร้าน ผู้ใช้หนึ่งบัญชีเป็นได้ทั้งเจ้าของร้าน (เปิดร้านของตัวเอง)
และลูกค้า (จองและรีวิวร้านของคนอื่น) ทำด้วย Next.js + Go + Keycloak + PostgreSQL

เอกสารออกแบบ: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · แผนงาน: [docs/PLAN.md](docs/PLAN.md)

## สิ่งที่ต้องมี

- Docker + Docker Compose
- [goose](https://github.com/pressly/goose) สำหรับรัน migration (`go install github.com/pressly/goose/v3/cmd/goose@latest`)
- ถ้าจะรัน test หรือรันนอก docker: Go (ตาม `api/go.mod`) และ Node.js 24

## วิธีรัน

```sh
cp .env.example .env          # รหัสสำหรับ dev เท่านั้น
docker compose up --build -d

# สร้างตารางใน Postgres (ทำครั้งแรก และทุกครั้งที่มี migration ใหม่)
cd api
cp .env.example .env
goose up
```

| ส่วน | URL |
|---|---|
| web | http://localhost:3000 |
| api | http://localhost:8080/api/v1 |
| Swagger | http://localhost:8080/swagger/index.html |
| Keycloak admin | http://localhost:8180 (user `admin`, password ตาม `KEYCLOAK_ADMIN_PASSWORD` ใน `.env`) |

ทดสอบ login: เปิด http://localhost:8080/api/v1/auth/login แล้ว login ด้วยบัญชีด้านล่าง
ระบบจะ redirect กลับไปที่ `http://localhost:3000/auth/callback?ticket=...` (หน้านี้จะทำในขั้น 7)

## บัญชีทดสอบ

| username | email | password |
|---|---|---|
| alice | alice@tabletime.local | `tabletime` |
| bob | bob@tabletime.local | `tabletime` |
| carol | carol@tabletime.local | `tabletime` |

id ของแต่ละคนดูได้ที่ [keycloak/README.md](keycloak/README.md) หน้า login มีปุ่มสมัครสมาชิกด้วย

## รัน test

```sh
# api: ต้องเปิด Docker ไว้ เพราะ integration test สร้าง Postgres container เอง
cd api
go vet ./...
go test ./...

# web
cd web
npm ci
npm run lint
npx next typegen && npx tsc --noEmit
npm run build
```

CI (`.github/workflows/ci.yml`) รันชุดเดียวกันนี้ทุก pull request และทุกครั้งที่ push เข้า `main`
