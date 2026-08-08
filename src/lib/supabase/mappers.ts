import type { Category, MenuItem, Restaurant } from "@/lib/types";

interface RestaurantRow {
  id: string;
  name: string;
  default_language: string;
  supported_languages: string[];
  currency: string;
}

interface CategoryRow {
  id: string;
  restaurant_id: string;
  name: Record<string, string>;
  sort_order: number;
}

interface MenuItemRow {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  price_minor: number | null;
  photo_url: string | null;
  tags: string[] | null;
  available: boolean;
  sort_order: number;
}

export function mapRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    name: row.name,
    defaultLanguage: row.default_language,
    supportedLanguages: row.supported_languages,
    currency: row.currency,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    sortOrder: row.sort_order,
  };
}

export function mapMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description ?? {},
    tags: (row.tags ?? []) as MenuItem["tags"],
    available: row.available,
    sortOrder: row.sort_order,
    ...(row.price_minor !== null ? { priceMinor: row.price_minor } : {}),
    ...(row.photo_url ? { photoUrl: row.photo_url } : {}),
  };
}

export type { RestaurantRow, CategoryRow, MenuItemRow };
