import type { Localized, MenuItem, Tag } from "@/lib/types";

interface ItemSeed {
  id: string;
  categoryId: string;
  name: Localized;
  description?: Localized;
  tags?: Tag[];
  priceMinor?: number;
  photoUrl?: string;
  available?: boolean;
}

export function createItem(
  restaurantId: string,
  {
    id,
    categoryId,
    name,
    description,
    tags = [],
    priceMinor,
    photoUrl,
    available = true,
  }: ItemSeed,
  sortOrder: number,
): MenuItem {
  return {
    id,
    restaurantId,
    categoryId,
    name,
    description: description ?? { en: "", ka: "" },
    tags,
    available,
    sortOrder,
    ...(priceMinor !== undefined ? { priceMinor } : {}),
    ...(photoUrl !== undefined ? { photoUrl } : {}),
  };
}
