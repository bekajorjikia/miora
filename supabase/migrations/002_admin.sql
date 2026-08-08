-- Admin write access + menu photo storage
-- Run in Supabase Dashboard → SQL Editor after 001_menu.sql

-- Authenticated staff can manage menu data (single-admin setup).
drop policy if exists "authenticated manage restaurants" on restaurants;
drop policy if exists "authenticated manage categories" on categories;
drop policy if exists "authenticated manage menu_items" on menu_items;

create policy "authenticated manage restaurants"
  on restaurants for all to authenticated
  using (true)
  with check (true);

create policy "authenticated manage categories"
  on categories for all to authenticated
  using (true)
  with check (true);

create policy "authenticated manage menu_items"
  on menu_items for all to authenticated
  using (true)
  with check (true);

-- Public bucket for dish photos (guest menu reads via public URL).
insert into storage.buckets (id, name, public)
values ('menu-photos', 'menu-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read menu photos" on storage.objects;
drop policy if exists "authenticated upload menu photos" on storage.objects;
drop policy if exists "authenticated update menu photos" on storage.objects;
drop policy if exists "authenticated delete menu photos" on storage.objects;

create policy "public read menu photos"
  on storage.objects for select
  using (bucket_id = 'menu-photos');

create policy "authenticated upload menu photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'menu-photos');

create policy "authenticated update menu photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'menu-photos')
  with check (bucket_id = 'menu-photos');

create policy "authenticated delete menu photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'menu-photos');
