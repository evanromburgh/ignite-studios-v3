# Supabase (v3 project)

Migrations target the **new v3 Supabase project** only. Do not apply these to the legacy v2 project.

From the **repository root** (same pattern as v2):

```bash
supabase --workdir backend db push
```

Or set `SUPABASE_WORKDIR=backend` and run `supabase db push` from the repo root.

Link the CLI once: `supabase link --workdir backend` (use the v3 project ref).
