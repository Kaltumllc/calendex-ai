# Calendex AI 🚀

> Intelligent scheduling platform powered by Claude AI. Built with Next.js, Node.js, and PostgreSQL.

**Live URL:** https://calendexai.com  
**Stack:** Next.js · Node/Express · PostgreSQL · Claude AI (Anthropic)  
**Architecture:** Monorepo (pnpm workspaces) · Docker · Vercel + Railway

---

## Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based register/login |
| 🔗 Booking Links | Share a `/book/your-slug` URL |
| 📅 Availability | Set weekly availability windows |
| 🤖 AI Assistant | Ask Claude about your schedule |
| 🔄 Smart Reschedule | AI suggests 3 optimal alternatives |
| 📝 Meeting Summaries | Paste transcript → structured summary |
| 🛡️ Conflict Guard | Auto-detects double bookings |

---

## Project Structure

```
calendex-ai/
├── apps/
│   ├── web/          # Next.js 14 frontend → Vercel
│   └── api/          # Express API → Railway
├── docker-compose.yml
├── .env.example
└── pnpm-workspace.yaml
```

---

## Quick Start (Local)

### 1. Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Docker Desktop

### 2. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/calendex-ai
cd calendex-ai
pnpm install
```

### 3. Environment

```bash
cp .env.example .env
# Fill in your keys:
# ANTHROPIC_API_KEY=...
# OPENAI_API_KEY=...  (optional)
# JWT_SECRET=...      (any 32+ char string)
```

### 4. Start Database

```bash
docker-compose up postgres -d
```

### 5. Run Dev Servers

```bash
# Terminal 1 — API
cd apps/api && node src/index.js

# Terminal 2 — Frontend
cd apps/web && npm run dev
```

- Frontend: http://localhost:3000  
- API: http://localhost:4000  
- Health: http://localhost:4000/health

---

## Deploy to Production

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `apps/api` as root directory
3. Add PostgreSQL plugin
4. Set environment variables (copy from `.env.example`)
5. Deploy. Get your API URL.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set root directory to `apps/web`
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app`
4. Deploy. Get your app URL.

### DNS → Cloudflare (CalendexAI.com)

1. Vercel dashboard → Domains → Add `calendexai.com`
2. In Cloudflare DNS:
   - Add `CNAME` record: `@` → `cname.vercel-dns.com`
   - Add `CNAME` record: `www` → `cname.vercel-dns.com`
3. Set SSL to **Full (strict)** in Cloudflare

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get profile |
| POST | `/api/schedule/links` | Yes | Create booking link |
| GET | `/api/schedule/links` | Yes | Get my links |
| GET | `/api/schedule/:slug/availability?date=YYYY-MM-DD` | No | Get open slots |
| POST | `/api/schedule/availability` | Yes | Set availability |
| POST | `/api/bookings` | No | Book a slot |
| GET | `/api/bookings` | Yes | Get my bookings |
| PATCH | `/api/bookings/:id/cancel` | Yes | Cancel booking |
| PATCH | `/api/bookings/:id/reschedule` | Yes | Reschedule |
| POST | `/api/ai/assistant` | Yes | AI chat |
| POST | `/api/ai/suggest-reschedule` | Yes | AI reschedule suggestions |
| POST | `/api/ai/summarize` | Yes | Summarize meeting |

---

## Author

**Mustapha Ibrahim**  
B.S. Information Technology — UMass Lowell  
[calendexai.com](https://calendexai.com)
