import { config } from "dotenv";
import { resolve } from "node:path";

import {
  categories,
  menuItems,
  restaurant,
} from "../src/lib/seed-data";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} in .env`);
  }
  return value;
}

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
}

async function upsert(
  baseUrl: string,
  serviceRoleKey: string,
  table: string,
  rows: Record<string, unknown>[],
) {
  const response = await fetch(`${baseUrl}/rest/v1/${table}?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${table} upsert failed (${response.status}): ${body}\n` +
        "If the table is missing, run supabase/migrations/001_menu.sql in the Supabase SQL Editor first.",
    );
  }
}

async function main() {
  const baseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  console.log(`Seeding "${restaurant.name}" → ${baseUrl}`);

  await upsert(baseUrl, serviceRoleKey, "restaurants", [
    {
      id: restaurant.id,
      name: restaurant.name,
      default_language: restaurant.defaultLanguage,
      supported_languages: restaurant.supportedLanguages,
      currency: restaurant.currency,
    },
  ]);
  console.log("  restaurants: ok");

  await upsert(
    baseUrl,
    serviceRoleKey,
    "categories",
    categories.map((category) => ({
      id: category.id,
      restaurant_id: category.restaurantId,
      name: category.name,
      sort_order: category.sortOrder,
    })),
  );
  console.log(`  categories: ${categories.length}`);

  const itemRows = menuItems.map((item) => ({
    id: item.id,
    restaurant_id: item.restaurantId,
    category_id: item.categoryId,
    name: item.name,
    description: item.description,
    price_minor: item.priceMinor ?? null,
    photo_url: item.photoUrl ?? null,
    tags: item.tags,
    available: item.available,
    sort_order: item.sortOrder,
  }));

  let written = 0;
  for (const group of chunk(itemRows, 100)) {
    await upsert(baseUrl, serviceRoleKey, "menu_items", group);
    written += group.length;
  }
  console.log(`  menu_items: ${written}`);
  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
