<div align="center">

# ⚡ CYDROPRENEUR ⚡

![Status](https://img.shields.io/badge/STATUS-ONLINE-brightgreen?style=for-the-badge&labelColor=0a0a1a)
![Version](https://img.shields.io/badge/VERSION-1.0-cyan?style=for-the-badge&labelColor=0a0a1a)
![Stage](https://img.shields.io/badge/STAGE-PRODUCTION-pink?style=for-the-badge&labelColor=0a0a1a)

<br>

```
 ██████╗██╗   ██╗██████╗  ██████╗ ███████╗██████╗ ████████╗███████╗██████╗ ███╗   ███╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔═══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
██║      ╚████╔╝ ██████╔╝██║   ██║███████╗██████╔╝   ██║   █████╗  ██████╔╝██╔████╔██║
██║       ╚██╔╝  ██╔══██╗██║   ██║╚════██║██╔═══╝    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
╚██████╗   ██║   ██████╔╝╚██████╔╝███████║██║        ██║   ███████╗██║  ██║██║ ╚═╝ ██║
 ╚═════╝   ╚═╝   ╚═════╝  ╚═════╝ ╚══════╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
```

### `> INITIALIZING CYBERPUNK QUIZ PROTOCOL...`

![Next.js](https://img.shields.io/badge/NEXT.JS-15-black?style=flat-square&logo=next.js&logoColor=white&labelColor=0a0a1a)
![Tailwind](https://img.shields.io/badge/TAILWAND-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0a0a1a)
![AWS](https://img.shields.io/badge/AWS-LAMBDA-ff9900?style=flat-square&logo=amazondynamodb&logoColor=white&labelColor=0a0a1a)
![SST](https://img.shields.io/badge/SST-v4-e7157b?style=flat-square&labelColor=0a0a1a)
![PWA](https://img.shields.io/badge/PWA-READY-5a0fc7?style=flat-square&logo=pwa&logoColor=white&labelColor=0a0a1a)

---

</div>

## <img src="https://img.shields.io/badge/-ARCHITECTURE-0ff?style=for-the-badge&labelColor=0a0a1a" width="280">

<br>

<div align="center">

```
  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
  │              │       │              │       │              │       │              │
  │   ⚡ NEXT.JS │──HTTPS──▶│ 🔐 API GW   │──SDK──▶│ ⚙️ LAMBDA    │──AWS──▶│ 🗄️ DYNAMODB  │
  │    (Vercel)  │       │  (Gateway V2)│       │  (Functions) │       │  (NoSQL)     │
  │              │       │              │       │              │       │              │
  └──────────────┘       └──────────────┘       └──────────────┘       └──────────────┘

  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │  CYBERPUNK FRONTEND  │  REST API  │  SERVERLESS  │  TWO TABLES  │  MOBILE PWA  │
  └──────────────────────────────────────────────────────────────────────────────────────┘
```

</div>

---

## <img src="https://img.shields.io/badge/-STACK-0ff?style=for-the-badge&labelColor=0a0a1a" width="200">

| Layer | Technology | Role |
|:------|:-----------|:-----|
| <img src="https://img.shields.io/badge/-Frontend-0ff?style=flat-square&labelColor=0a0a1a" width="110"> | Next.js 15, Tailwind v4, Motion v12 | Cyberpunk UI, quiz engine, admin panel |
| <img src="https://img.shields.io/badge/-Backend-f0f?style=flat-square&labelColor=0a0a1a" width="110"> | SST v4, AWS Lambda, API Gateway V2 | REST API, auth, scoring |
| <img src="https://img.shields.io/badge/-Database-0f0?style=flat-square&labelColor=0a0a1a" width="110"> | DynamoDB (2 tables) | Questions & submissions |
| <img src="https://img.shields.io/badge/-Deploy-0ff?style=flat-square&labelColor=0a0a1a" width="110"> | Vercel + AWS | Global CDN + serverless |
| <img src="https://img.shields.io/badge/-PWA-f0f?style=flat-square&labelColor=0a0a1a" width="110"> | Service Worker + Manifest | Installable on mobile |

---

## <img src="https://img.shields.io/badge/-GETTING%20STARTED-0f0?style=for-the-badge&labelColor=0a0a1a" width="300">

```bash
# Clone the repo
git clone https://github.com/Mayank8159/CydropeneurQuiz.git
cd CydropeneurQuiz

# Install dependencies
pnpm install

# Setup environment variables (copy template files and populate required keys in .env)
cp apps/web/.env.example apps/web/.env
cp apps/backend/.env.example apps/backend/.env

# Run frontend (terminal 1)
pnpm dev:web

# Run backend (terminal 2)
pnpm dev:backend
```

### Environment Configuration (`.env`)
Ensure your `.env` files contain the required security credentials (never commit `.env` to git):
- `apps/web/.env`:
  - `NEXT_PUBLIC_API_URL`: Blank for local dev (uses local Next.js API routes), or set to deployed AWS API Gateway URL.
  - `NEXT_PUBLIC_EVENT_PASSKEY`: Required player event access key.
  - `ADMIN_EMAIL`: Comma-separated allowed admin emails.
  - `ADMIN_PASSKEY`: Secret admin authentication passkey.
- `apps/backend/.env`:
  - `ADMIN_EMAIL`: Allowed admin emails for Lambda auth.
  - `ADMIN_PASSKEY`: Admin passkey for Lambda auth.

---

## <img src="https://img.shields.io/badge/-PROJECT%20STRUCTURE-0ff?style=for-the-badge&labelColor=0a0a1a" width="340">

```
cydropeneur-quiz/
├── apps/
│   ├── web/                         # Next.js 15 frontend
│   │   ├── app/
│   │   │   ├── page.tsx             # 🎮 Player login
│   │   │   ├── quiz/page.tsx        # ⚡ Quiz engine
│   │   │   ├── complete/page.tsx    # 🏆 Results screen
│   │   │   └── admin/
│   │   │       ├── page.tsx         # 🔐 Admin login
│   │   │       └── dashboard/page   # 📊 Admin dashboard
│   │   ├── components/
│   │   │   ├── ui/                  # Cyberpunk UI primitives
│   │   │   ├── quiz/                # Quiz components
│   │   │   └── admin/               # Admin components
│   │   ├── hooks/                   # useTimer
│   │   └── lib/                     # API client, utils
│   └── backend/                     # SST v4 + Lambda
│       ├── functions/
│       │   ├── questions.ts         # GET  /api/questions
│       │   ├── submit.ts            # POST /api/submit
│       │   ├── check-player.ts      # GET  /api/check-player
│       │   ├── admin-login.ts       # POST /api/admin/login
│       │   ├── admin-questions.ts   # CRUD /api/admin/questions
│       │   ├── admin-leaderboard.ts # GET  /api/admin/leaderboard
│       │   └── admin-clear-data.ts  # POST /api/admin/clear-data
│       └── sst.config.ts            # Infrastructure as code
└── packages/
    └── shared/                      # Shared types & Zod schemas
```

---

## <img src="https://img.shields.io/badge/-SCRIPTS-f0f?style=for-the-badge&labelColor=0a0a1a" width="220">

| Command | Description |
|:--------|:------------|
| `pnpm dev:web` | <img src="https://img.shields.io/badge/-ACTIVE-0f0?style=flat-square&labelColor=0a0a1a"> Frontend dev server (Turbopack) |
| `pnpm dev:backend` | <img src="https://img.shields.io/badge/-ACTIVE-0f0?style=flat-square&labelColor=0a0a1a"> SST local Lambda dev |
| `pnpm deploy:backend` | <img src="https://img.shields.io/badge/-PROD-f0f?style=flat-square&labelColor=0a0a1a"> Deploy backend to AWS |
| `pnpm build:web` | <img src="https://img.shields.io/badge/-BUILD-0ff?style=flat-square&labelColor=0a0a1a"> Production build |
| `pnpm typecheck` | <img src="https://img.shields.io/badge/-CI-5a0fc7?style=flat-square&labelColor=0a0a1a"> Type-check all packages |

---

## <img src="https://img.shields.io/badge/-API%20ROUTES-0ff?style=for-the-badge&labelColor=0a0a1a" width="260">

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| <img src="https://img.shields.io/badge/-GET-0f0?style=flat-square&labelColor=0a0a1a"> | `/api/questions` | Public | Fetch quiz questions |
| <img src="https://img.shields.io/badge/-POST-0ff?style=flat-square&labelColor=0a0a1a"> | `/api/submit` | Public | Submit quiz answers |
| <img src="https://img.shields.io/badge/-GET-0f0?style=flat-square&labelColor=0a0a1a"> | `/api/check-player` | Public | Check name uniqueness |
| <img src="https://img.shields.io/badge/-POST-0ff?style=flat-square&labelColor=0a0a1a"> | `/api/admin/login` | <img src="https://img.shields.io/badge/-ADMIN-f0f?style=flat-square&labelColor=0a0a1a"> | Admin email & passkey login |
| <img src="https://img.shields.io/badge/-POST-0ff?style=flat-square&labelColor=0a0a1a"> | `/api/admin/questions` | <img src="https://img.shields.io/badge/-ADMIN-f0f?style=flat-square&labelColor=0a0a1a"> | Create question |
| <img src="https://img.shields.io/badge/-DELETE-f00?style=flat-square&labelColor=0a0a1a"> | `/api/admin/questions` | <img src="https://img.shields.io/badge/-ADMIN-f0f?style=flat-square&labelColor=0a0a1a"> | Delete question |
| <img src="https://img.shields.io/badge/-GET-0f0?style=flat-square&labelColor=0a0a1a"> | `/api/admin/leaderboard` | <img src="https://img.shields.io/badge/-ADMIN-f0f?style=flat-square&labelColor=0a0a1a"> | Fetch leaderboard |
| <img src="https://img.shields.io/badge/-POST-0ff?style=flat-square&labelColor=0a0a1a"> | `/api/admin/clear-data` | <img src="https://img.shields.io/badge/-ADMIN-f0f?style=flat-square&labelColor=0a0a1a"> | Clear all data |

---

## <img src="https://img.shields.io/badge/-FEATURES-0f0?style=for-the-badge&labelColor=0a0a1a" width="240">

<br>

<img src="https://img.shields.io/badge/Cyberpunk_UI-0ff?style=for-the-badge&labelColor=0a0a1a"> Neon glow, scanlines, glitch effects, CRT aesthetics

<img src="https://img.shields.io/badge/Real--time_Leaderboard-f0f?style=for-the-badge&labelColor=0a0a1a"> Ranked by score & speed

<img src="https://img.shields.io/badge/PWA_Ready-5a0fc7?style=for-the-badge&labelColor=0a0a1a"> Install on mobile for full-screen

<img src="https://img.shields.io/badge/Admin_Panel-f0f?style=for-the-badge&labelColor=0a0a1a"> Deploy questions, manage data

<img src="https://img.shields.io/badge/Name_Lock-0f0?style=for-the-badge&labelColor=0a0a1a"> Unique callsigns per player

<img src="https://img.shields.io/badge/Serverless-0ff?style=for-the-badge&labelColor=0a0a1a"> Auto-scaling on AWS Lambda

---

<div align="center">

```
> SYSTEM STATUS: ONLINE // ALL SYSTEMS NOMINAL
```

![CYDROPRENEUR](https://img.shields.io/badge/CYDROPRENEUR-v1.0-0ff?style=for-the-badge&labelColor=0a0a1a)
![PRODUCTION](https://img.shields.io/badge/PRODUCTION-LIVE-0f0?style=for-the-badge&labelColor=0a0a1a)

</div>
