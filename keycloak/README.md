# Keycloak realm snapshot

`import/tabletime-realm.json` คือ realm `tabletime` สำหรับ dev: ค่าของ realm, client ทั้งหมด
(รวมถึง `tabletime` ที่ `api` ใช้ login), client scopes และ user ทดสอบ 3 คน

| username | email | id (Keycloak `sub`) | password |
|---|---|---|---|
| alice | alice@tabletime.local | `11111111-1111-4111-8111-111111111111` | `tabletime` |
| bob | bob@tabletime.local | `22222222-2222-4222-8222-222222222222` | `tabletime` |
| carol | carol@tabletime.local | `33333333-3333-4333-8333-333333333333` | `tabletime` |

id ตายตัวเพื่อให้ seed data (ขั้น 6) อ้างถึง user เหล่านี้ได้ (`users.uid` = id ในตารางนี้)

ไฟล์นี้**ไม่มี secret จริง**:

- secret ของ client `tabletime` เขียนเป็น `${KEYCLOAK_CLIENT_SECRET}` Keycloak แทนค่าจาก env ของ
  container ตอน import (ค่ามาจาก `.env` ที่ root ผ่าน `compose.yml`)
- ไม่มี key สำหรับเซ็น token อยู่ในไฟล์ Keycloak สร้าง key ใหม่ให้เองตอน import
- password ของ user ทดสอบเป็นค่า dev ที่เปิดเผยได้

## How it gets loaded

`compose.yml` mounts this directory into the container:

```yaml
keycloak:
  command: ["start-dev", "--import-realm"]
  volumes:
    - keycloak-data:/opt/keycloak/data
    - ./keycloak/import:/opt/keycloak/data/import:ro
```

On `docker compose up`, `--import-realm` loads every file under `import/`. If the
`tabletime_keycloak-data` volume is empty (e.g. a fresh clone, or after removing the
volume), this recreates the `tabletime` realm, the `tabletime` client, client scopes, and users
from scratch — no manual setup through the Admin Console required.

If the volume already has data, Keycloak's import strategy is `IGNORE_EXISTING`: a realm that
already exists is left untouched and the import is skipped. So restarting an existing dev
environment never clobbers local changes made through the Admin Console. To force a clean
re-import, remove the volume first:

```bash
docker compose down
docker volume rm tabletime_keycloak-data
docker compose up -d
```

## Refreshing the snapshot

After changing anything in the Admin Console (new client, scope, user, realm setting, etc.),
re-export to update `import/tabletime-realm.json`:

```bash
docker compose stop keycloak
# temporarily allow the export to write into the (normally read-only) mount
sed -i '' 's#\./keycloak/import:/opt/keycloak/data/import:ro#./keycloak/import:/opt/keycloak/data/import#' compose.yml
docker compose run --rm keycloak export --dir /opt/keycloak/data/import --realm tabletime --users realm_file
git checkout -- compose.yml   # restore the :ro mount
docker compose up -d keycloak
```

ก่อน commit ต้องตรวจ diff เอง เพราะไฟล์ที่ export ใหม่จะมี secret จริงของ client, key ของ realm
และ password hash ของ user: เปลี่ยน `secret` กลับเป็น `${KEYCLOAK_CLIENT_SECRET}` และลบ
`components["org.keycloak.keys.KeyProvider"]` ออก
