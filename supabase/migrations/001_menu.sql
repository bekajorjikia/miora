-- Run once in Supabase Dashboard → SQL Editor → New query → Run

create table if not exists restaurants (
  id text primary key,
  name text not null,
  default_language text not null default 'en',
  supported_languages text[] not null default '{en,ka}',
  currency text not null default 'GEL'
);

create table if not exists categories (
  id text primary key,
  restaurant_id text not null references restaurants (id) on delete cascade,
  name jsonb not null,
  sort_order int not null default 0
);

create table if not exists menu_items (
  id text primary key,
  restaurant_id text not null references restaurants (id) on delete cascade,
  category_id text not null references categories (id) on delete cascade,
  name jsonb not null,
  description jsonb not null default '{}'::jsonb,
  price_minor int,
  photo_url text,
  tags text[] not null default '{}',
  available boolean not null default true,
  sort_order int not null default 0
);

create index if not exists categories_restaurant_sort_idx
  on categories (restaurant_id, sort_order);

create index if not exists menu_items_category_sort_idx
  on menu_items (category_id, sort_order);

create index if not exists menu_items_restaurant_idx
  on menu_items (restaurant_id);

alter table restaurants enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;

drop policy if exists "public read restaurants" on restaurants;
drop policy if exists "public read categories" on categories;
drop policy if exists "public read menu_items" on menu_items;

create policy "public read restaurants"
  on restaurants for select using (true);

create policy "public read categories"
  on categories for select using (true);

create policy "public read menu_items"
  on menu_items for select using (true);
