import type {
  Category,
  LanguageCode,
  Localized,
  MenuItem,
  Tag,
} from "@/lib/types";

export const languageStorageKey = "miora.language";

export function resolveLanguage(
  candidate: string | null | undefined,
  supported: LanguageCode[],
  fallback: LanguageCode,
): LanguageCode {
  if (typeof candidate !== "string" || !candidate.trim()) {
    return fallback;
  }

  return Array.isArray(supported) && supported.includes(candidate)
    ? candidate
    : fallback;
}

export function nextLanguage(
  current: LanguageCode,
  supported: LanguageCode[],
): LanguageCode {
  if (!Array.isArray(supported) || supported.length < 2) {
    return current;
  }

  const currentIndex = supported.indexOf(current);
  if (currentIndex === -1) {
    return current;
  }

  return supported[(currentIndex + 1) % supported.length] ?? current;
}

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

function normalizeSearchValue(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase().trim();
}

export function searchMenuItems(
  items: MenuItem[],
  query: string,
  language: LanguageCode,
  fallbackLanguage: LanguageCode,
  tagLabels: Record<Tag, string>,
): MenuItem[] {
  const searchTerms = normalizeSearchValue(query)
    .split(/\s+/)
    .filter(Boolean);

  if (searchTerms.length === 0) {
    return [];
  }

  return items.filter((item) => {
    const searchableText = normalizeSearchValue(
      [
        getLocalized(item.name, language, fallbackLanguage),
        getLocalized(item.description, language, fallbackLanguage),
        ...item.tags.map((tag) => tagLabels[tag]),
      ].join(" "),
    );

    return searchTerms.every((term) => searchableText.includes(term));
  });
}
