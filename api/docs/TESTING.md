# Testing Guide

แนวทางนี้ช่วยให้ test ของ TableTime API อ่านง่าย ดูแลต่อได้ และทดสอบพฤติกรรมจริงในจุดที่สำคัญ

- เขียน test ด้วย [`testify`](https://github.com/stretchr/testify) เป็นหลัก (`assert`/`require` และ suite เมื่อเหมาะสม)
- ทดสอบ repository ที่เชื่อมต่อ Database ด้วย [Testcontainers](https://testcontainers.com/) เพื่อใช้ Postgres จริงแบบแยกอิสระ
  (ดูตัวอย่างที่ `internal/auth/repository_integration_test.go`)
- ส่วนอื่นให้ stub dependency เท่าที่ทำได้ เพื่อให้ test เร็วและเจาะจง
- สร้าง mock ด้วย `mockery` เท่านั้น และหลีกเลี่ยงการเขียน mock struct เอง เว้นแต่จำเป็นจริง ๆ

รัน test ทั้งหมด (ต้องเปิด Docker ไว้ เพราะ integration test สร้าง Postgres container เอง):

```sh
go test ./...
```

ดูข้อกำหนดเพิ่มเติมของโปรเจกต์ได้ที่ [AGENTS.md](../AGENTS.md)
