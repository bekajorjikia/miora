# [TASK-002] Domain types, seed data, and the diner menu page

- **Depends on:** TASK-001
- **PRD ref:** docs/PRD.md §3 (Scope), §5 (Key requirements), §6 (Tenancy), §7 (Data model)
- **Design ref:** https://claude.ai/code/artifact/baba4968-3a11-47de-bda0-4dd9173a3096

## Goal

Render the diner-facing menu — categories with items, optional prices, tags, and
photos — from a typed local seed fixture. No database yet: this task defines the
shape the data layer will later have to satisfy, and ships a real, viewable menu.

## Context

The repo is a Next.js 16 App Router app (TypeScript, Tailwind 4, Vitest) from
TASK-001. `src/app/page.tsx` is currently a placeholder that must be replaced.

Decisions already made — do not revisit:

- **Single restaurant** (PRD §6). No `/[slug]` routing; the menu lives at `/`.
  But every entity still carries `restaurantId`, so multi-tenancy later isn't a
  rewrite.
- **Photos are pasted external URLs** (PRD §9). No upload, no storage.
  Consequently a photo **can** be broken or missing, and the item must still
  render correctly. This is a hard requirement, not a nicety.
- **No backend in this task.** Supabase is not confirmed and must not be added.

### Types — create `src/lib/types.ts`

```ts
export type LanguageCode = string;              // e.g. "en", "th"
export type Localized = Record<LanguageCode, string>;  // { en: "Pad Thai", th: "..." }

export type Tag = "spicy" | "vegetarian" | "vegan" | "contains-nuts" | "gluten-free";

export interface Restaurant {
  id: string;
  name: string;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  currency: string;                 // ISO 4217, e.g. "GEL"
}

export interface Category {
  id: string;
  restaurantId: string;
  name: Localized;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: Localized;
  description: Localized;
  priceMinor?: number;              // optional integer minor units (e.g. 1250 = 12.50)
  photoUrl?: string;                // external URL; may be absent or broken
  tags: Tag[];
  available: boolean;
  sortOrder: number;
}
```

**Prices are optional integers in minor units.** Never use floats for money.
Formatting to a display string happens at render time via `Intl.NumberFormat`.
When `priceMinor` is absent, render no price UI at all — no zero, dash, placeholder,
or reserved price space. A numeric value of `0` is still a present price.

`Localized` is a per-language map. Seed every field in English (`en`) and Georgian
(`ka`), matching the approved design and launch requirement. Do NOT build a
language switcher here; render `restaurant.defaultLanguage` only.

## Steps

1. Create `src/lib/types.ts` exactly as above.
2. Create `src/lib/seed-data.ts` exporting one `Restaurant`, at least **4
   categories**, and at least **12 items** spread across them. Make it realistic
   Asian-restaurant content (e.g. Appetizers / Noodles & Rice / Curries / Drinks).
   It must include, to exercise the edge cases:
   - at least one item with `available: false`
   - **at least one category where every item is `available: false`** (see the
     visibility rule in step 6)
   - at least one item with **no** `photoUrl`
   - at least one item with a `photoUrl` that will not load (use
     `https://example.invalid/missing.jpg`)
   - **at least two items with a photo that loads successfully.** Put these image
     files in `public/seed/` and reference them as `/seed/<name>.jpg` — seed
     rendering must be deterministic and work offline. (The `photoUrl` type still
     accepts arbitrary external URLs; that's just not what the fixture relies on.)
   - at least one item with multiple tags, and one with none
   - at least one item with no `priceMinor`, plus priced items to exercise both
     price states
   - **English (`en`) and Georgian (`ka`)** populated in every `Localized` field
3. Create `src/lib/menu.ts` with pure, testable helpers:
   - `getLocalized(value: Localized, lang: LanguageCode, fallback: LanguageCode): string`
     — returns the requested language; falls back to `fallback` if the requested
     one is missing or empty; returns `""` if both are missing. Never throws.
   - `formatPrice(priceMinor: number, currency: string, locale: string): string`
     — uses `Intl.NumberFormat`; `1250` + `"GEL"` renders as a proper currency
     string. Pass `restaurant.defaultLanguage` as `locale` at the call site.
   - `groupItemsByCategory(categories, items)` with this **exact** return type:

     ```ts
     Array<{ category: Category; items: MenuItem[] }>
     ```

     Categories come back in `sortOrder`, each with its items in `sortOrder`.
     **Omit a category only if it has no items at all.** A category whose items
     are all unavailable still appears — see step 6.
4. Build components under `src/components/`:
   - `MenuItemCard.tsx` — name, description, formatted price when present, tags,
     and photo. If `priceMinor` is absent, omit the price element entirely.
   - `CategorySection.tsx` — a category heading plus its items.
   - `MenuView.tsx` — the whole menu, composing the above.
5. Replace `src/app/page.tsx` to render `MenuView` from the seed data. Also update
   the page metadata in `src/app/layout.tsx` — it still carries the default
   "Create Next App" title/description. Use the restaurant name and a short menu
   description.
6. Handle the required states:
   - **Sold out**: items with `available: false` render visibly greyed/dimmed with
     a "Sold out" label. They are NOT hidden — at item level or category level.
     A category whose items are *all* sold out still renders, with all its items
     dimmed. (Rationale: "we serve curries, they're gone tonight" is useful to a
     diner, and it's the only rule consistent with never hiding sold-out items.)
   - **Missing/broken photo**: the card renders the MIORA wordmark as a neutral
     placeholder and keeps its layout. No broken-image icon and no layout shift.
   - **Alt text**: a photo that loads uses the item's localized name as its `alt`.
     The placeholder is decorative — give it `alt=""` (or `aria-hidden`) rather
     than alt text describing a missing image.
7. Write tests in `tests/menu.test.ts` covering the helpers from step 3.

## Design constraints

- Follow the supplied MIORA design system for this task's menu screen: warm
  off-white base, warm-gray surfaces, charcoal text, restrained wasabi accent,
  editorial serif headings, clean sans-serif UI text, and soft food-image depth.
  Search, filters, dish detail, welcome screen, and language switching shown in
  the artifact remain out of scope.
- **Mobile-first, ~375px.** No horizontal scroll at any width from 320px up.
- Tap targets ≥44px; text contrast readable (PRD §5, Accessible).
- Semantic markup: real headings for categories, a list for items — not a pile of
  `div`s.
- Use `next/image` only if you configure `remotePatterns` for arbitrary external
  URLs; otherwise a plain `<img>` with an `onError` fallback is fine and
  preferred here. Do not add unconfigured `next/image` remote loading — it will
  throw at runtime.

## Acceptance

- [x] `npm run build` passes
- [x] `npm run lint` passes
- [x] `npm test` passes, including new tests for the step-3 helpers. These cases
      must each be asserted:
      - `getLocalized` returns the requested language; falls back when it's
        missing; returns `""` when both requested and fallback are missing
      - `formatPrice(1250, "GEL", …)` renders the correct currency string
      - `groupItemsByCategory` returns categories in `sortOrder`, items within
        each in `sortOrder`, **keeps** a category whose items are all
        unavailable, and **omits** a category with no items at all
- [x] `npm run dev` at `/` shows all seeded categories with their items
- [x] At 375px width there is **no horizontal scroll**
- [x] The unavailable item is visible, dimmed, and labelled "Sold out"
- [x] The all-unavailable category still appears, with every item dimmed
- [x] The item with no photo and the item with the broken photo URL both render
      with the MIORA wordmark placeholder, correct layout, and no visible
      broken-image icon
- [x] The items with working photos display them, with the item name as `alt`
- [x] An item without `priceMinor` renders no price element or price placeholder;
      priced items render a correctly formatted price
- [x] The browser tab title is the restaurant name, not "Create Next App"
- [x] **No uncaught application errors in the browser console.** The failed
      network request for the intentionally broken image URL is expected and
      allowed — it is not a failure of this check.

## Out of scope

- Any database, Supabase, or API layer — seed data only.
- Language switcher UI (types support it; rendering one language is enough here).
- Admin, auth, QR generation, ordering, cart.
- Photo upload or storage.

---
## Worker notes
- Added the requested optional-price contract (`priceMinor?: number`): cards omit
  the price element entirely when no price exists and still render numeric zero
  correctly if supplied.
- Added typed English/Georgian seed content for one restaurant, 4 categories, and
  12 items, including a no-price item, missing and broken photos, multiple/no-tag
  cases, and a 3-item all-sold-out category.
- Implemented localized-value, currency-formatting, and sorted-grouping helpers;
  added Vitest alias configuration and 7 focused helper tests (8 total including
  the scaffold smoke test).
- Built `MenuView`, semantic category sections, and resilient item cards following
  the supplied MIORA design system. Missing/failed images use the MIORA wordmark;
  four optimized local dish photos exercise successful image loading.
- Files added or changed: `src/lib/*`, `src/components/*`, `src/app/page.tsx`,
  `src/app/layout.tsx`, `src/app/globals.css`, `tests/menu.test.ts`,
  `vitest.config.ts`, `public/seed/*`, and this task file.
- Verified `npm run build`, `npm run lint`, and `npm test` pass. Vitest reports 2
  files and 8 passing tests.
- Browser-verified at 375px: document/body widths were both 375px, all 4
  categories and 12 items rendered, all 3 dessert items were visibly sold out,
  the unpriced Edamame had no price element, the broken photo resolved to the
  MIORA fallback, the title was `MIORA`, and no console errors were reported.
  Also verified 320px document/body widths were both 320px with no overflow.
- Follow-up for Claude: PRD §3 still says English plus an Asian language. The
  human explicitly selected English and Georgian for this implementation, so the
  PRD wording should be reconciled separately by its owner.

## Blockers
<!-- If you had to stop: the exact question/problem for Claude to resolve. -->
