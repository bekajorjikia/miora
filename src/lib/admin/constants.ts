import { restaurant as seedRestaurant } from "@/lib/seed-data";
import type { Tag } from "@/lib/types";

export const ADMIN_RESTAURANT_ID = seedRestaurant.id;
export const MENU_PHOTOS_BUCKET = "menu-photos";

/** Set by middleware after getUser(); stripped from inbound requests first. */
export const ADMIN_USER_ID_HEADER = "x-miora-admin-user-id";
export const ADMIN_USER_EMAIL_HEADER = "x-miora-admin-user-email";

export const ALL_TAGS: Tag[] = [
  "spicy",
  "vegetarian",
  "vegan",
  "contains-nuts",
  "gluten-free",
];

export const TAG_LABELS: Record<Tag, string> = {
  spicy: "ცხარე",
  vegetarian: "ვეგეტარიანული",
  vegan: "ვეგანური",
  "contains-nuts": "შეიცავს თხილს",
  "gluten-free": "უგლუტენო",
};
