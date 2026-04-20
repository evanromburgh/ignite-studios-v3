-- Baseline connectivity probe for v3 (apply to the v3 Supabase project only).
create table if not exists public.health_probe (
  id int primary key default 1,
  checked_at timestamptz not null default now()
);

insert into public.health_probe (id)
values (1)
on conflict (id) do nothing;

alter table public.health_probe enable row level security;

create policy "health_probe_select_anon"
  on public.health_probe
  for select
  to anon
  using (true);
