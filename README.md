# Ignite Studios — v3 portal

Greenfield Nuxt app for the v3 rebuild ([PRD #1](https://github.com/evanromburgh/ignite-studios-v3/issues/1)). The legacy v2 app and Supabase stay frozen; this repo targets a **new** Supabase project.

## Prereqs

- Node 20+ (you have Node 22)
- npm (recommended; matches v2)

## Setup

1. Copy `frontend/.env.example` to `frontend/.env` and set `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_ANON_KEY` from your **v3** Supabase project (Settings → API).
2. Apply migrations to the **v3** project (CLI linked to that project only). See `backend/supabase/README.md`.
3. In Supabase Dashboard → **Authentication** → **URL configuration**: set **Site URL** to `http://localhost:3000` for local dev, and add **Redirect URLs** that include `http://localhost:3000/**` (tighten later for production).

### Verify connectivity

- `GET /api/health` — JSON (`supabaseConfigured`, `db` row when migrations + env are correct).
- `/health` — same payload in the browser.

## CI

GitHub Actions runs **lint → typecheck → test → build** on pushes and PRs (see `.github/workflows/ci.yml`). Use Node **22** and `npm ci` in `frontend/`.

## Pull requests and closing issues

Opening a PR shows a template (`.github/PULL_REQUEST_TEMPLATE.md`). Put **`Closes #123`** (or `Fixes` / `Resolves`) in the PR **description** with the real issue number. When that PR is **merged** into the default branch, GitHub **closes** those issues automatically. Direct pushes to `main` without a PR do not run that linking—you can still close issues by hand or reference commits in a follow-up PR.

## Scripts (from `frontend/`)

| Script        | Purpose        |
|---------------|----------------|
| `npm run dev` | Dev server     |
| `npm run lint`| ESLint         |
| `npm run typecheck` | `nuxt typecheck` |
| `npm run test`| Vitest (run)   |
| `npm run build` | Production build |

## Run (app lives in `frontend/`)

```bash
cd frontend
npm install
npm run dev
```

Open the URL Nuxt prints (default `http://localhost:3000`).

## Build

```bash
cd frontend
npm run build
```
