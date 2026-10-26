import { afterEach, describe, expect, it, vi } from "vitest";

/** The emergency switch is on in the shipped code; tests set it per case. */
function stubForceSeedFallback(value: boolean) {
  vi.doMock("@/lib/menu-fallback", () => ({ forceSeedFallback: value }));
}

describe("fetchMenuData seed fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.doUnmock("@/lib/menu-fallback");
  });

  it("uses seed data in development when Supabase env is missing", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("ALLOW_SEED_FALLBACK", "");
    stubForceSeedFallback(false);

    const { fetchMenuData } = await import("@/lib/menu-repository");
    const data = await fetchMenuData();

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
    stubForceSeedFallback(false);

    const { fetchMenuData } = await import("@/lib/menu-repository");

    await expect(fetchMenuData()).rejects.toThrow(/Menu unavailable/i);
  });

  it("allows production seed fallback when explicitly enabled", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("ALLOW_SEED_FALLBACK", "true");
    stubForceSeedFallback(false);

    const { fetchMenuData } = await import("@/lib/menu-repository");
    const data = await fetchMenuData();

    expect(data.source).toBe("seed");
  });

  it("serves seed data in production while the emergency switch is on", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("ALLOW_SEED_FALLBACK", "");
    stubForceSeedFallback(true);

    const { fetchMenuData } = await import("@/lib/menu-repository");
    const data = await fetchMenuData();

    expect(data.source).toBe("seed");
    expect(data.items.length).toBeGreaterThan(150);
  });
});
