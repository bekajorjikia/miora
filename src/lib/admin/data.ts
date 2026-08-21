import { cache } from "react";
import { headers } from "next/headers";
import type { User } from "@supabase/supabase-js";

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
import {
  ADMIN_RESTAURANT_ID,
  ADMIN_USER_EMAIL_HEADER,
  ADMIN_USER_ID_HEADER,
} from "@/lib/admin/constants";

type AdminSupabase = Awaited<ReturnType<typeof createSupabaseSessionClient>>;

/**
 * Auth for admin routes. Prefer middleware-verified identity headers to avoid a
 * second Auth API round-trip; fall back to getUser() (server actions / no middleware).
 */
export const requireAdminUser = cache(async (): Promise<{
  supabase: AdminSupabase;
  user: Pick<User, "id" | "email">;
}> => {
  const supabase = await createSupabaseSessionClient();
  const headerStore = await headers();
  const userId = headerStore.get(ADMIN_USER_ID_HEADER);

  if (userId) {
    return {
      supabase,
      user: {
        id: userId,
        email: headerStore.get(ADMIN_USER_EMAIL_HEADER) ?? undefined,
      },
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("არაავტორიზებული");
  }

  return { supabase, user };
});

/** Session client only — identity already enforced by middleware on page loads. */
export const getAdminClient = cache(async (): Promise<AdminSupabase> => {
  const { supabase } = await requireAdminUser();
  return supabase;
});

async function fetchCategories(supabase: AdminSupabase): Promise<Category[]> {
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

async function fetchItems(supabase: AdminSupabase): Promise<MenuItem[]> {
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
  const supabase = await getAdminClient();
  return fetchCategories(supabase);
});

/** All items — shared by getAdminMenuData within the same request. */
const getAdminItems = cache(async (): Promise<MenuItem[]> => {
  const supabase = await getAdminClient();
  return fetchItems(supabase);
});

/** Full menu blob — items list. Deduped per request. */
export const getAdminMenuData = cache(async (): Promise<{
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}> => {
  const supabase = await getAdminClient();

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

/** Dashboard stats without loading full menu item rows. */
export const getAdminDashboardStats = cache(async (): Promise<{
  restaurantName: string;
  categoryCount: number;
  itemCount: number;
  soldOutCount: number;
}> => {
  const supabase = await getAdminClient();

  const [restaurantResult, categoriesResult, itemsResult, soldOutResult] =
    await Promise.all([
      supabase
        .from("restaurants")
        .select("name")
        .eq("id", ADMIN_RESTAURANT_ID)
        .maybeSingle(),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", ADMIN_RESTAURANT_ID),
      supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", ADMIN_RESTAURANT_ID),
      supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", ADMIN_RESTAURANT_ID)
        .eq("available", false),
    ]);

  if (restaurantResult.error) {
    throw restaurantResult.error;
  }
  if (!restaurantResult.data) {
    throw new Error(
      `Restaurant "${ADMIN_RESTAURANT_ID}" not found. Run the seed script first.`,
    );
  }
  if (categoriesResult.error) {
    throw categoriesResult.error;
  }
  if (itemsResult.error) {
    throw itemsResult.error;
  }
  if (soldOutResult.error) {
    throw soldOutResult.error;
  }

  return {
    restaurantName: restaurantResult.data.name as string,
    categoryCount: categoriesResult.count ?? 0,
    itemCount: itemsResult.count ?? 0,
    soldOutCount: soldOutResult.count ?? 0,
  };
});

/** Lightweight per-category item counts (no full item rows). */
export const getAdminCategoryItemCounts = cache(
  async (): Promise<Record<string, number>> => {
    const supabase = await getAdminClient();
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
  const supabase = await getAdminClient();
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
    const supabase = await getAdminClient();
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
  const supabase = await getAdminClient();
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
  const supabase = await getAdminClient();
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
