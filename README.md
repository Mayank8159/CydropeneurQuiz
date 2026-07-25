# CYDROPENEUR

A cyberpunk-themed quiz platform built for speed, style, and competition.

## Stack

- **Frontend** — Next.js 15, Tailwind CSS v4, Motion v12
- **Backend** — AWS Lambda via SST v4, API Gateway V2, DynamoDB
- **Deploy** — Vercel (web), AWS (API + DB)
- **PWA** — Installable on mobile for full-screen experience

## Architecture

```
┌─────────────────────┐     HTTPS     ┌──────────────┐     SDK     ┌──────────┐
│  Next.js (Vercel)   │ ──────────── │  API Gateway  │ ────────── │ DynamoDB │
│  Cyberpunk Frontend │              │  AWS Lambda   │            │  Tables  │
└─────────────────────┘              └──────────────┘            └──────────┘
```

## Getting Started

```bash
pnpm install

# Frontend
pnpm dev:web

# Backend (separate terminal)
pnpm dev:backend
```

## Project Structure

```
apps/
  web/            # Next.js 15 frontend
    app/          # App Router pages
    components/   # UI + quiz + admin components
    lib/          # API client, utilities
  backend/        # SST v4 + Lambda functions
    functions/    # API route handlers
packages/
  shared/         # Shared types & Zod schemas
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Start frontend dev server |
| `pnpm dev:backend` | Start SST dev (local Lambda) |
| `pnpm deploy:backend` | Deploy backend to AWS |
| `pnpm typecheck` | Type-check all packages |
