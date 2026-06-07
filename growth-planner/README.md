# Ikigai Compass (Growth Planner)

A personal goal & resolution tracker. React + Vite frontend, Supabase (Postgres
+ Auth) for storage, and a small serverless `/api/coach` function for the AI coach.

## Setup

1. Install deps: `pnpm install`
2. Copy `.env.example` to `.env.local` and fill in:
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — client (browser) values.
   - `ANTHROPIC_API_KEY` — server-only, used by `/api/coach`. No `VITE_` prefix.
3. Create the database schema (see below).
4. Run: `pnpm dev`

## Database schema — IMPORTANT

⚠️ **Create the tables ONLY by running `supabase/schema.sql`** in the Supabase
Dashboard → SQL Editor. Do **not** create or edit the `goals` / `resolutions` /
`reviews` tables through the dashboard's Table Editor UI.

Why this matters: the app stores `created_at` as a `bigint` (epoch
milliseconds, from `Date.now()`). If a table is created through the dashboard UI,
`created_at` defaults to a `timestamp` column instead — and every write then
fails with Postgres error `22008` *"date/time field value out of range"*. Because
writes are optimistic, the UI looks fine until you refresh, at which point all
data is "gone" (it was never persisted). `schema.sql` is the single source of
truth for column types; keep the live database in sync with it.

To reset/recreate from scratch (this drops existing rows):

```sql
drop table if exists public.resolutions cascade;
drop table if exists public.reviews     cascade;
drop table if exists public.goals       cascade;
-- then paste and run the contents of supabase/schema.sql
```

## Build

`pnpm build` → output in `dist/`.
