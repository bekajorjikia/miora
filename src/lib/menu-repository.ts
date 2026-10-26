import { unstable_cache } from "next/cache";

import { forceSeedFallback } from "@/lib/menu-fallback";
import {
  categories as seedCategories,
  menuItems as seedMenuItems,
  restaurant as seedRestaurant,
} from "@/lib/seed-data";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";
import {
  mapCategory,
  mapMenuItem,
  mapRestaurant,
  type CategoryRow,
  type MenuItemRow,
  type RestaurantRow,
} from "@/lib/supabase/mappers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, MenuItem, Restaurant } from "@/lib/types";

export interface MenuData {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  source: "supabase" | "seed";
}

function seedMenuData(): MenuData {
  return {
    restaurant: seedRestaurant,
    categories: seedCategories,
    items: seedMenuItems,
    source: "seed",
  };
}

function allowSeedFallback(): boolean {
  if (forceSeedFallback) {
    return true;
  }
  if (process.env.ALLOW_SEED_FALLBACK === "true") {
    return true;
  }
  return process.env.NODE_ENV !== "production";
}

function failClosed(reason: string, cause?: unknown): never {
  const message = `Menu unavailable: ${reason}`;
  if (cause !== undefined) {
    console.error(message, cause);
  } else {
    console.error(message);
  }
  throw new Error(message);
}

function seedOrFail(reason: string, cause?: unknown): MenuData {
  if (allowSeedFallback()) {
    if (cause !== undefined) {
      console.error(`${reason} Falling back to local seed data.`, cause);
    } else {
      console.warn(`${reason} Falling back to local seed data.`);
    }
    return seedMenuData();
  }
  failClosed(reason, cause);
}

/** Uncached read, straight from Supabase. Exported for tests. */
export async function fetchMenuData(): Promise<MenuData> {
  if (!hasSupabasePublicConfig()) {
    return seedOrFail("Supabase public env is not configured.");
  }

  try {
    const supabase = createSupabaseServerClient();

    const [restaurantResult, categoriesResult, itemsResult] = await Promise.all([
      supabase.from("restaurants").select("*").eq("id", seedRestaurant.id).maybeSingle(),
      supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", seedRestaurant.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", seedRestaurant.id)
        .order("sort_order", { ascending: true }),
    ]);

    if (restaurantResult.error) {
      throw restaurantResult.error;
    }
    if (categoriesResult.error) {
      throw categoriesResult.error;
    }
    if (itemsResult.error) {
      throw itemsResult.error;
    }

    if (!restaurantResult.data || !categoriesResult.data?.length) {
      return seedOrFail("Supabase menu is empty or restaurant is missing.");
    }

    return {
      restaurant: mapRestaurant(restaurantResult.data as RestaurantRow),
      categories: (categoriesResult.data as CategoryRow[]).map(mapCategory),
      items: (itemsResult.data as MenuItemRow[]).map(mapMenuItem),
      source: "supabase",
    };
  } catch (error) {
    return seedOrFail("Failed to load menu from Supabase.", error);
  }
}

/** Admin writes call revalidateTag with this so guests see edits at once. */
export const MENU_CACHE_TAG = "menu";

/**
 * Guests all read the same menu, so one Supabase read serves everyone for a
 * while. Keeps the free-tier egress budget for photos instead of row fetches.
 */
const loadMenuData = unstable_cache(fetchMenuData, ["menu-data"], {
  revalidate: 600,
  tags: [MENU_CACHE_TAG],
});

export async function getMenuData(): Promise<MenuData> {
  return loadMenuData();
}

export async function getRestaurant(): Promise<Restaurant> {
  const { restaurant } = await getMenuData();
  return restaurant;
}
