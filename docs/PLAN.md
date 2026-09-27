# แผนทำ Final Exam: TableTime ระบบจองโต๊ะร้านอาหาร + community รีวิวร้าน

## Context

การบ้าน PEA DevPool 2026 ให้ทำเว็บที่ทุกคนเปิดร้านของตัวเองได้ จองร้านของคนอื่นได้ และรีวิวร้านได้ (หนึ่งบัญชี สองบทบาท)

- **บังคับ:** Next.js, Go, UI design ด้วย Claude Design
- **ส่งงาน 11 ต.ค.:** repo, วิดีโอไม่เกิน 5 นาที, ลิงก์หรือภาพ design
- **สัมภาษณ์ 17–18 ต.ค.:** คนละ 15 นาที เน้นว่าเข้าใจโค้ดของตัวเองและอธิบายได้ว่าทำไมเลือกแบบนั้น
- **ไม่บังคับ** Docker และ CI/CD แต่เราทำเป็นคะแนนเสริม โดยต้องไม่ทำให้งานหลักช้าลง

โครงสร้างและเครื่องมือยึดตามโปรเจกต์ที่เรียน `pea-wongnok-2026` ได้แก่ Gin, GORM, goose, go-oidc, Keycloak, swaggo, testify, mockery และ testcontainers **ไม่ใช้ Redis** รายละเอียดการออกแบบทั้งหมดอยู่ใน [ARCHITECTURE.md](ARCHITECTURE.md) ส่วน prompt สำหรับ Claude Design อยู่ใน [design-prompts.md](design-prompts.md)

### หลักที่ใช้ตัดสินใจทุกเรื่อง

1. **งานหลักต้องเสร็จก่อน** ต่อยอดทำทีหลัง เรียงจากง่ายไปยาก
2. **โค้ดต้องอ่านง่ายที่สุดสำหรับมือใหม่** ไม่ใส่ abstraction ที่ไม่จำเป็น ไม่ใช้ generics หรือ reflection ถ้าไม่ต้องใช้ เขียนตาม pattern ของ wongnok
3. **กติกาจริงอยู่ที่ Go เสมอ** หน้าเว็บตรวจซ้ำได้เพื่อ UX เท่านั้น
4. **ทุกอย่างที่ใส่เข้าไปต้องอธิบายได้** ถ้าอธิบายไม่ได้ให้ตัดออก

---

## วิธีทำงาน: 1 ขั้น = 1 PR ทำโดย agent และคุณ merge เอง

แต่ละขั้นรันด้วย workflow (สั่ง "รัน workflow ขั้น N") ขั้นตอนคือ

1. **implement** แตก branch `step-NN-<ชื่อ>` จาก main แล้วทำตามขั้นนั้นใน PLAN.md และ ARCHITECTURE.md
2. **verify** รัน test, lint และ build ของส่วนที่แก้ ถ้าไม่ผ่านส่งกลับไป implement แก้ได้ไม่เกิน 2 รอบ
3. **review** อ่าน diff แล้วตรวจสองเรื่อง (ก) ตรงกับ spec ไหม (ข) มือใหม่อ่านเข้าใจไหม ถ้าพบโค้ดที่ซับซ้อนเกินจำเป็นให้ส่งกลับไปแก้
4. **walkthrough** เขียน `docs/walkthrough/step-NN.md` ภาษาไทย บอกว่าทำอะไร ไฟล์ไหน ทำไมเลือกแบบนี้ และคำถามสัมภาษณ์ที่อาจเจอพร้อมคำตอบ
5. **เปิด PR** แล้วหยุดรอ คุณอ่าน walkthrough และ diff แล้ว merge เอง จากนั้นค่อยเริ่มขั้นถัดไป

กติกาสำหรับ agent ทุกตัว:

- ห้าม commit secret ใช้ `.env.example` แทน
- ห้ามเพิ่ม library ที่ไม่ได้อยู่ใน ARCHITECTURE.md ถ้าจำเป็นให้หยุดแล้วถามก่อน
- ถ้า spec ไม่ครอบคลุมเรื่องไหน ให้หยุดแล้วถาม ไม่ต้องเดาเอง
- ถ้าต้องตัดสินใจเรื่องใหม่ ให้บันทึกลงหัวข้อ Decisions ใน ARCHITECTURE.md ใน PR เดียวกัน

---

## Design (คุณทำเองคู่ขนานกับขั้น 1–6)

- [ ] ใช้ prompt ใน [design-prompts.md](design-prompts.md) กับ Claude Design ตามลำดับ
- [ ] ใช้ handoff to Claude Code แล้วเก็บผลที่ `design/` (ลิงก์โปรเจกต์ + screenshot ทุกหน้า + export ถ้ามี)
- [ ] ขั้น 7 เป็นต้นไปต้องรอ design ก่อน agent จะใช้ `design/` เป็นแบบอ้างอิง แล้วเขียนใหม่ด้วย component ของ `components/bases/` + Tailwind

---

## งานหลัก

### ขั้น 1: ตั้ง repo

- [ ] `git init` ที่ `finalExam/` สร้าง public repo บน GitHub ย้ายไฟล์เข้าโครงตาม ARCHITECTURE.md (`homework/` ใส่ `.gitignore`)
- [ ] copy `api/`, `web/`, `keycloak/`, `compose.yml` จาก wongnok ไม่เอา `.env`, `node_modules`, `.swc`, `tsconfig.tsbuildinfo`
- [ ] ลบ recipe ทั้งหมด: `api/internal/recipe/` และ migration ของ recipe, difficulty, duration, favorite, rating และ `web/app/recipes`
- [ ] **ตัด Redis:** ลบ service ใน compose, ลบ cache ใน `user/repository.go`, ย้าย state และ ticket ของ `auth/repository.go` ไปเก็บในตาราง `auth_tickets` ใน Postgres (ดู ARCHITECTURE.md หัวข้อ Decisions)
- [ ] แก้บั๊กที่ติดมา: `internal/middleware/jwt.go:39` เติม `return` หลัง `AbortWithStatusJSON`
- [ ] `keycloak/import/pea-realm.json`: เปลี่ยน realm และ client เป็น `tabletime`, `"registrationAllowed": true` และเพิ่ม user ทดสอบ alice, bob, carol โดยกำหนด id ตายตัว
- [ ] เปลี่ยนชื่อทุกจุดจาก wongnok เป็น tabletime (module, container, DB)
- [ ] GitHub Actions: job `api` (vet + test) และ `web` (lint + typecheck + build)
- [ ] ตรวจความพร้อม: `docker compose up` → login → ได้ ticket → exchange ได้ token → เรียก `/users/:id` ได้

### ขั้น 2: Database + ARCHITECTURE.md ฉบับแรก

- [ ] migration ด้วย goose ตามหัวข้อ Data model ใน ARCHITECTURE.md: `restaurants`, `restaurant_hours`, `restaurant_images`, `bookings`, `reviews`, `auth_tickets` (ตารางของต่อยอด เช่น `restaurant_closures`, `review_replies` ค่อยสร้างในขั้นของมัน)
- [ ] constraint และ index ครบตามตาราง
- [ ] integration test ว่า migration รันผ่านบน testcontainers
- [ ] อัปเดต ER diagram ใน ARCHITECTURE.md ให้ตรงกับที่สร้างจริง

### ขั้น 3: API ร้าน (`internal/restaurant/`)

- [ ] ไฟล์ชุดเดียวกับ recipe: `model.go`, `dto.go`, `error.go`, `repository.go`, `service.go`, `handler.go` + test
- [ ] CRUD ร้าน + hours ในการเรียกเดียว (บันทึกใน transaction เดียว)
- [ ] validation: ชื่อ, `cuisine`, รูป URL ≥ 1, ที่นั่ง ≥ 1, `cancel_minutes` ≥ 30, hours วันละไม่เกิน 1 แถว, เปิด ≥ 1 วัน, `open_time ≠ close_time`, ถ้า `open_all_day` ห้ามส่งเวลา
- [ ] แก้หรือลบได้เฉพาะเจ้าของ (403 `NOT_OWNER`), ลบร้านที่ยังมีการจองในอนาคตไม่ได้ (409 `RESTAURANT_HAS_FUTURE_BOOKINGS`)
- [ ] `GET /restaurants?sort=highest_rated|most_reviewed&page&limit` (Highest rated: ร้านที่มีรีวิว < 3 ไปท้ายรายการ)
- [ ] `GET /me/restaurants`
- [ ] รูปแบบ error `{code, message, details}` ใช้ helper กลาง `internal/apperror` ทุก domain ใช้ร่วมกัน
- [ ] swag comment ทุก handler

### ขั้น 4: API จอง (`internal/booking/`) หัวใจของงาน

- [ ] ฟังก์ชันล้วน (pure function) ไม่แตะ DB ใน `booking/rules.go` + unit test ทุกเคส:
  - `openWindowFor(hours, start)` หาช่วงเปิดที่ครอบการจองนี้ (ดูทั้งวันของ `start` และวันก่อนหน้า เผื่อร้านข้ามเที่ยงคืน)
  - `checkSlotGrid(start, end)` ต้องลงช่อง 30 นาที และยาว ≥ 60 นาที
  - `seatsUsedPerSlot(bookings, start, end)` คืนจำนวนคนในแต่ละช่อง 30 นาที
  - `cancelDeadline(start, cancelMinutes)`
- [ ] service: ตรวจเวลาในอนาคต → ช่องเวลา → อยู่ในช่วงเปิดวันเดียว → ความเป็นเจ้าของ (ตอนแก้/ยกเลิก) → deadline (ตอนแก้/ยกเลิก)
- [ ] repository: transaction เดียว → `SELECT ... FOR UPDATE` แถวร้าน → ดึงการจอง active ที่ทับช่วงนี้ (ตอนแก้ใส่ `id <> ?`) → คำนวณที่นั่งรายช่อง → ถ้าช่องใดเกินตอบ `ErrNotEnoughSeats` → insert/update
- [ ] เก็บ `cancel_deadline` ตอนสร้าง และคำนวณใหม่ตอนแก้เวลา
- [ ] endpoints: `POST /restaurants/:id/bookings`, `GET /me/bookings`, `PUT /bookings/:id`, `POST /bookings/:id/cancel`, `GET /restaurants/:id/availability?date=`
- [ ] integration test (testcontainers) ตามเคสในสไลด์:
  - จองแล้ว 7 ขอเพิ่ม 5 ในช่วงที่ทับ → ปฏิเสธ
  - เคส A+B+C ของสไลด์ ขยายเป็นช่วงละ 1 ชม. เพราะกติกาเราจองได้ขั้นต่ำ 1 ชม.: A 7 (12:00–13:00), B 7 (13:00–14:00), C 3 (12:00–14:00) → C ผ่าน ทั้งที่ 7+7+3 = 17 และทดสอบฟังก์ชัน `seatsUsedPerSlot` ด้วยตัวเลขเดิมของสไลด์ (ช่วงละ 30 นาที) ใน unit test
  - แก้ A จาก 7 เป็น 8 ตอนมี B 3 → ปฏิเสธ, แก้เป็น 5 → ผ่าน
  - ร้านข้ามเที่ยงคืน 18:00–02:00: จอง 01:00–02:00 ผ่าน, 01:30–02:30 ไม่ผ่าน
  - ร้านเปิด 24 ชม. เสาร์และอาทิตย์: จอง 23:00–01:00 ไม่ผ่าน (ต้องอยู่ในช่วงเปิดของวันเดียว)
- [ ] race test: 10 goroutine จอง 6 ที่พร้อมกันในร้านที่เหลือ 6 → สำเร็จ 1 ที่เหลือได้ `ErrNotEnoughSeats`

### ขั้น 5: API รีวิว (`internal/review/`)

- [ ] `POST /restaurants/:id/reviews` (409 ถ้ารีวิวแล้ว), `PUT /restaurants/:id/reviews/me`, `DELETE /restaurants/:id/reviews/me`, `GET /restaurants/:id/reviews`
- [ ] service: ห้ามรีวิวร้านตัวเอง (403 `CANNOT_REVIEW_OWN`), rating 1–5
- [ ] repository: ทุกครั้งที่สร้าง แก้ หรือลบ ให้ lock แถวร้าน แล้วคำนวณ `average_rating` และ `review_count` ใหม่จากตาราง reviews ใน transaction เดียวกัน
- [ ] หน้าร้านต้องมี rating breakdown (จำนวนรีวิวของแต่ละดาว) ใช้ `GROUP BY rating` แล้วส่งไปกับ `GET /restaurants/:id`

### ขั้น 6: Seed data

- [ ] `api/cmd/seed/main.go` ล้างข้อมูลแล้วใส่ใหม่ วันที่ทั้งหมดคำนวณจาก "วันนี้" (seed เมื่อไหร่ก็ยังเดโมได้)
- [ ] user: alice (owner 2 ร้าน), bob (owner 1 ร้าน + ลูกค้า), carol (ลูกค้า) ใช้ id ตรงกับ realm
- [ ] 6 ร้าน ชื่อไทย: ร้านข้ามเที่ยงคืน, ร้านปิดวันจันทร์, ร้านเปิด 24 ชม. บางวัน, ร้าน 5.0 ที่มี 2 รีวิว, ร้านรีวิวเยอะ
- [ ] การจองพรุ่งนี้ที่ทำให้บางช่องเหลือ ≤ 3 ที่
- [ ] รันด้วย `docker compose run --rm api seed` แล้วเขียนวิธีไว้ใน README

### ขั้น 7: Web พื้นฐาน (login, ตัวเรียก API, error, สองโหมด)

- [ ] ฟอนต์ Prompt ผ่าน `next/font`, theme สีตาม design
- [ ] login: `app/auth/callback/route.ts` รับ ticket → เรียก `/auth/exchange` → ตั้ง httpOnly cookie → redirect กลับหน้าเดิม
- [ ] `lib/session.ts`: อ่าน token จาก cookie ถ้าหมดอายุให้ refresh ในที่เดียว, logout ลบ cookie
- [ ] `lib/api.ts`: ตัวเรียก API ฝั่ง server แนบ Bearer ให้เอง แปลง error เป็น `ApiError{code, details}`
- [ ] `lib/errors.ts`: ตาราง error code → ข้อความไทย (ตาม ARCHITECTURE.md) code ที่ไม่รู้จัก → "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง"
- [ ] layout สองโหมด: `app/(customer)/layout.tsx` และ `app/owner/layout.tsx` navbar แยกกัน มีปุ่มสลับโหมด ถ้ายังไม่ login ไม่แสดงปุ่มสลับ และเข้า `/owner` ไม่ได้

### ขั้น 8: Web ร้าน

- [ ] โหมดลูกค้า: `/` รายการร้าน (แท็บ Highest rated / Most reviewed), `/restaurants/[id]` รายละเอียด (ป้าย "ร้านของคุณ" ถ้าเป็นเจ้าของ)
- [ ] โหมดเจ้าของร้าน: `/owner` redirect ไป `/owner/restaurants`, `/owner/restaurants` (empty state "เปิดร้านแรกของคุณ"), `/owner/restaurants/new`, `/owner/restaurants/[id]` แท็บ "ข้อมูลร้าน" (ฟอร์มแก้ไข + ลบ)
- [ ] ฟอร์มเวลาเปิด 7 วัน แต่ละวันเลือก ปิด / เปิด 24 ชม. / กำหนดเวลา
- [ ] แยกให้ชัดว่าส่วนไหนเป็น Server Component และส่วนไหนเป็น Client Component ใส่ comment สั้น ๆ ว่าทำไม

### ขั้น 9: Web จอง

- [ ] ฟอร์มจองในหน้าร้าน: จำนวนคน, วันที่ (≤ 60 วัน), dropdown เวลาเริ่มและเวลาจบ (ช่องละ 30 นาที ตามช่วงเปิดของวันที่เลือก)
- [ ] กราฟแท่งที่นั่งรายช่องจาก `/availability` (component `SeatChart` ใช้ซ้ำในหน้าการจองของร้าน)
- [ ] หน้าจองสำเร็จแบบใบจอง (ตั๋ว) มีเลขจอง, วันเวลา, จำนวนคน, "ยกเลิกได้ถึง HH:MM"
- [ ] `/my-bookings` แท็บ กำลังจะมาถึง / ที่ผ่านมา / ยกเลิกแล้ว, แก้ไข, ยกเลิกผ่าน dialog ยืนยัน ถ้าเลย deadline ปุ่มเป็นสีเทาและบอกเหตุผล
- [ ] ทุก error แสดงเป็นข้อความไทยที่ผู้ใช้เข้าใจ

### ขั้น 10: Web รีวิว

- [ ] หน้าร้าน: สรุปคะแนน (ค่าเฉลี่ย, จำนวน, แท่ง 5★…1★), รายการรีวิว (ใหม่สุดก่อน)
- [ ] ฟอร์มรีวิว: ดาว + ข้อความ ถ้ารีวิวแล้วเปลี่ยนเป็น "รีวิวของคุณ" แก้ไขหรือลบได้ ถ้าเป็นร้านตัวเองแสดง "รีวิวร้านของตัวเองไม่ได้" แทนฟอร์ม

### ขั้น 11: e2e + CI/CD เต็ม

- [ ] `e2e/` Playwright + TypeScript, `globalSetup` รัน seed ก่อนทุกครั้ง
- [ ] 5 spec:
  1. `create-restaurant`: alice login ผ่าน Keycloak → โหมดเจ้าของร้าน → สร้างร้าน → เห็นร้านในรายการ
  2. `booking`: carol จองสำเร็จแล้วเห็นใบจอง → จองเกินที่นั่งแล้วเห็นข้อความไทย (ต้องไม่มีคำว่า `NOT_ENOUGH_SEATS` บนหน้าเว็บ)
  3. `edit-cancel`: carol แก้จำนวนคน → ยกเลิกผ่าน dialog → การจองย้ายไปแท็บยกเลิกแล้ว
  4. `review-ranking`: carol รีวิวร้านที่มี 2 รีวิวจนครบ 3 → ร้านขึ้นไปอยู่ในลำดับ Highest rated ตามคะแนน
  5. `two-roles`: alice (โหมดลูกค้า) เปิดร้านตัวเองแล้วเห็นป้าย "ร้านของคุณ" แต่ไม่เห็นฟอร์มรีวิว → สลับโหมดแล้วเห็นร้านใน "ร้านของฉัน" / carol เปิดร้านเดียวกันแล้วเห็นฟอร์มรีวิว และในโหมดเจ้าของร้านไม่มีร้านนี้
- [ ] CI: เพิ่ม job `e2e` (ทุก PR, อัปโหลด trace และวิดีโอเมื่อ fail) และ `publish` (push image `api` + `web` ขึ้น GHCR เมื่อ push เข้า main หลัง 3 job แรกผ่าน)
- [ ] ใส่ badge CI ใน README

---

## ต่อยอด (ทำหลังงานหลักเสร็จ เรียงจากง่ายไปยาก ข้อละ 1 PR)

| # | ฟีเจอร์ | งานหลัก ๆ |
|---|---|---|
| 12 | **Limited Seats Left!** | ช่องที่เหลือ ≤ 3 ที่ ขึ้นป้ายในกราฟและ dropdown (ใช้ `/availability` เดิม) |
| 13 | **Owner ดูการจองของร้าน** | `GET /restaurants/:id/bookings?date=` (เจ้าของเท่านั้น), แท็บ "การจอง" ในหน้าจัดการร้าน + `SeatChart`, เมนู "การจองของร้าน" รวมทุกร้าน |
| 14 | **รีวิวของฉัน** | `GET /me/reviews`, หน้า `/my-reviews` แก้ไขหรือลบได้ |
| 15 | **Owner ดูรีวิวของร้าน** | `GET /me/restaurant-reviews`, เมนู "รีวิวของร้าน", แท็บ "รีวิว" |
| 16 | **ค้นหาและกรองร้าน** | `?q=` (ILIKE ชื่อ) + `?cuisine=` |
| 17 | **แกลเลอรีหลายรูป** | ตารางรองรับอยู่แล้ว ทำ UI แกลเลอรีและเรียงลำดับรูป |
| 18 | **โปรไฟล์ผู้รีวิว (public)** | `GET /users/:id/profile`, หน้า `/users/[id]` กดจากชื่อผู้รีวิว |
| 19 | **วันหยุดเฉพาะวัน** | ตาราง `restaurant_closures`, แท็บ "วันหยุด", ถ้าทับการจองให้ถาม confirm (ไม่ใช่ error) การจองเดิมยังอยู่, การจองใหม่ในวันหยุดได้ 422 |
| 20 | **Owner ตอบรีวิว** | ตาราง `review_replies`, รีวิวละ 1 คำตอบ, ป้าย "รีวิวถูกแก้ไขหลังร้านตอบ" |
| 21 | **ภาพรวมโหมดเจ้าของร้าน** | `/owner` เป็น dashboard: การ์ดร้าน + การจองวันนี้ + รีวิวที่ยังไม่ตอบ |
| 22 | **ค้นหาร้านจากช่วงเวลาที่ว่าง** | `?date=&start=&end=&party=` ใช้ฟังก์ชันคำนวณที่นั่งเดิมกับทุกร้านที่เปิดช่วงนั้น |

---

## ส่งงาน

- [ ] README: วิธีรัน (`docker compose up` + seed), บัญชีทดสอบ, ข้อมูล seed, สรุป Decisions พร้อมลิงก์ไป ARCHITECTURE.md, ลิงก์ Swagger, ลิงก์ design, badge CI
- [ ] ทดสอบ clone ใหม่แล้วรันตั้งแต่ศูนย์ ต้องไม่มี secret จริงใน repo
- [ ] วิดีโอไม่เกิน 5 นาที: เดโมครบ 3 ฟีเจอร์ + สลับสองโหมด **เปิดโค้ด `booking/rules.go` และ repository** อธิบาย lock กับการคำนวณที่นั่งรายช่อง + โชว์ CI สีเขียว
- [ ] ส่ง: repo, วิดีโอ, design

## เตรียมสัมภาษณ์

คำตอบของแต่ละข้ออยู่ใน walkthrough ของขั้นที่เกี่ยวข้อง และหัวข้อ Decisions ใน ARCHITECTURE.md

- **สองคนกดพร้อมกันตอนเหลือ 6 ที่:** รับ 1 คน กันด้วย `FOR UPDATE` บนแถวร้านใน transaction (ขั้น 4)
- **ร้านเปิด 18:00–02:00:** `restaurant_hours` เก็บ `TIME` ถ้า `close < open` แปลว่าข้ามเที่ยงคืน แล้วตรวจกับช่วงเปิดของวันนั้นและวันก่อนหน้า (ขั้น 4)
- **1 รีวิว vs 300 รีวิว:** ร้านที่มีรีวิวน้อยกว่า 3 ไปท้ายรายการ (ขั้น 3)
- **ค่าเฉลี่ยมาจากไหน:** เก็บไว้ในตารางร้าน คำนวณใหม่ใน transaction ทุกครั้งที่รีวิวเปลี่ยน (ขั้น 5)
- **Next.js:** Server/Client Component, form, login + token ใน httpOnly cookie, โหมดดูจาก URL (ขั้น 7)
- **Go:** handler + status code (ตาราง error), transaction, timezone `Asia/Bangkok` + `TIMESTAMPTZ`
- **บั๊กจากโค้ดที่เรียนที่แก้แล้ว:** `jwt.go` ไม่มี `return`, cache ของ user ไม่เคยถูกใช้ (ตัดทิ้งไปพร้อม Redis)

## Verification

- `go test ./...` ผ่าน (unit + integration + race)
- `npm run lint && npm run build` ใน `web/` ผ่าน
- `npx playwright test` ใน `e2e/` ผ่านทั้ง 5 spec
- CI บน PR สุดท้ายเป็นสีเขียวทุก job และมี image บน GHCR
- เดโมด้วยมือตาม README บนเครื่องที่ clone ใหม่ได้ครบทุกฟีเจอร์
