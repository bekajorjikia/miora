# [TASK-002] Domain types, seed data, and the diner menu page

- **Depends on:** TASK-001
- **PRD ref:** docs/PRD.md §3 (Scope), §5 (Key requirements), §6 (Tenancy), §7 (Data model)

## Goal

Render the diner-facing menu — categories with items, prices, tags, and photos —
from a typed local seed fixture. No database yet: this task defines the shape the
data layer will later have to satisfy, and ships a real, viewable menu.

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
  priceMinor: number;               // integer minor units (e.g. 1250 = 12.50)
  photoUrl?: string;                // external URL; may be absent or broken
  tags: Tag[];
  available: boolean;
  sortOrder: number;
}
```

**Prices are integers in minor units.** Never use floats for money. Formatting to
a display string happens at render time via `Intl.NumberFormat`.

`Localized` is a per-language map even though only one language renders in this
task — this is so adding a second language later isn't a data migration. Do NOT
build a language switcher here; render `restaurant.defaultLanguage` only.

## Steps

1. Create `src/lib/types.ts` exactly as above.
2. Create `src/lib/seed-data.ts` exporting one `Restaurant`, at least **4
   categories**, and at least **12 items** spread across them. Make it realistic
   Asian-restaurant content (e.g. Appetizers / Noodles & Rice / Curries / Drinks).
   It must include, to exercise the edge cases:
   - at least one item with `available: false`
   - at least one item with **no** `photoUrl`
   - at least one item with a `photoUrl` that will not load (use
     `https://example.invalid/missing.jpg`)
   - at least one item with multiple tags, and one with none
   - `en` plus one other language populated in every `Localized` field
3. Create `src/lib/menu.ts` with pure, testable helpers:
   - `getLocalized(value: Localized, lang: LanguageCode, fallback: LanguageCode): string`
     — returns the requested language, falling back if missing, and never throws.
   - `formatPrice(priceMinor: number, currency: string, locale: string): string`
     — uses `Intl.NumberFormat`; `1250` + `"GEL"` renders as a proper currency
     string.
   - `groupItemsByCategory(categories, items)` — returns categories in
     `sortOrder`, each with its items in `sortOrder`. Categories with no available
     items are omitted entirely.
4. Build components under `src/components/`:
   - `MenuItemCard.tsx` — name, description, formatted price, tags, photo.
   - `CategorySection.tsx` — a category heading plus its items.
   - `MenuView.tsx` — the whole menu, composing the above.
5. Replace `src/app/page.tsx` to render `MenuView` from the seed data.
6. Handle the required states:
   - **Sold out**: items with `available: false` render visibly greyed/dimmed with
     a "Sold out" label. They are NOT hidden.
   - **Missing/broken photo**: the card renders a neutral placeholder and keeps
     its layout. No broken-image icon, no layout shift, no console error crash.
7. Write tests in `tests/menu.test.ts` covering the helpers from step 3.

## Design constraints

- **Mobile-first, ~375px.** No horizontal scroll at any width from 320px up.
- Tap targets ≥44px; text contrast readable (PRD §5, Accessible).
- Semantic markup: real headings for categories, a list for items — not a pile of
  `div`s.
- Use `next/image` only if you configure `remotePatterns` for arbitrary external
  URLs; otherwise a plain `<img>` with an `onError` fallback is fine and
  preferred here. Do not add unconfigured `next/image` remote loading — it will
  throw at runtime.

## Acceptance

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes, including new tests for `getLocalized`, `formatPrice`,
      and `groupItemsByCategory` (grouping, sort order, and omission of
      empty categories are each asserted)
- [ ] `npm run dev` at `/` shows all seeded categories with their items
- [ ] At 375px width there is **no horizontal scroll**
- [ ] The unavailable item is visible, dimmed, and labelled "Sold out"
- [ ] The item with no photo and the item with the broken photo URL both render
      with a placeholder, correct layout, and no visible broken-image icon
- [ ] No errors in the browser console

## Out of scope

- Any database, Supabase, or API layer — seed data only.
- Language switcher UI (types support it; rendering one language is enough here).
- Admin, auth, QR generation, ordering, cart.
- Photo upload or storage.

---
## Worker notes
<!-- Filled by the worker: what changed, files touched, how you verified. -->

## Blockers
<!-- If you had to stop: the exact question/problem for Claude to resolve. -->
