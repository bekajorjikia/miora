# Tech Stack

## Goals driving the choices

Mobile-first, fast first paint, simple to host, easy for AI workers to build in a
mainstream stack with lots of examples.

## Decided — in the repo as of TASK-001

| Concern   | Choice                       | Why |
|-----------|------------------------------|-----|
| Framework | Next.js 16 (App Router) + React | SSR/SSG for fast menu first paint; one codebase for diner + admin. |
| Language  | TypeScript                   | Type safety helps workers stay in bounds. |
| Styling   | Tailwind CSS 4               | Fast, consistent, mobile-first utilities. |
| Unit test | Vitest                       | Acceptance checks in task files run against it. |

These are settled — they're built and committed. Changing one now means a
migration, not a decision.

## Proposed — not yet built, still open

| Concern        | Proposal                        | Why |
|----------------|---------------------------------|-----|
| Data / backend | Supabase (Postgres + Auth + Storage) | Managed DB, staff auth, and photo storage in one; no custom server needed for v1. |
| i18n           | `next-intl` (UI) + per-language menu content | Separates UI strings from translatable menu data. |
| QR generation  | `qrcode` library, server-side   | Generate printable QR codes. |
| Hosting        | Vercel                          | First-class Next.js hosting; fast to ship. |
| E2E test       | Playwright (mobile viewport)    | Verifies the diner flow on a real phone-sized viewport. |

Confirm each of these before the task that introduces it — not before.

## Repo layout (proposed)

```
app/                 Next.js routes (diner menu + admin)
  (diner)/[slug]/    Public menu by restaurant slug
  admin/             Staff area (auth-gated)
components/          Reusable UI
lib/                 Data access, supabase client, i18n, qr
  db/                Schema, queries
messages/            UI translation JSON per language
public/
tests/               Vitest + Playwright
```

## Standard commands (referenced by task Acceptance sections)

```
npm run dev       # local dev
npm run build     # production build — must pass
npm run lint      # eslint
npm test          # vitest
npm run e2e       # playwright
```

## Decisions still open

- Supabase vs. an alternative (e.g. Postgres + a custom API) — decide before the
  data-layer task.
- Hosting (Vercel assumed) — decide before the first deploy task.
- Launch languages — decide before the i18n task.
- Photo hosting: upload + storage, or paste URLs in v1 — decide before the
  menu-item admin task.

Move each line up into the table above when it's settled.
