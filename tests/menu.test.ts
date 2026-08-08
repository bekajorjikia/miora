import { describe, expect, it } from "vitest";

import {
  formatPrice,
  getLocalized,
  groupItemsByCategory,
  nextLanguage,
  resolveLanguage,
  searchMenuItems,
} from "@/lib/menu";
import type { Category, MenuItem } from "@/lib/types";

describe("getLocalized", () => {
  it("returns the requested language", () => {
    expect(getLocalized({ en: "Noodles", ka: "ნუდლები" }, "ka", "en")).toBe(
      "ნუდლები",
    );
  });

  it("falls back when the requested language is missing or empty", () => {
    expect(getLocalized({ en: "Noodles" }, "ka", "en")).toBe("Noodles");
    expect(getLocalized({ en: "Noodles", ka: "" }, "ka", "en")).toBe(
      "Noodles",
    );
  });

  it("returns an empty string when both languages are missing", () => {
    expect(getLocalized({}, "ka", "en")).toBe("");
  });
});

describe("resolveLanguage", () => {
  const supported = ["en", "ka"];

  it("returns a supported candidate", () => {
    expect(resolveLanguage("ka", supported, "en")).toBe("ka");
  });

  it.each(["fr", null, undefined, ""])(
    "returns the fallback for %s",
    (candidate) => {
      expect(resolveLanguage(candidate, supported, "en")).toBe("en");
    },
  );
});

describe("nextLanguage", () => {
  it("toggles between English and Georgian", () => {
    expect(nextLanguage("en", ["en", "ka"])).toBe("ka");
    expect(nextLanguage("ka", ["en", "ka"])).toBe("en");
  });

  it("returns the current language when fewer than two are supported", () => {
    expect(nextLanguage("en", ["en"])).toBe("en");
  });
});

describe("formatPrice", () => {
  it("formats minor units as GEL currency", () => {
    const expected = new Intl.NumberFormat("en", {
      style: "currency",
      currency: "GEL",
    }).format(12.5);

    expect(formatPrice(1250, "GEL", "en")).toBe(expected);
  });
});

describe("groupItemsByCategory", () => {
  const categories: Category[] = [
    {
      id: "sold-out",
      restaurantId: "restaurant",
      name: { en: "Sold out" },
      sortOrder: 2,
    },
    {
      id: "available",
      restaurantId: "restaurant",
      name: { en: "Available" },
      sortOrder: 1,
    },
    {
      id: "empty",
      restaurantId: "restaurant",
      name: { en: "Empty" },
      sortOrder: 3,
    },
  ];

  const baseItem: Omit<MenuItem, "id" | "categoryId" | "sortOrder"> = {
    restaurantId: "restaurant",
    name: { en: "Dish" },
    description: { en: "Description" },
    tags: [],
    available: true,
  };

  const items: MenuItem[] = [
    {
      ...baseItem,
      id: "available-second",
      categoryId: "available",
      sortOrder: 2,
    },
    {
      ...baseItem,
      id: "sold-out-only",
      categoryId: "sold-out",
      available: false,
      sortOrder: 1,
    },
    {
      ...baseItem,
      id: "available-first",
      categoryId: "available",
      sortOrder: 1,
    },
  ];

  it("sorts categories and their items", () => {
    const grouped = groupItemsByCategory(categories, items);

    expect(grouped.map(({ category }) => category.id)).toEqual([
      "available",
      "sold-out",
    ]);
    expect(grouped[0]?.items.map((item) => item.id)).toEqual([
      "available-first",
      "available-second",
    ]);
  });

  it("keeps a category whose items are all unavailable", () => {
    const grouped = groupItemsByCategory(categories, items);

    expect(grouped.some(({ category }) => category.id === "sold-out")).toBe(
      true,
    );
  });

  it("omits a category with no items", () => {
    const grouped = groupItemsByCategory(categories, items);

    expect(grouped.some(({ category }) => category.id === "empty")).toBe(false);
  });
});

describe("searchMenuItems", () => {
  const searchableItems: MenuItem[] = [
    {
      id: "salmon",
      restaurantId: "restaurant",
      categoryId: "sushi",
      name: { en: "Salmon Nigiri", ka: "ორაგულის ნიგირი" },
      description: {
        en: "Aged fish over seasoned rice",
        ka: "დაძველებული თევზი სუნელებიან ბრინჯზე",
      },
      tags: ["gluten-free"],
      available: true,
      sortOrder: 1,
    },
    {
      id: "tofu",
      restaurantId: "restaurant",
      categoryId: "starters",
      name: { en: "Crispy Tofu", ka: "ხრაშუნა ტოფუ" },
      description: {
        en: "Chilli glaze and peanuts",
        ka: "ჩილის მინანქარი და არაქისი",
      },
      tags: ["spicy", "vegan"],
      available: true,
      sortOrder: 2,
    },
  ];
  const tagLabels = {
    spicy: "Spicy",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    "contains-nuts": "Contains nuts",
    "gluten-free": "Gluten free",
  } as const;

  it("returns no items for a blank query", () => {
    expect(searchMenuItems(searchableItems, "  ", "en", "en", tagLabels)).toEqual(
      [],
    );
  });

  it("matches names, descriptions, and dietary tags without case sensitivity", () => {
    expect(
      searchMenuItems(searchableItems, "SALMON", "en", "en", tagLabels).map(
        (item) => item.id,
      ),
    ).toEqual(["salmon"]);
    expect(
      searchMenuItems(searchableItems, "chilli vegan", "en", "en", tagLabels).map(
        (item) => item.id,
      ),
    ).toEqual(["tofu"]);
  });

  it("searches the selected language", () => {
    expect(
      searchMenuItems(searchableItems, "ორაგული", "ka", "en", {
        ...tagLabels,
        spicy: "ცხარე",
        vegetarian: "ვეგეტარიანული",
        vegan: "ვეგანური",
        "contains-nuts": "შეიცავს თხილს",
        "gluten-free": "უგლუტენო",
      }).map((item) => item.id),
    ).toEqual(["salmon"]);
  });
});
