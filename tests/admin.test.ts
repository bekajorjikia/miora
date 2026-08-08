import { describe, expect, it } from "vitest";

import { createEntityId, slugify } from "@/lib/admin/ids";
import { majorToMinor, minorToMajor, parsePriceMajor } from "@/lib/admin/price";

describe("admin ids", () => {
  it("slugifies names", () => {
    expect(slugify("Philadelphia Royale")).toBe("philadelphia-royale");
  });

  it("creates unique ids", () => {
    const first = createEntityId("Dragon Roll");
    const second = createEntityId("Dragon Roll");
    expect(first).toMatch(/^dragon-roll-[a-z0-9]+$/);
    expect(first).not.toBe(second);
  });
});

describe("admin price", () => {
  it("converts major and minor units", () => {
    expect(majorToMinor(24.5)).toBe(2450);
    expect(minorToMajor(2450)).toBe(24.5);
  });

  it("parses price input", () => {
    expect(parsePriceMajor("")).toBeUndefined();
    expect(parsePriceMajor("12,50")).toBe(12.5);
    expect(() => parsePriceMajor("-1")).toThrow();
  });
});
