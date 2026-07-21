# Tech Stack — proposal

> **This is a proposal, not a decision.** Adjust it with the human before workers
> start building. Once agreed, it's source of truth (Claude owns edits).

## Goals driving the choices

Mobile-first, fast first paint, simple to host, easy for AI workers to build in a
mainstream stack with lots of examples.

## Proposed stack

| Concern        | Choice                          | Why |
|----------------|---------------------------------|-----|
| Framework      | Next.js (App Router) + React    | SSR/SSG for fast menu first paint; one codebase for diner + admin; huge ecosystem. |
| Language       | TypeScript                      | Type safety helps workers stay in bounds. |
| Styling        | Tailwind CSS                    | Fast, consistent, mobile-first utilities. |
| Data / backend | Supabase (Postgres + Auth + Storage) | Managed DB, staff auth, and photo storage in one; no custom server needed for v1. |
| i18n           | `next-intl` (UI) + per-language columns/JSON for menu content | Separates UI strings from translatable menu data. |
| QR generation  | `qrcode` library, server-side   | Generate printable QR codes for restaurant/tables. |
| Hosting        | Vercel                          | First-class Next.js hosting; fast to ship. |
| Testing        | Vitest (unit) + Playwright (e2e mobile viewport) | Acceptance checks in task files can run these. |

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

- Confirm Supabase vs. an alternative (e.g. Postgres + custom API).
- Confirm hosting (Vercel).
- Confirm launch languages.

Once these are settled, remove this section and the "proposal" banner.
