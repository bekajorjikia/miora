# PRD — Asian Restaurant QR Digital Menu

> Source of truth for scope. Only Claude edits this, with the human's sign-off.
> Status: **draft v0.1** — review and adjust before building.

## 1. Problem

Asian restaurants (dine-in) want to replace printed menus with a digital menu a
diner opens by scanning a QR code at the table. No app install, fast to load on a
phone, easy for staff to keep prices and availability current.

## 2. Users

- **Diner** — scans the table QR, browses the menu on their phone, no login.
- **Restaurant staff / owner** — manages menu items, prices, availability,
  translations, and prints QR codes.

## 3. Scope — v1 (MVP)

Diner side:
- Open menu via a per-restaurant (optionally per-table) QR link.
- Browse items grouped by category (e.g. Appetizers, Noodles, Rice, Drinks).
- Item detail: name, description, price, photo, tags (spicy, vegetarian, contains
  nuts, etc.).
- Fast, mobile-first, works on a mid-range phone over restaurant Wi-Fi/4G.
- Multi-language menu (at minimum English + one Asian language per restaurant),
  diner can switch language.
- Mark items sold-out / unavailable (hidden or greyed).

Admin side:
- Auth for staff.
- CRUD for categories and items (name, description, price, photo, tags,
  availability, translations).
- Generate & download printable QR codes for the restaurant / tables.

## 4. Explicitly NOT in v1

- Online ordering, cart, or payments.
- Table-side call-waiter / service requests.
- Reservations, loyalty, reviews.
- Multi-tenant billing / self-serve signup (assume manual onboarding at first).

These may become v2 — keep the data model open to them, but don't build them.

## 5. Key requirements

- **Mobile-first**: designed for ~375px width; must not require horizontal scroll.
- **Fast first paint**: menu should be usable within ~2s on 4G.
- **Reliable**: menu must render even if a photo fails to load.
- **i18n-ready**: item content is translatable; UI strings are translatable.
- **Accessible**: readable contrast, tap targets ≥44px, semantic markup.

## 6. Core data model (starting point — Claude refines in tasks)

- `Restaurant` — id, name, slug, default language, supported languages, theme.
- `Category` — id, restaurantId, name (per language), sort order.
- `MenuItem` — id, categoryId, name/description (per language), price, currency,
  photoUrl, tags[], available (bool), sort order.
- `Table` (optional) — id, restaurantId, label, qr target.
- `StaffUser` — id, restaurantId, email, role.

## 7. Success criteria for MVP

- A diner can scan → see a categorized, translated menu on a phone in under ~3s.
- Staff can add/edit an item and see it live without a redeploy.
- Staff can print a working QR code that opens the correct restaurant's menu.

## 8. Open questions (resolve before/while building)

- Hosting target? (Vercel / other)
- Which second language(s) to launch with?
- One restaurant to start, or multi-restaurant from day one?
- Photo hosting: upload + storage, or paste URLs in v1?
