# [TASK-001] Scaffold the Next.js + TypeScript + Tailwind project

- **Depends on:** none
- **PRD ref:** docs/tech-stack.md

## Goal

Create the base app skeleton so every later task has a working project to build in.
This is scaffolding only — no menu features yet.

## Context

Stack is defined in `docs/tech-stack.md`: Next.js (App Router) + TypeScript +
Tailwind CSS, tests via Vitest. Repo is currently empty except for docs and the AI
workflow files. Do NOT commit `node_modules`.

## Steps

1. Initialise a Next.js App Router app with TypeScript in the repo root.
2. Add and configure Tailwind CSS (mobile-first defaults).
3. Add Vitest with one trivial passing test to prove the runner works.
4. Add a `.gitignore` (node_modules, .next, .env*, etc.).
5. Add npm scripts: `dev`, `build`, `lint`, `test` (per `docs/tech-stack.md`).
6. Replace the default home page with a placeholder that renders the text
   "Miora QR — menu coming soon" and no horizontal scroll at 375px width.

## Acceptance

- [x] `npm install` succeeds.
- [x] `npm run build` passes.
- [x] `npm run lint` passes.
- [x] `npm test` passes (the trivial test runs green).
- [x] `npm run dev` serves the placeholder page; at 375px width there is no
      horizontal scroll.

*(All five re-verified by Claude on review, 2026-07-21.)*

## Out of scope

- Any menu data, categories, items, admin, auth, i18n, or QR generation.
- Supabase setup (a later task).

---
## Worker notes
- Scaffolded a Next.js 16 App Router project with TypeScript, Tailwind CSS 4,
  ESLint, and npm package metadata/lockfile.
- Replaced the generated home page with the required mobile-safe placeholder and
  added a trivial Vitest smoke test.
- Files added or changed: `.gitignore`, `eslint.config.mjs`, `next-env.d.ts`,
  `next.config.ts`, `package.json`, `package-lock.json`, `postcss.config.mjs`,
  `tsconfig.json`, `public/*`, `src/app/*`, and `tests/smoke.test.ts`.
- Verified `npm install`, `npm run build`, `npm run lint`, and `npm test` all
  succeed. Vitest ran 1 test and it passed.
- Verified the development page responds with HTTP 200 and renders the exact
  placeholder at a 375px browser viewport. The document and body scroll widths
  were both 375px, so there was no horizontal overflow; no console errors were
  reported.
- Note for follow-up: npm reported 2 moderate dependency audit findings and
  suggested a force/breaking remediation. No force upgrade was applied because
  dependency security remediation is outside this scaffold task.

## Blockers
<!-- If you had to stop, the exact question for Claude. -->
