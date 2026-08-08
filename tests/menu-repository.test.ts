import { afterEach, describe, expect, it, vi } from "vitest";

describe("getMenuData seed fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses seed data in development when Supabase env is missing", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("ALLOW_SEED_FALLBACK", "");

    const { getMenuData } = await import("@/lib/menu-repository");
    const data = await getMenuData();

    expect(data.source).toBe("seed");
    expect(data.restaurant.id).toBe("miora");
    expect(data.categories.length).toBeGreaterThan(0);
    expect(data.items.length).toBeGreaterThan(0);
  });

  it("fails closed in production when Supabase env is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("ALLOW_SEED_FALLBACK", "");

    const { getMenuData } = await import("@/lib/menu-repository");

    await expect(getMenuData()).rejects.toThrow(/Menu unavailable/i);
  });

  it("allows production seed fallback when explicitly enabled", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("ALLOW_SEED_FALLBACK", "true");

    const { getMenuData } = await import("@/lib/menu-repository");
    const data = await getMenuData();

    expect(data.source).toBe("seed");
  });
});
