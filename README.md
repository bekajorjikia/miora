# Miora QR — Asian Restaurant Digital Menu

QR digital menu for MIORA: guests scan a table QR and browse a bilingual
(EN/KA) menu on their phone. Staff manage items and categories at `/admin`.

## Stack

- Next.js (App Router) + React + TypeScript + Tailwind
- Supabase (Postgres, Auth, Storage)
- Vitest

## Setup

1. Copy env and fill in values from your Supabase project:

```bash
cp .env.example .env
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Apply database migrations (Supabase Dashboard → SQL Editor), in order:

   1. `supabase/migrations/001_menu.sql`
   2. `supabase/migrations/002_admin.sql`

4. Seed the menu and create an admin user — see [`supabase/README.md`](supabase/README.md).

Without Supabase configured, **development** falls back to local seed data so
UI work can continue. **Production** fails closed unless `ALLOW_SEED_FALLBACK=true`.

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Local Next.js server |
| `npm run build` / `npm start` | Production build + serve |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |
| `npm run seed` | Upsert menu into Supabase (needs service role key) |

## Routes

| Path | Audience |
|------|----------|
| `/` | Guest welcome |
| `/menu` | Guest menu |
| `/admin/login` | Staff login |
| `/admin` | Staff overview + CRUD |

## Production checklist (short)

- [ ] Separate Supabase project for production; set env on the host (e.g. Vercel)
- [ ] Run both SQL migrations, then `npm run seed` (or import prod data)
- [ ] Create one admin user; disable open signup in Supabase Auth
- [ ] Confirm guest menu loads from Supabase (`source` is not seed)
- [ ] Smoke-test: admin edit → guest sees update; photo upload works
- [ ] Do **not** set `ALLOW_SEED_FALLBACK=true` on production unless emergency
