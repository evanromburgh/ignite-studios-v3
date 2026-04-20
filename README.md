# Ignite Studios — v3 portal

Greenfield Nuxt app for the v3 rebuild ([PRD #1](https://github.com/evanromburgh/ignite-studios-v3/issues/1)). The legacy v2 app and Supabase stay frozen; this repo targets a **new** Supabase project.

## Prereqs

- Node 20+ (you have Node 22)
- npm (recommended; matches v2)

## Setup

1. Copy `frontend/.env.example` to `frontend/.env` and set `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_ANON_KEY` from your **v3** Supabase project.
2. In Supabase Dashboard → Authentication → URL configuration, add `http://localhost:3000` (and callback paths your auth flow uses).

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
