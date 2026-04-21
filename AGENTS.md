# Agent workflow — ignite-studios-v3

Repository: **[evanromburgh/ignite-studios-v3](https://github.com/evanromburgh/ignite-studios-v3)**.

## Layout

- Nuxt app lives in **`frontend/`** (npm, not pnpm).
- Supabase migrations and CLI notes: **`backend/supabase/`**.

## Commands (from `frontend/`)

Run before pushing: **`npm run lint`**, **`npm run typecheck`**, **`npm run test`**, **`npm run build`**.

## Product spec

- High-level requirements and parity bar: GitHub **[PRD #1](https://github.com/evanromburgh/ignite-studios-v3/issues/1)**.

## Issues and PRs

- Track work in GitHub **Issues** on this repo.
- Use **`gh`** with **`--repo evanromburgh/ignite-studios-v3`** (or `cd` to a clone whose `origin` is this repo).
- Open a **pull request** into `main` for each slice; put **`Closes #N`** in the PR **description** so merging closes the issue (see `README.md` and `.github/PULL_REQUEST_TEMPLATE.md`).

## Context hygiene & handoff

If you must stop mid-issue: post a **comment** on the issue with what’s done, branch name, commit SHAs, commands run, and what’s left. The next session should start with `gh issue view <N> --repo evanromburgh/ignite-studios-v3` and read that comment.
