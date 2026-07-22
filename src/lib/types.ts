export type LanguageCode = string;
export type Localized = Record<LanguageCode, string>;

export type Tag =
  | "spicy"
  | "vegetarian"
  | "vegan"
  | "contains-nuts"
  | "gluten-free";

export interface Restaurant {
  id: string;
  name: string;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  currency: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: Localized;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: Localized;
  description: Localized;
  priceMinor?: number;
  photoUrl?: string;
  tags: Tag[];
  available: boolean;
  sortOrder: number;
}
