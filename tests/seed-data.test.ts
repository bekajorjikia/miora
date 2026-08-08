import { describe, expect, it } from "vitest";

import { searchMenuItems } from "@/lib/menu";
import { categories, menuItems } from "@/lib/seed-data";
import { uiStrings } from "@/lib/ui-strings";

describe("menu seed data", () => {
  it("orders food before cocktails and bar", () => {
    expect(categories.map((category) => category.id)).toEqual([
      "cold-appetizers",
      "hot-appetizers",
      "sushi-rolls",
      "nigiri",
      "sashimi",
      "maki",
      "gunkan",
      "mains",
      "desserts",
      "classic-cocktails",
      "mix-cocktails",
      "special-cocktails",
      "whiskey",
      "tequila-mezcal",
      "cognac-brandy",
      "rum",
      "gin",
      "vermouth",
      "liqueur",
      "vodka-chacha",
      "champagne",
      "sake",
      "beer",
      "soft-drinks",
      "coffee-tea",
    ]);
    expect(categories.map((category) => category.sortOrder)).toEqual(
      Array.from({ length: categories.length }, (_, index) => index + 1),
    );
  });

  it("has unique item ids and bilingual names", () => {
    const ids = menuItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(menuItems.length).toBeGreaterThan(100);
    expect(menuItems.every((item) => item.available)).toBe(true);
    expect(menuItems.every((item) => item.name.en?.trim())).toBe(true);
    expect(menuItems.every((item) => item.name.ka?.trim())).toBe(true);
  });

  it("keeps cocktail recipe details", () => {
    expect(
      menuItems.filter((item) => item.categoryId === "classic-cocktails"),
    ).toHaveLength(16);
    expect(
      menuItems.filter((item) => item.categoryId === "mix-cocktails"),
    ).toHaveLength(4);
    expect(
      menuItems.filter((item) => item.categoryId === "special-cocktails"),
    ).toHaveLength(11);
    expect(
      menuItems.find((item) => item.id === "whiskey-sour")?.description.en,
    ).toContain("Angostura bitters — 2–3 dashes");
    expect(menuItems.find((item) => item.id === "mule")?.name.en).toBe("Mule");
  });

  it("includes representative bar and food items", () => {
    expect(menuItems.find((item) => item.id === "monkey-shoulder")?.name.ka).toBe(
      "მანქი შოულდერი",
    );
    expect(menuItems.find((item) => item.id === "philadelphia-royale")?.name.en).toBe(
      "Philadelphia Royale",
    );
    expect(menuItems.find((item) => item.id === "basque-cheesecake")?.categoryId).toBe(
      "desserts",
    );
  });

  it("searches Georgian cocktail names and ingredients", () => {
    expect(
      searchMenuItems(
        menuItems,
        "პიტნა",
        "ka",
        "en",
        uiStrings.ka.tagLabels,
      ).map((item) => item.id),
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
    expect(
      searchMenuItems(
        menuItems,
        "ტარხუნა",
        "ka",
        "en",
        uiStrings.ka.tagLabels,
      ).map((item) => item.id),
    ).toEqual(["same-breezy"]);
  });
});
