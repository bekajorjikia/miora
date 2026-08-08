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

function useSeedOrFail(reason: string, cause?: unknown): MenuData {
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

export async function getMenuData(): Promise<MenuData> {
  if (!hasSupabasePublicConfig()) {
    return useSeedOrFail("Supabase public env is not configured.");
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
      return useSeedOrFail("Supabase menu is empty or restaurant is missing.");
    }

    return {
      restaurant: mapRestaurant(restaurantResult.data as RestaurantRow),
      categories: (categoriesResult.data as CategoryRow[]).map(mapCategory),
      items: (itemsResult.data as MenuItemRow[]).map(mapMenuItem),
      source: "supabase",
    };
  } catch (error) {
    return useSeedOrFail("Failed to load menu from Supabase.", error);
  }
}

export async function getRestaurant(): Promise<Restaurant> {
  const { restaurant } = await getMenuData();
  return restaurant;
}
