-- Growth Planner — Supabase schema
-- Run this in the Supabase dashboard → SQL Editor.
-- Safe to re-run: drops and recreates policies, creates tables if missing.

-- ── Tables ────────────────────────────────────────────────────────────────
-- IDs are client-generated text (the app creates them before persisting), so
-- optimistic local state and the database always agree on the same id.

create table if not exists public.goals (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  category    text not null,
  title       text not null,
  description text not null default '',
  why         text not null default '',
  status      text not null default 'active',
  kind        text not null default 'outcome',       -- 'outcome' (has a finish line) | 'ongoing'
  target_date text,                                  -- 'YYYY-MM-DD' soft deadline, outcome goals only
  achieved_at bigint,                                -- epoch ms, stamped when status flips to 'achieved'
  reflections jsonb not null default '[]'::jsonb,
  created_at  bigint not null,                       -- Date.now() from the client
  inserted_at timestamptz not null default now()
);

-- Backfill columns on databases created before these fields existed.
alter table public.goals add column if not exists kind        text not null default 'outcome';
alter table public.goals add column if not exists target_date text;
alter table public.goals add column if not exists achieved_at bigint;

create table if not exists public.resolutions (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  goal_id     text not null references public.goals (id) on delete cascade,
  type        text not null,                         -- 'monthly' | 'weekly' | 'anytime'
  title       text not null,
  done        boolean not null default false,        -- denormalised cache of "done in current period"
  completions jsonb not null default '[]'::jsonb,    -- [{ date:'YYYY-MM-DD', ts:epochMs }] completion log
  effort      text not null default 'medium',        -- 'light' | 'medium' | 'heavy' (Life Balance weight)
  retired     boolean not null default false,        -- hidden from active lists; completions kept for history
  created_at  bigint not null,
  inserted_at timestamptz not null default now()
);

-- Backfill columns on databases created before these fields existed.
alter table public.resolutions add column if not exists completions jsonb   not null default '[]'::jsonb;
alter table public.resolutions add column if not exists effort      text    not null default 'medium';
alter table public.resolutions add column if not exists retired     boolean not null default false;  -- retired keeps history but hides from active lists

-- Seed the completion log from already-completed resolutions, dating each to its
-- creation time (the only timestamp available) so history isn't fabricated.
update public.resolutions
set completions = jsonb_build_array(
  jsonb_build_object('date', to_char(to_timestamp(created_at / 1000.0), 'YYYY-MM-DD'), 'ts', created_at))
where done = true and completions = '[]'::jsonb;

create table if not exists public.reviews (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  type        text not null,                         -- 'monthly' | 'weekly'
  note        text not null,
  done        integer not null default 0,
  total       integer not null default 0,
  pct         integer not null default 0,
  date        text,                                  -- display string, e.g. "May 28, 2026"
  created_at  bigint not null,
  inserted_at timestamptz not null default now()
);

create index if not exists goals_user_idx       on public.goals (user_id);
create index if not exists resolutions_user_idx on public.resolutions (user_id);
create index if not exists resolutions_goal_idx on public.resolutions (goal_id);
create index if not exists reviews_user_idx      on public.reviews (user_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- The anon key is public (it ships in the browser bundle), so RLS is the real
-- security boundary. Each user can only touch their own rows.

alter table public.goals       enable row level security;
alter table public.resolutions enable row level security;
alter table public.reviews     enable row level security;

drop policy if exists "own goals"       on public.goals;
drop policy if exists "own resolutions" on public.resolutions;
drop policy if exists "own reviews"     on public.reviews;

create policy "own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own resolutions" on public.resolutions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own reviews" on public.reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
