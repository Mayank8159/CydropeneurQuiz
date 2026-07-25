<div align="center">

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects%20&%20Nature/Circuit%20Board.png" width="50"> CYDROPENEUR

### */// INITIALIZING CYBERPUNK QUIZ PROTOCOL... ///*

</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    41% { opacity: 1; }
    42% { opacity: 0.8; }
    43% { opacity: 1; }
    45% { opacity: 0.3; }
    46% { opacity: 1; }
    50% { opacity: 1; }
    51% { opacity: 0.6; }
    52% { opacity: 1; }
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  @keyframes neonPulse {
    0%, 100% {
      box-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff;
    }
    50% {
      box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff, 0 0 80px #0ff;
    }
  }

  @keyframes neonPulsePink {
    0%, 100% {
      box-shadow: 0 0 5px #f0f, 0 0 10px #f0f, 0 0 20px #f0f;
    }
    50% {
      box-shadow: 0 0 10px #f0f, 0 0 20px #f0f, 0 0 40px #f0f, 0 0 80px #f0f;
    }
  }

  @keyframes typeWriter {
    from { width: 0; }
    to { width: 100%; }
  }

  @keyframes blinkCursor {
    50% { border-color: transparent; }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes borderGlow {
    0% { border-color: #0ff; }
    33% { border-color: #f0f; }
    66% { border-color: #0f0; }
    100% { border-color: #0ff; }
  }

  .cyber-box {
    background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%);
    border: 1px solid #0ff;
    border-radius: 4px;
    padding: 24px;
    margin: 16px 0;
    position: relative;
    overflow: hidden;
    animation: neonPulse 3s ease-in-out infinite;
    font-family: 'Share Tech Mono', monospace;
  }

  .cyber-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #0ff, transparent);
    animation: scanline 3s linear infinite;
  }

  .cyber-box::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 255, 0.03) 2px,
      rgba(0, 255, 255, 0.03) 4px
    );
    pointer-events: none;
  }

  .cyber-box-pink {
    background: linear-gradient(135deg, #1a0a1a 0%, #2e0a2e 50%, #1a0a1a 100%);
    border: 1px solid #f0f;
    animation: neonPulsePink 3s ease-in-out infinite;
  }

  .cyber-box-pink::before {
    background: linear-gradient(90deg, transparent, #f0f, transparent);
  }

  .cyber-box-pink::after {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 0, 255, 0.03) 2px,
      rgba(255, 0, 255, 0.03) 4px
    );
  }

  .cyber-box-green {
    background: linear-gradient(135deg, #0a1a0a 0%, #0a2e0a 50%, #0a1a0a 100%);
    border: 1px solid #0f0;
    box-shadow: 0 0 5px #0f0, 0 0 10px #0f0, 0 0 20px #0f0;
  }

  .cyber-box-green::before {
    background: linear-gradient(90deg, transparent, #0f0, transparent);
  }

  .cyber-box-green::after {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 0, 0.03) 2px,
      rgba(0, 255, 0, 0.03) 4px
    );
  }

  .cyber-heading {
    color: #0ff;
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 4px;
    animation: flicker 4s infinite;
    text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff;
  }

  .cyber-heading-pink {
    color: #f0f;
    text-shadow: 0 0 10px #f0f, 0 0 20px #f0f, 0 0 40px #f0f;
  }

  .cyber-text {
    color: #b0b0c0;
    font-family: 'Share Tech Mono', monospace;
  }

  .cyber-highlight {
    color: #0ff;
    text-shadow: 0 0 5px #0ff;
  }

  .cyber-highlight-pink {
    color: #f0f;
    text-shadow: 0 0 5px #f0f;
  }

  .cyber-highlight-green {
    color: #0f0;
    text-shadow: 0 0 5px #0f0;
  }

  .tag {
    display: inline-block;
    padding: 2px 10px;
    margin: 2px;
    border: 1px solid #0ff;
    border-radius: 2px;
    color: #0ff;
    font-size: 12px;
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .tag-pink {
    border-color: #f0f;
    color: #f0f;
  }

  .tag-green {
    border-color: #0f0;
    color: #0f0;
  }

  .arch-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 20px 0;
  }

  .arch-node {
    padding: 12px 20px;
    border: 1px solid #0ff;
    border-radius: 4px;
    background: rgba(0, 255, 255, 0.05);
    color: #0ff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    text-align: center;
    animation: neonPulse 3s ease-in-out infinite;
  }

  .arch-node-pink {
    border-color: #f0f;
    background: rgba(255, 0, 255, 0.05);
    color: #f0f;
    animation: neonPulsePink 3s ease-in-out infinite;
  }

  .arch-node-green {
    border-color: #0f0;
    background: rgba(0, 255, 0, 0.05);
    color: #0f0;
    box-shadow: 0 0 5px #0f0;
  }

  .arch-arrow {
    color: #555;
    font-size: 20px;
    animation: flicker 2s infinite;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    font-family: 'Share Tech Mono', monospace;
  }

  th {
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid #0ff;
    color: #0ff;
    padding: 10px 16px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 12px;
  }

  td {
    border: 1px solid #1a3a4a;
    padding: 8px 16px;
    color: #b0b0c0;
  }

  tr:hover td {
    background: rgba(0, 255, 255, 0.05);
  }

  code {
    background: rgba(0, 255, 255, 0.1) !important;
    border: 1px solid #0ff33 !important;
    color: #0ff !important;
    padding: 2px 6px;
    border-radius: 2px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
  }

  pre {
    background: #0a0a1a !important;
    border: 1px solid #0ff33 !important;
    border-radius: 4px;
    padding: 16px;
    overflow-x: auto;
  }

  pre code {
    background: transparent !important;
    border: none !important;
    color: #0f0 !important;
  }
</style>

<br>

<div align="center">

# <span class="cyber-heading">CYDROPENEUR</span>

### */// CYBERPUNK QUIZ ARENA — INITIALIZED ///*

---

<span class="tag">NEXT.JS 15</span>
<span class="tag tag-pink">AWS LAMBDA</span>
<span class="tag tag-green">DYNAMODB</span>
<span class="tag">SST V4</span>
<span class="tag tag-pink">PWA</span>

</div>

<br>

<div class="cyber-box">

## <span class="cyber-heading">> ARCHITECTURE_</span>

<br>

<div class="arch-flow">
  <div class="arch-node">
    ⚡ NEXT.JS<br><small style="color:#777">Vercel</small>
  </div>
  <span class="arch-arrow"> ──▶ </span>
  <div class="arch-node arch-node-pink">
    🔐 API GATEWAY<br><small style="color:#777">AWS</small>
  </div>
  <span class="arch-arrow"> ──▶ </span>
  <div class="arch-node arch-node-green">
    ⚙️ LAMBDA<br><small style="color:#777">Functions</small>
  </div>
  <span class="arch-arrow"> ──▶ </span>
  <div class="arch-node">
    🗄️ DYNAMODB<br><small style="color:#777">NoSQL</small>
  </div>
</div>

</div>

<br>

<div class="cyber-box cyber-box-pink">

## <span class="cyber-heading cyber-heading-pink">> STACK_</span>

<br>

| Layer | Tech | Role |
|-------|------|------|
| <span class="cyber-highlight">Frontend</span> | Next.js 15, Tailwind v4, Motion v12 | Cyberpunk UI, quiz engine, admin panel |
| <span class="cyber-highlight-pink">Backend</span> | SST v4, AWS Lambda, API Gateway V2 | REST API, auth, scoring |
| <span class="cyber-highlight-green">Database</span> | DynamoDB (2 tables) | Questions & submissions |
| <span class="cyber-highlight">Deploy</span> | Vercel + AWS | Global CDN + serverless |
| <span class="cyber-highlight-pink">PWA</span> | Service Worker, Manifest | Installable on mobile |

</div>

<br>

<div class="cyber-box cyber-box-green">

## <span class="cyber-heading" style="color:#0f0; text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 40px #0f0;">> GETTING STARTED_</span>

<br>

```bash
# Clone the repo
git clone https://github.com/Mayank8159/CydropeneurQuiz.git
cd CydropeneurQuiz

# Install dependencies
pnpm install

# Run frontend
pnpm dev:web

# Run backend (separate terminal)
pnpm dev:backend
```

</div>

<br>

<div class="cyber-box">

## <span class="cyber-heading">> PROJECT STRUCTURE_</span>

<br>

```
cydropeneur-quiz/
├── apps/
│   ├── web/                    # Next.js 15 frontend
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Player login
│   │   │   ├── quiz/           # Quiz engine
│   │   │   ├── complete/       # Results screen
│   │   │   └── admin/          # Admin panel
│   │   ├── components/
│   │   │   ├── ui/             # Cyberpunk UI primitives
│   │   │   ├── quiz/           # Quiz-specific components
│   │   │   └── admin/          # Admin dashboard components
│   │   ├── hooks/              # useTimer, etc.
│   │   └── lib/                # API client, utilities
│   └── backend/                # SST v4 + Lambda
│       ├── functions/          # API route handlers
│       │   ├── questions.ts    # GET  /api/questions
│       │   ├── submit.ts       # POST /api/submit
│       │   ├── check-player.ts # GET  /api/check-player
│       │   ├── admin-questions.ts
│       │   ├── admin-leaderboard.ts
│       │   └── admin-clear-data.ts
│       └── sst.config.ts       # Infrastructure as code
└── packages/
    └── shared/                 # Shared types & Zod schemas
```

</div>

<br>

<div class="cyber-box cyber-box-pink">

## <span class="cyber-heading cyber-heading-pink">> SCRIPTS_</span>

<br>

| Command | Description | Status |
|---------|-------------|--------|
| <code>pnpm dev:web</code> | Frontend dev server (Turbopack) | <span class="tag" style="font-size:10px">ACTIVE</span> |
| <code>pnpm dev:backend</code> | SST local Lambda dev | <span class="tag" style="font-size:10px">ACTIVE</span> |
| <code>pnpm deploy:backend</code> | Deploy backend to AWS | <span class="tag tag-pink" style="font-size:10px">PROD</span> |
| <code>pnpm build:web</code> | Production build | <span class="tag tag-green" style="font-size:10px">BUILD</span> |
| <code>pnpm typecheck</code> | Type-check all packages | <span class="tag" style="font-size:10px">CI</span> |

</div>

<br>

<div class="cyber-box">

## <span class="cyber-heading">> API ROUTES_</span>

<br>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| <span class="cyber-highlight-green">GET</span> | `/api/questions` | None | Fetch quiz questions |
| <span class="cyber-highlight">POST</span> | `/api/submit` | None | Submit quiz answers |
| <span class="cyber-highlight-green">GET</span> | `/api/check-player` | None | Check name uniqueness |
| <span class="cyber-highlight">POST</span> | `/api/admin/questions` | <span class="cyber-highlight-pink">Admin</span> | Create question |
| <span class="cyber-highlight">DELETE</span> | `/api/admin/questions` | <span class="cyber-highlight-pink">Admin</span> | Delete question |
| <span class="cyber-highlight-green">GET</span> | `/api/admin/leaderboard` | <span class="cyber-highlight-pink">Admin</span> | Fetch leaderboard |
| <span class="cyber-highlight">POST</span> | `/api/admin/clear-data` | <span class="cyber-highlight-pink">Admin</span> | Clear all data |

</div>

<br>

<div class="cyber-box cyber-box-green">

## <span class="cyber-heading" style="color:#0f0; text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 40px #0f0;">> FEATURES_</span>

<br>

- <span class="cyber-highlight">Cyberpunk UI</span> — Neon glow, scanlines, glitch effects
- <span class="cyber-highlight-pink">Real-time Leaderboard</span> — Ranked by score & speed
- <span class="cyber-highlight">PWA Ready</span> — Install on mobile for full-screen
- <span class="cyber-highlight-green">Admin Panel</span> — Deploy questions, manage data
- <span class="cyber-highlight-pink">Name Lock</span> — Unique callsigns per player
- <span class="cyber-highlight">Serverless</span> — Auto-scaling on AWS Lambda

</div>

<br>

<div align="center">

---

<span class="cyber-text" style="animation: flicker 3s infinite;">
  /// SYSTEM STATUS: <span class="cyber-highlight-green">ONLINE</span> ///
</span>

<br>

<span class="tag">CYDROPENEUR</span> <span class="tag tag-pink">v1.0</span> <span class="tag tag-green">PRODUCTION</span>

</div>
