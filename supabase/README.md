# Supabase setup (local)

## 1. Env (already done)

`.env` needs:
- `NEXT_PUBLIC_SUPABASE_URL` — Project URL without `/rest/v1/`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — publishable / anon key
- `SUPABASE_SERVICE_ROLE_KEY` — secret / service_role key

## 2. Create tables

Supabase Dashboard → **SQL Editor** → New query → paste and **Run** in order:

1. `supabase/migrations/001_menu.sql`
2. `supabase/migrations/002_admin.sql` (write policies + `menu-photos` storage bucket)

## 3. Upload menu data

```bash
npm run seed
```

## 4. Create the admin user

Supabase Dashboard → **Authentication** → **Users** → **Add user**

Create one email/password user for `/admin`.

## 5. Restart dev server

```bash
npm run dev
```

Open `/menu` for the guest menu. Open `/admin/login` for the admin panel.

Data loads from Supabase when tables are seeded. In development, an empty or unreachable DB falls back to local seed files. In production the guest menu fails closed unless `ALLOW_SEED_FALLBACK=true`. Admin always requires Supabase + a logged-in user.
