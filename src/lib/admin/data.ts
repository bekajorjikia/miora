import {
  mapCategory,
  mapMenuItem,
  mapRestaurant,
  type CategoryRow,
  type MenuItemRow,
  type RestaurantRow,
} from "@/lib/supabase/mappers";
import { createSupabaseSessionClient } from "@/lib/supabase/session";
import type { Category, MenuItem, Restaurant } from "@/lib/types";
import { ADMIN_RESTAURANT_ID } from "@/lib/admin/constants";

export async function requireAdminUser() {
  const supabase = await createSupabaseSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

export async function getAdminMenuData(): Promise<{
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}> {
  const { supabase } = await requireAdminUser();

  const [restaurantResult, categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from("restaurants")
      .select("*")
      .eq("id", ADMIN_RESTAURANT_ID)
      .maybeSingle(),
    supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", ADMIN_RESTAURANT_ID)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", ADMIN_RESTAURANT_ID)
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
  if (!restaurantResult.data) {
    throw new Error(
      `Restaurant "${ADMIN_RESTAURANT_ID}" not found. Run the seed script first.`,
    );
  }

  return {
    restaurant: mapRestaurant(restaurantResult.data as RestaurantRow),
    categories: (categoriesResult.data as CategoryRow[]).map(mapCategory),
    items: (itemsResult.data as MenuItemRow[]).map(mapMenuItem),
  };
}

export async function getAdminItem(id: string): Promise<MenuItem | null> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return mapMenuItem(data as MenuItemRow);
}

export async function getAdminCategory(id: string): Promise<Category | null> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return mapCategory(data as CategoryRow);
}
