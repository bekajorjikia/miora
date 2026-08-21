import { cache } from "react";

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

/** One auth check per request (pages often call this alongside data loaders). */
export const requireAdminUser = cache(async () => {
  const supabase = await createSupabaseSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("არაავტორიზებული");
  }

  return { supabase, user };
});

async function fetchCategories(
  supabase: Awaited<ReturnType<typeof requireAdminUser>>["supabase"],
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as CategoryRow[]).map(mapCategory);
}

async function fetchItems(
  supabase: Awaited<ReturnType<typeof requireAdminUser>>["supabase"],
): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as MenuItemRow[]).map(mapMenuItem);
}

/** Categories only — new/edit item forms, category reorder helpers. */
export const getAdminCategories = cache(async (): Promise<Category[]> => {
  const { supabase } = await requireAdminUser();
  return fetchCategories(supabase);
});

/** All items — shared by getAdminMenuData within the same request. */
const getAdminItems = cache(async (): Promise<MenuItem[]> => {
  const { supabase } = await requireAdminUser();
  return fetchItems(supabase);
});

/** Full menu blob — dashboard / items list. Deduped per request. */
export const getAdminMenuData = cache(async (): Promise<{
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}> => {
  const { supabase } = await requireAdminUser();

  const [restaurantResult, categories, items] = await Promise.all([
    supabase
      .from("restaurants")
      .select("*")
      .eq("id", ADMIN_RESTAURANT_ID)
      .maybeSingle(),
    getAdminCategories(),
    getAdminItems(),
  ]);

  if (restaurantResult.error) {
    throw restaurantResult.error;
  }
  if (!restaurantResult.data) {
    throw new Error(
      `Restaurant "${ADMIN_RESTAURANT_ID}" not found. Run the seed script first.`,
    );
  }

  return {
    restaurant: mapRestaurant(restaurantResult.data as RestaurantRow),
    categories,
    items,
  };
});

/** Lightweight per-category item counts (no full item rows). */
export const getAdminCategoryItemCounts = cache(
  async (): Promise<Record<string, number>> => {
    const { supabase } = await requireAdminUser();
    const { data, error } = await supabase
      .from("menu_items")
      .select("category_id")
      .eq("restaurant_id", ADMIN_RESTAURANT_ID);

    if (error) {
      throw error;
    }

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const categoryId = row.category_id as string;
      counts[categoryId] = (counts[categoryId] ?? 0) + 1;
    }
    return counts;
  },
);

export const getAdminItem = cache(async (id: string): Promise<MenuItem | null> => {
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
});

export const getAdminCategory = cache(
  async (id: string): Promise<Category | null> => {
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
  },
);

/** Next sort_order for a new category (one row, not full list). */
export async function getNextCategorySortOrder(): Promise<number> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase
    .from("categories")
    .select("sort_order")
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  return (data?.[0]?.sort_order ?? 0) + 1;
}

/** Items in one category for reorder — avoids loading the whole menu. */
export async function getAdminItemsInCategory(
  categoryId: string,
): Promise<Pick<MenuItem, "id" | "sortOrder" | "categoryId">[]> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, sort_order, category_id")
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    sortOrder: row.sort_order as number,
    categoryId: row.category_id as string,
  }));
}
