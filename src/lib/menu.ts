import type {
  Category,
  LanguageCode,
  Localized,
  MenuItem,
} from "@/lib/types";

export function getLocalized(
  value: Localized,
  lang: LanguageCode,
  fallback: LanguageCode,
): string {
  const requestedValue = value?.[lang];
  if (typeof requestedValue === "string" && requestedValue.trim()) {
    return requestedValue;
  }

  const fallbackValue = value?.[fallback];
  if (typeof fallbackValue === "string" && fallbackValue.trim()) {
    return fallbackValue;
  }

  return "";
}

export function formatPrice(
  priceMinor: number,
  currency: string,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceMinor / 100);
}

export function groupItemsByCategory(
  categories: Category[],
  items: MenuItem[],
): Array<{ category: Category; items: MenuItem[] }> {
  return [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      category,
      items: items
        .filter((item) => item.categoryId === category.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter((group) => group.items.length > 0);
}
