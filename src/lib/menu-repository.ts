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

export async function getMenuData(): Promise<MenuData> {
  if (!hasSupabasePublicConfig()) {
    return seedMenuData();
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
      return seedMenuData();
    }

    return {
      restaurant: mapRestaurant(restaurantResult.data as RestaurantRow),
      categories: (categoriesResult.data as CategoryRow[]).map(mapCategory),
      items: (itemsResult.data as MenuItemRow[]).map(mapMenuItem),
      source: "supabase",
    };
  } catch (error) {
    console.error("Failed to load menu from Supabase, using seed data.", error);
    return seedMenuData();
  }
}

export async function getRestaurant(): Promise<Restaurant> {
  const { restaurant } = await getMenuData();
  return restaurant;
}
