import { restaurant as seedRestaurant } from "@/lib/seed-data";
import type { Tag } from "@/lib/types";

export const ADMIN_RESTAURANT_ID = seedRestaurant.id;
export const MENU_PHOTOS_BUCKET = "menu-photos";

export const ALL_TAGS: Tag[] = [
  "spicy",
  "vegetarian",
  "vegan",
  "contains-nuts",
  "gluten-free",
];

export const TAG_LABELS: Record<Tag, string> = {
  spicy: "Spicy",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "contains-nuts": "Contains nuts",
  "gluten-free": "Gluten free",
};
