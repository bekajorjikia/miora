import type { LanguageCode, Tag } from "@/lib/types";

export interface UiStrings {
  modernAsianKitchen: string;
  welcomeTagline: string;
  viewMenu: string;
  dishCount: (count: number) => string;
  menuCategories: string;
  searchMenu: string;
  searchPlaceholder: string;
  cancel: string;
  clearSearch: string;
  searchResults: (count: number) => string;
  noSearchResults: string;
  noSearchResultsHint: string;
  trySearches: string;
  tagLabels: Record<Tag, string>;
  soldOut: string;
  tagsFor: (name: string) => string;
  closeDishDetails: string;
  switchToLanguage: Record<"en" | "ka", string>;
}

export const uiStrings = {
  en: {
    modernAsianKitchen: "Modern Asian Kitchen",
    welcomeTagline:
      "Season by season, plate by plate — cuisine crafted to be shared.",
    viewMenu: "View Menu",
    dishCount: (count: number) =>
      `${count} ${count === 1 ? "product" : "products"}`,
    menuCategories: "Menu categories",
    searchMenu: "Search menu",
    searchPlaceholder: "Search products or ingredients",
    cancel: "Cancel",
    clearSearch: "Clear search",
    searchResults: (count: number) =>
      `${count} ${count === 1 ? "result" : "results"}`,
    noSearchResults: "No products found",
    noSearchResultsHint: "Try another product or ingredient.",
    trySearches: "Try",
    tagLabels: {
      spicy: "Spicy",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      "contains-nuts": "Contains nuts",
      "gluten-free": "Gluten free",
    },
    soldOut: "Sold out",
    tagsFor: (name: string) => `Tags for ${name}`,
    closeDishDetails: "Close product details",
    switchToLanguage: {
      en: "Switch to English",
      ka: "Switch to Georgian",
    },
  },
  ka: {
    modernAsianKitchen: "თანამედროვე აზიური სამზარეულო",
    welcomeTagline:
      "სეზონიდან სეზონამდე, კერძიდან კერძამდე — გემო, რომელიც გაზიარებისთვის იქმნება.",
    viewMenu: "მენიუს ნახვა",
    dishCount: (count: number) => `${count} პროდუქტი`,
    menuCategories: "მენიუს კატეგორიები",
    searchMenu: "მენიუში ძიება",
    searchPlaceholder: "მოძებნეთ პროდუქტი ან ინგრედიენტი",
    cancel: "გაუქმება",
    clearSearch: "ძიების გასუფთავება",
    searchResults: (count: number) => `${count} შედეგი`,
    noSearchResults: "პროდუქტები ვერ მოიძებნა",
    noSearchResultsHint: "სცადეთ სხვა პროდუქტი ან ინგრედიენტი.",
    trySearches: "სცადეთ",
    tagLabels: {
      spicy: "ცხარე",
      vegetarian: "ვეგეტარიანული",
      vegan: "ვეგანური",
      "contains-nuts": "შეიცავს თხილს",
      "gluten-free": "უგლუტენო",
    },
    soldOut: "გაყიდულია",
    tagsFor: (name: string) => `ტეგები: ${name}`,
    closeDishDetails: "დახურვა",
    switchToLanguage: {
      en: "ინგლისურზე გადართვა",
      ka: "ქართულზე გადართვა",
    },
  },
} satisfies Partial<Record<LanguageCode, UiStrings>>;

export function getUiStrings(
  language: LanguageCode,
  fallbackLanguage: LanguageCode,
): UiStrings {
  const requested = uiStrings[language as keyof typeof uiStrings];
  if (requested) {
    return requested;
  }

  return (
    uiStrings[fallbackLanguage as keyof typeof uiStrings] ?? uiStrings.en
  );
}
