import { describe, expect, it } from "vitest";

import { searchMenuItems } from "@/lib/menu";
import { categories, menuItems, restaurant } from "@/lib/seed-data";
import { uiStrings } from "@/lib/ui-strings";

describe("menu seed data", () => {
  it("mirrors the live category list in order", () => {
    expect(categories).toHaveLength(27);
    expect(categories[0]?.id).toBe("sushi-rolls");
    expect(categories.at(-1)?.id).toBe("coffee-tea");
    expect(categories.map((category) => category.sortOrder)).toEqual(
      Array.from({ length: categories.length }, (_, index) => index + 1),
    );
    expect(
      categories.every((category) => category.restaurantId === restaurant.id),
    ).toBe(true);
    expect(
      categories.every(
        (category) => category.name.en?.trim() && category.name.ka?.trim(),
      ),
    ).toBe(true);
  });

  it("has unique item ids, bilingual names and a known category each", () => {
    const ids = menuItems.map((item) => item.id);
    const categoryIds = new Set(categories.map((category) => category.id));

    expect(new Set(ids).size).toBe(ids.length);
    expect(menuItems.length).toBeGreaterThan(150);
    expect(menuItems.every((item) => item.name.en?.trim())).toBe(true);
    expect(menuItems.every((item) => item.name.ka?.trim())).toBe(true);
    expect(menuItems.every((item) => categoryIds.has(item.categoryId))).toBe(true);
  });

  it("keeps the prices and photos entered in the admin panel", () => {
    expect(
      menuItems.filter((item) => item.priceMinor !== undefined),
    ).toHaveLength(menuItems.length - 1);
    expect(menuItems.find((item) => item.id === "moet")?.priceMinor).toBeUndefined();
    expect(menuItems.find((item) => item.id === "salmon-steak")?.priceMinor).toBe(6000);
    expect(
      menuItems.filter((item) => item.photoUrl).length,
    ).toBeGreaterThan(150);
  });

  it("keeps availability toggles and cocktail recipes", () => {
    expect(menuItems.find((item) => item.id === "martini-bianco")?.available).toBe(
      false,
    );
    expect(
      menuItems.find((item) => item.id === "whiskey-sour")?.description.en,
    ).toContain("Angostura bitters");
    expect(menuItems.find((item) => item.id === "mule")?.name.en).toBe("Mule");
  });

  it("searches Georgian names and ingredients", () => {
    expect(
      searchMenuItems(menuItems, "პიტნა", "ka", "en", uiStrings.ka.tagLabels).map(
        (item) => item.id,
      ),
    ).toEqual(
      expect.arrayContaining(["mojito", "gin-breezy", "house-lemonade"]),
    );
    expect(
      searchMenuItems(
        menuItems,
        "ვისკი საუერი",
        "ka",
        "en",
        uiStrings.ka.tagLabels,
      ).map((item) => item.id),
    ).toEqual(["whiskey-sour"]);
  });
});
