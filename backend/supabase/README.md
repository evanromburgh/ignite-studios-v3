# Supabase (v3 project)

Migrations target the **new v3 Supabase project** only. Do not apply these to the legacy v2 project.

## Option A — Supabase CLI (good for ongoing work)

### 1. Install the CLI (pick one)

- **npx (no global install):** use `npx supabase@latest` before every command below, or  
- **npm global:** `npm install -g supabase`  
- **Windows:** [Supabase CLI install](https://supabase.com/docs/guides/cli/getting-started) (Scoop, etc.)

### 2. Log in

```bash
npx supabase@latest login
```

This opens the browser and links the CLI to your Supabase account.

### 3. Link this repo to your v3 project

From the **repository root** (`ignite-studios-v3`):

1. In the [Supabase Dashboard](https://supabase.com/dashboard), open your **v3** project.
2. **Project ref** is the id in the URL:  
   `https://supabase.com/dashboard/project/<project-ref>`  
   (short alphanumeric string, e.g. `abcdxyz12345`).

Then run (replace `<project-ref>`):

```bash
npx supabase@latest link --workdir backend --project-ref <project-ref>
```

If the CLI asks for the **database password**, use the one you set when creating the project (or reset it under Project Settings → Database).

### 4. Push migrations

Still from the **repository root**:

```bash
npx supabase@latest db push --workdir backend
```

That applies everything under `backend/supabase/migrations/` to the **linked** remote database (including `health_probe`).

### 5. Shorthand

After linking once, you can use:

```bash
supabase db push --workdir backend
```

if `supabase` is on your `PATH`.

---

## Option B — Dashboard SQL (no CLI)

1. Open **SQL Editor** in the v3 project.
2. Paste the contents of `migrations/20260420120000_health_probe.sql`.
3. Run the script.

Use this if you only need a one-off apply or don’t want the CLI yet.
