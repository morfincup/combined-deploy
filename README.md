# Birlashtirilgan deploy (Shef Menejer + Premium Test Platform)

Bu paket 2 ta loyihani **bitta domen ostida** serverga joylashga tayyor holatda beradi:

- `http://DOMAIN/shef/`  → Shef Menejer (React/Vite)
- `http://DOMAIN/premium/` → Premium Test Platform (statik)
- API proxylari:
  - `/shef-api/*`  → Shef API (Node/Express, Postgres)
  - `/premium-api/*` → Premium API (Node/Express, SQLite)

## 1) Ishga tushirish (Docker)
```bash
cp .env.example .env
docker compose up -d --build
```

## 2) Muhim sozlamalar
- `.env` ichida `CORS_ORIGIN` ni domeningizga moslab qo'ying (masalan: https://yourdomain.uz)
- Premium admin login `ADMIN_EMAIL` va `ADMIN_PASSWORD` bilan yaratiladi.
- Shef API Postgresga `DATABASE_URL` orqali ulanadi.

## 3) Nginx / SSL
Agar sizda tashqi Nginx + SSL bo'lsa, bu compose'dagi `web` (80-port)ga reverse-proxy qilib qo'yasiz.
