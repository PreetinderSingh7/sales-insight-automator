# 🚀 Sales Insight Automator — Rabbitt AI

Upload a CSV/XLSX sales file → AI generates an executive summary → Delivered to your inbox.

## Stack
- **Frontend**: Next.js 14 + TypeScript
- **Backend**: FastAPI + Python 3.11
- **AI**: Google Gemini 1.5 Flash
- **Email**: Gmail SMTP via aiosmtplib
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

---

## 🐳 Running with Docker Compose

### 1. Clone the repo
```bash
git clone https://github.com/your-username/sales-insight-automator.git
cd sales-insight-automator
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
# Fill in your GEMINI_API_KEY, SMTP_USER, SMTP_PASSWORD
```

### 3. Start everything
```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

---

## 🔐 Security Measures

| Layer | Implementation |
|---|---|
| Rate Limiting | 5 requests/minute per IP (SlowAPI) |
| CORS | Whitelist-only via `ALLOWED_ORIGINS` env var |
| File Validation | Extension + size check (10MB max) |
| Input Sanitization | Email regex + pandas safe parsing |
| Non-root Docker | App runs as unprivileged system user |
| Secrets | All credentials via `.env`, never hardcoded |

---

## 🔑 Environment Variables

See `backend/.env.example` for all required keys.

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API Key |
| `SMTP_HOST` | SMTP server (default: smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (default: 587) |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASSWORD` | Gmail App Password (NOT your normal password) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |