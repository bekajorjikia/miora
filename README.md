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

### Caching

The guest menu is read from Supabase once and cached until it changes: every
admin write drops the cache by tag. There is no timed refresh, so an untouched
menu costs no database reads at all. A change made outside the admin panel (SQL
editor, `npm run seed`) is the exception — save anything in the admin panel, or
deploy, to pick it up.

Dish photos go through `next/image`, so the host fetches each one from Supabase
Storage about once a month and serves resized copies from its own CDN.

### Offline fallback (emergency)

`src/lib/seed-data.ts` is generated — it mirrors the live menu, prices, photo
URLs and availability included. Refresh it from a Supabase export (the query is
documented at the top of the script):

```bash
npx tsx scripts/generate-seed.ts path/to/export.json
```

If Supabase is unreachable (quota, outage), the mirror can be served to guests
in two ways: set `ALLOW_SEED_FALLBACK=true` on the host, or — when the hosting
dashboard itself is out of reach — flip `forceSeedFallback` in
[`src/lib/menu-fallback.ts`](src/lib/menu-fallback.ts) and push; the deploy
carries the switch. Photos still come from Supabase Storage, so they
fall back to the logo placeholder while it is down, and the admin panel stays
unavailable. Turn the switch (and the flag) off as soon as Supabase is back, or a future
outage will quietly serve a stale menu.

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Local Next.js server |
| `npm run build` / `npm start` | Production build + serve |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |
| `npm run seed` | Upsert menu into Supabase (needs service role key) |
| `npx tsx scripts/generate-seed.ts <export.json>` | Regenerate the offline seed mirror |

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
- [ ] Do **not** set `ALLOW_SEED_FALLBACK=true` (or `forceSeedFallback`) on production unless emergency
