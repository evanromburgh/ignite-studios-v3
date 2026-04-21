-- Units + wishlists (browse + reservation fields). Aligns with ignite-studios-v2 schema.
-- Apply to the v3 Supabase project.

-- -----------------------------------------------------------------------------
-- UNITS
-- -----------------------------------------------------------------------------
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  unit_number text not null,
  bedrooms int not null,
  bathrooms int not null,
  parking int not null,
  size_sqm numeric not null,
  price numeric not null,
  original_price numeric,
  status text not null,
  unit_type text not null,
  image_url text,
  image_url_2 text,
  image_url_3 text,
  floorplan_url text,
  floor text,
  direction text,
  viewers jsonb not null default '{}'::jsonb,
  lock_expires_at timestamptz,
  locked_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint units_status_check check (
    status in ('Available', 'Reserved', 'Sold', 'Held by Developer')
  )
);

comment on table public.units is 'Property units for listing; lock fields for reservation flow.';
comment on column public.units.viewers is 'Session id -> last heartbeat ms (server routes prune stale entries).';

create unique index if not exists units_unit_number_key on public.units (unit_number);
create index if not exists units_status_idx on public.units (status);
create index if not exists units_lock_expires_at_idx on public.units (lock_expires_at)
  where lock_expires_at is not null;

alter table public.units enable row level security;

create policy "Anyone can read units"
  on public.units for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can update viewer and lock fields" on public.units;
create policy "Users can update viewer and lock fields"
  on public.units for update
  to authenticated
  using (true)
  with check (true);

-- Realtime: inventory updates
do $$
begin
  alter publication supabase_realtime add table public.units;
exception
  when duplicate_object then null;
end $$;

drop trigger if exists units_updated_at on public.units;
create trigger units_updated_at
  before update on public.units
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- WISHLISTS
-- -----------------------------------------------------------------------------
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  unit_id uuid not null references public.units (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, unit_id)
);

create index if not exists wishlists_user_id_idx on public.wishlists (user_id);
create index if not exists wishlists_unit_id_idx on public.wishlists (unit_id);

alter table public.wishlists enable row level security;

create policy "Users can view own wishlist"
  on public.wishlists for select
  using (auth.uid() = user_id);

create policy "Users can insert own wishlist"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own wishlist"
  on public.wishlists for delete
  using (auth.uid() = user_id);
