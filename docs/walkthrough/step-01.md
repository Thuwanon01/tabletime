# ขั้น 1: ตั้ง repo จากโครงของ wongnok

## 1. ขั้นนี้ทำอะไร และทำไม

ขั้นนี้ยังไม่มีฟีเจอร์ร้าน การจอง หรือรีวิว เป้าหมายคือได้ "โครงเปล่าที่รันได้จริง" ของ TableTime

- **copy โครงจาก wongnok** (`api/`, `web/`, `keycloak/`, `compose.yml`) เพราะเป็นโค้ดที่เคยเรียนมาแล้ว มีระบบ login ด้วย Keycloak, โครง Go แบบ handler → service → repository และ Next.js พร้อมใช้
- **ลบ recipe ทั้งหมด** เพราะไม่เกี่ยวกับโจทย์ ถ้าเก็บไว้จะมีโค้ดที่อธิบายไม่ได้ว่ามีไว้ทำไม
- **ตัด Redis** (Decision D3, D4) โจทย์ไม่มีส่วนที่ต้องใช้ cache ลด service ไปหนึ่งตัว ย้าย OAuth state และ login ticket ไปเก็บในตาราง `auth_tickets` ของ Postgres แทน
- **แก้บั๊กใน `jwt.go`** ที่ติดมาจาก wongnok
- **ตั้ง Keycloak realm `tabletime`** พร้อม user ทดสอบ alice, bob, carol
- **ตั้ง GitHub Actions** ตรวจ api และ web ทุก PR

ผลสุดท้าย: `docker compose up` แล้ว login ผ่าน Keycloak → ได้ ticket → แลกเป็น token → เรียก `/api/v1/users/me` ได้ (ตรวจแล้วผ่านทั้งเส้น ดูหัวข้อ 8)

## 2. แผนผังไฟล์ที่สำคัญ

```
finalExam/
├── .env.example                  ใหม่  รหัส dev สำหรับ compose (copy เป็น .env)
├── .gitignore                    แก้   กัน .env, ไฟล์ output ของ go test
├── .github/workflows/ci.yml      ใหม่  CI job api + web
├── README.md                     ใหม่  วิธีรัน
├── compose.yml                   มาจาก wongnok  ตัด redis, ใช้ชื่อ tabletime, อ่านรหัสจาก .env
├── keycloak/import/
│   └── tabletime-realm.json      มาจาก pea-realm.json  เปลี่ยนเป็น realm/client tabletime + user ทดสอบ
├── api/
│   ├── .env.example              มาจาก wongnok  ตัดค่าของ Redis
│   ├── cmd/                      มาจาก wongnok  main.go ตัดการต่อ Redis, เพิ่มการตรวจ issuer (D21)
│   ├── migrations/
│   │   ├── ..._create_users.sql         มาจาก wongnok
│   │   └── ..._create_auth_tickets.sql  ใหม่  ตารางแทน Redis
│   └── internal/
│       ├── auth/repository.go    เขียนใหม่  ใช้ Postgres แทน Redis
│       ├── auth/repository_integration_test.go  เขียนใหม่  ทดสอบกับ Postgres จริง (testcontainers)
│       ├── middleware/jwt.go     แก้บั๊ก return
│       ├── user/repository.go    แก้   ลบ cache ของ Redis เหลือแค่ query DB
│       ├── config/               แก้   ตัด Redis, เพิ่ม KEYCLOAK_PUBLIC_URL
│       └── convutil, httputil, platform, reqctx   มาจาก wongnok ตามเดิม
└── web/                          มาจาก wongnok  ลบ app/recipes, หน้าแรกเป็นหน้าชั่วคราว
```

**ตัดทิ้ง:**
- `api/internal/recipe/` ทั้งโฟลเดอร์
- migration ของ difficulties, durations, recipes, recipe_ingredients, recipe_instructions, user_favorites, recipe_ratings
- `web/app/recipes/`
- service `redis` ใน compose, Redis client ใน `go.mod`, cache ใน `user/repository.go`

**เปลี่ยนชื่อ:** Go module เป็น `tabletime`, container เป็น `tabletime-*`, database เป็น `tabletime`

## 3. ย้าย auth ticket จาก Redis ไป Postgres

### ทำไมต้องมี state กับ ticket

- **state**: ตอนกด login api สุ่มค่า `state` เก็บไว้ แล้วส่งไป Keycloak พอ Keycloak redirect กลับมาที่ `/auth/callback` api ต้องเช็กว่า state นี้เราออกเองจริง (กัน CSRF) และใช้ได้ครั้งเดียว
- **ticket**: หลัง login สำเร็จ api ไม่ส่ง token ไปใน URL ตรง ๆ แต่ส่ง `ticket` สั้น ๆ ไปให้ web แล้ว web เอา ticket มาแลกเป็น token ที่ `POST /auth/exchange` ticket ต้องใช้ได้ครั้งเดียวและหมดอายุเร็ว

เดิม wongnok เก็บทั้งสองอย่างใน Redis (Redis มี TTL และ `GETDEL` ให้) ตอนนี้ใช้ตารางนี้แทน

### ตาราง (`api/migrations/20260927163941_create_auth_tickets.sql`)

```sql
CREATE TABLE auth_tickets (
  key TEXT PRIMARY KEY,         -- "state:<ค่า>" หรือ "ticket:<ค่า>"
  payload JSONB NULL,           -- credential (token) ของ ticket, state ไม่มีเลยเป็น NULL
  expires_at TIMESTAMPTZ NOT NULL  -- หมดอายุเมื่อไหร่ (แทน TTL ของ Redis)
);
```

- state กับ ticket อยู่ตารางเดียวกัน จึงใส่ prefix `state:` / `ticket:` ให้ key กันปนกัน (ถ้าไม่ใส่ อาจเอา state ไปแลกเป็น token ได้)
- `key` เป็น PRIMARY KEY จึงมี index และซ้ำกันไม่ได้

### บันทึก (`SaveState`, `SaveTicket` ใน `api/internal/auth/repository.go`)

```go
repo.db.WithContext(ctx).Exec("DELETE FROM auth_tickets WHERE expires_at <= now()")
```
ลบแถวที่หมดอายุแล้วทุกครั้งที่มีคนเริ่ม login ตารางจะได้ไม่โตเรื่อย ๆ (Redis ลบให้เอง แต่ Postgres ไม่ลบ)

```go
"INSERT INTO auth_tickets (key, expires_at) VALUES (?, ?)", statePrefix+state, time.Now().Add(ttl)
```
- `?` คือ placeholder ให้ GORM ใส่ค่าให้ กัน SQL injection
- `time.Now().Add(ttl)` คำนวณเวลาหมดอายุใน Go เช่น ตอนนี้ + 5 นาที

`SaveTicket` เหมือนกัน แต่แปลง `Credential` เป็น JSON (`json.Marshal`) แล้วใส่ช่อง `payload`

### ใช้ครั้งเดียว (`consume`) — query สำคัญที่สุดของขั้นนี้

```go
repo.db.WithContext(ctx).
    Raw("DELETE FROM auth_tickets WHERE key = ? AND expires_at > now() RETURNING payload", key).
    Scan(&row)
```

อ่านทีละส่วน:

| ส่วน | ความหมาย |
|---|---|
| `DELETE FROM auth_tickets` | ลบแถวออกจากตาราง |
| `WHERE key = ?` | เฉพาะแถวของ key นี้ เช่น `ticket:abc` |
| `AND expires_at > now()` | และยังไม่หมดอายุ (เทียบกับเวลาของ database) ถ้าหมดแล้วจะไม่เข้าเงื่อนไข ไม่ถูกลบ ไม่คืนอะไร |
| `RETURNING payload` | คืนค่า `payload` ของแถวที่เพิ่งลบกลับมา เหมือน SELECT กับ DELETE ในคำสั่งเดียว |
| `.Scan(&row)` | ใส่ผลลงตัวแปร `row` |

จากนั้น

```go
if result.RowsAffected == 0 {
    return nil, ErrNotFound
}
```
ถ้าไม่มีแถวถูกลบ แปลว่า ไม่มี key นี้ หรือหมดอายุ หรือ **ถูกใช้ไปแล้ว** ทั้งสามกรณีตอบ `ErrNotFound` เหมือนกัน (handler ตอบ 401)

**ทำไม `DELETE ... RETURNING` ถึงใช้ได้ครั้งเดียว**

- การ "อ่าน" กับ "ลบ" เกิดในคำสั่งเดียว ไม่มีช่องว่างระหว่างกลาง
- ถ้าทำแบบสองคำสั่ง `SELECT` แล้วค่อย `DELETE` สองคำขอที่มาพร้อมกันอาจ `SELECT` เจอทั้งคู่ก่อนที่ใครจะลบ → ได้ token ไปสองคน
- กับ `DELETE` ทางเดียว Postgres จะล็อกแถวนั้น คำขอแรกลบได้ คำขอที่สองต้องรอ พอคำขอแรก commit แถวหายไปแล้ว คำขอที่สองจึงลบได้ 0 แถว → `ErrNotFound`
- เทียบกับ wongnok: ทำหน้าที่เดียวกับ `GETDEL` ของ Redis

ตรวจจริงแล้ว: แลก ticket ครั้งแรกได้ 200 ครั้งที่สองด้วย ticket เดิมได้ 401

### test

`api/internal/auth/repository_integration_test.go` รัน Postgres 17 จริงด้วย testcontainers ทดสอบ: บันทึกแล้วใช้ได้, ใช้ซ้ำไม่ได้, หมดอายุแล้วใช้ไม่ได้ (ตั้ง `expires_at` เป็นอดีตด้วย UPDATE ตรง ๆ), state กับ ticket ไม่ปนกัน, และ `SaveState` ลบแถวหมดอายุ

## 4. บั๊กใน `jwt.go`

wongnok เดิม (`internal/middleware/jwt.go` บรรทัด 39):

```go
userID, err := userResolver.ResolveID(ctx.Request.Context(), idToken.Subject)
if err != nil {
    ctx.AbortWithStatusJSON(http.StatusUnauthorized, httputil.ErrorResponse{Message: "user not found"})
    // ← ไม่มี return
}
rctx := reqctx.WithUserID(rctx, userID)
...
ctx.Next()
```

**บั๊กคืออะไร:** `AbortWithStatusJSON` แค่เขียน response 401 และบอก gin ว่าไม่ต้องเรียก handler ตัวถัดไป แต่ **ไม่ได้หยุดฟังก์ชันที่กำลังรันอยู่** โค้ดจึงรันต่อลงไปใส่ `userID` (ซึ่งเป็น `uuid.Nil` = 000…0) ลง context แล้วเรียก `ctx.Next()`

**ถ้าไม่แก้จะเกิดอะไร:** token ถูกต้องแต่ยังไม่มี user ใน DB (หรือ DB ล่ม) ก็ยังรันโค้ดต่อ ใน gin `ctx.Next()` หลัง abort จะไม่เรียก handler แล้ว เลยไม่พังทันที แต่เป็นโค้ดที่ผิดหลัก ทำงานต่อด้วยค่าที่ผิด (user id ว่าง) และถ้าวันหน้ามีคนเพิ่มโค้ดใต้ `if` เช่น log หรือเขียน DB จะทำงานด้วย user id 000…0 ทั้งที่ควรหยุดแล้ว

**แก้:** เติม `return` หลัง `AbortWithStatusJSON` เหมือนสองจุดด้านบนที่มี `return` อยู่แล้ว

## 5. Keycloak realm และ user ทดสอบ

ไฟล์ `keycloak/import/tabletime-realm.json` (มาจาก `pea-realm.json`) Keycloak อ่านตอนเริ่มด้วย `--import-realm`

- realm `tabletime`, client `tabletime`
- `"registrationAllowed": true` ให้สมัครสมาชิกเองได้
- `registrationEmailAsUsername` ปิด (D23) เพื่อให้ login ด้วย `alice` ได้ (ใช้อีเมลก็ได้)
- client secret เป็น `"${KEYCLOAK_CLIENT_SECRET}"` Keycloak แทนค่าจาก env ตอน import และลบ signing key ของ realm ออก ให้ Keycloak สร้างใหม่เอง (D22) repo จึงไม่มี secret จริง

| username | password | id (= Keycloak `sub`) | ชื่อ |
|---|---|---|---|
| alice | tabletime | `11111111-1111-4111-8111-111111111111` | Alice Anderson |
| bob | tabletime | `22222222-2222-4222-8222-222222222222` | Bob Brown |
| carol | tabletime | `33333333-3333-4333-8333-333333333333` | Carol Clark |

id ตายตัวเพื่อให้ขั้น seed และ e2e อ้างถึง user ได้แน่นอน รหัส `tabletime` เป็นค่า dev สาธารณะ

**เรื่อง URL ของ Keycloak (D21):** ใน compose api เรียก Keycloak ที่ `http://keycloak:8080` (ชื่อ service) แต่ browser ใช้ `http://localhost:8180` และ token มี issuer เป็น `localhost:8180` ถ้าไม่จัดการ go-oidc จะปฏิเสธ token เพราะ issuer ไม่ตรง จึงตั้ง
- Keycloak: `KC_HOSTNAME=http://localhost:8180` และ `KC_HOSTNAME_BACKCHANNEL_DYNAMIC=true`
- api: `KEYCLOAK_PUBLIC_URL` และใน `main.go` ใช้ `oidc.InsecureIssuerURLContext(ctx, cfg.Keycloak.IssuerURL())` บอก go-oidc ว่า issuer ที่ถูกต้องคือ URL สาธารณะ คำว่า Insecure แค่หมายถึง "ไม่บังคับให้ URL ที่ใช้ discover ตรงกับ issuer" การตรวจลายเซ็นและ issuer ของ token ยังทำครบ

## 6. CI ทำอะไรบ้าง (`.github/workflows/ci.yml`)

รันทุก pull request และทุก push เข้า `main` มี 2 job ทำขนานกัน

**job `api`** (โฟลเดอร์ `api/`)
1. ติดตั้ง Go ตาม version ใน `go.mod`
2. `go vet ./...` หาโค้ดที่น่าจะผิด
3. `go test ./...` รวม integration test ที่ใช้ testcontainers (runner ของ GitHub มี Docker)

**job `web`** (โฟลเดอร์ `web/`)
1. ติดตั้ง Node 24
2. `npm ci` ติดตั้งตาม lock file
3. `npm run lint` (eslint)
4. `npx next typegen` สร้าง type ของ route เช่น `LayoutProps` (ถ้าไม่ทำ `tsc` บน checkout ใหม่จะ error `Cannot find name 'LayoutProps'`)
5. `npx tsc --noEmit` ตรวจ type
6. `npm run build`

## 7. คำถามที่อาจโดนถาม

1. **ทำไมตัด Redis?**
   โจทย์ไม่มีจุดที่ต้องใช้ cache ส่วนที่ใช้ Redis มีแค่ state/ticket ซึ่งย้ายไป Postgres ได้ ลด service ไปหนึ่งตัว และข้อมูลไม่หายตอน restart

2. **ticket ใช้ได้ครั้งเดียวได้ยังไง?**
   `DELETE ... WHERE key = ? AND expires_at > now() RETURNING payload` อ่านและลบในคำสั่งเดียว คำขอที่สองจะลบได้ 0 แถว จึงได้ `ErrNotFound` → 401

3. **ทำไมไม่ SELECT ก่อนแล้วค่อย DELETE?**
   มีช่องว่างระหว่างสองคำสั่ง สองคำขอพร้อมกันอาจอ่านเจอทั้งคู่แล้วได้ token ทั้งคู่

4. **แถวที่หมดอายุถูกลบเมื่อไหร่?**
   ตอน `consume` จะไม่นับแถวหมดอายุ (`expires_at > now()`) และทุกครั้งที่ `SaveState` จะลบแถวที่หมดอายุทิ้งก่อน

5. **บั๊ก jwt.go คืออะไร?**
   `AbortWithStatusJSON` ไม่หยุดฟังก์ชัน ต้อง `return` เอง ไม่งั้นโค้ดรันต่อด้วย user id ว่าง

6. **ทำไมต้องมี state?**
   กัน CSRF: callback ต้องมาจาก login ที่ api เริ่มเองเท่านั้น และใช้ได้ครั้งเดียว

7. **secret อยู่ที่ไหน?**
   ใน `.env` ที่ไม่ถูก commit (อยู่ใน `.gitignore`) repo มีแค่ `.env.example` ที่เป็นค่า dev สุ่มใหม่ realm file ใช้ `${KEYCLOAK_CLIENT_SECRET}` แทนค่าจริง

8. **ทำไม api เรียก Keycloak คนละ URL กับ browser?**
   ใน docker network api เห็น Keycloak เป็น `keycloak:8080` แต่ browser เห็นเป็น `localhost:8180` token ต้องมี issuer เดียว จึงตั้ง `KC_HOSTNAME` และบอก go-oidc ให้ตรวจ issuer กับ URL สาธารณะ (D21)

## 8. ผลการตรวจ

| เรื่อง | ผล |
|---|---|
| api: `go build`, `go vet`, `go test` | ผ่าน (auth integration test 9 subtest, user 10 test, middleware) |
| web: `npm ci`, lint, `next typegen` + `tsc`, build | ผ่าน |
| ไม่มี recipe / redis / wongnok เหลือ | ผ่าน (เจอแค่คอมเมนต์ "ใช้แทน Redis" 2 จุด ตั้งใจเขียน) |
| ไม่มี secret / `.env` ใน commit | ผ่าน |
| `docker compose up` → login alice → ticket → exchange → `/users/me` | ผ่าน ได้ 200, แลก ticket ซ้ำได้ 401, ไม่มี token ได้ 401 |

หมายเหตุ: `GET /api/v1/users/:id` รับเฉพาะ `me` (เหมือน wongnok, `api/internal/user/handler.go:44`) id อื่นตอบ 404

## 9. สิ่งที่ยังค้าง

ทุกข้อตรวจผ่าน ไม่มีข้อที่ fail แต่มีเรื่องที่ควรรู้และคำถามเปิด

- **รัน test บนเครื่องที่ใช้ colima:** testcontainers หา Docker ไม่เจอ ต้องตั้ง
  `DOCKER_HOST=unix://$HOME/.colima/default/docker.sock` และ `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock` ก่อน `go test` (CI ไม่ต้อง) ยังไม่ได้เขียนใน README
- **migration ยังต้องรันเอง:** `docker compose up` ไม่รัน migration ต้อง `cd api && goose up` เอง (แบบเดียวกับ wongnok) คำถามเปิด: ควรเพิ่ม service `migrate` ใน compose ไหม (ขั้น 11 e2e ต้องใช้)
- **api restart วนจนกว่า Keycloak จะพร้อม:** `depends_on` ไม่มี healthcheck แต่ `restart: always` ทำให้สุดท้ายขึ้นได้เอง
- **ชื่อ `oidc.InsecureIssuerURLContext`:** ฟังดูน่ากลัวตอนสัมภาษณ์ ทางเลือกคือให้ทุกคนเพิ่ม `keycloak` ใน `/etc/hosts`
- **ไม่มี unit test ของการแก้ jwt.go:** ต้องเซ็น JWT ทดสอบ ซับซ้อนเกินไป ตรวจกับ stack จริงแทน
- **`web/.env.example` ยังไม่มี:** web ยังไม่อ่าน env อะไร (`NEXT_PUBLIC_API_BASE_URL` ตั้งใน compose แต่ยังไม่ใช้) ค่อยเพิ่มในขั้น 7
