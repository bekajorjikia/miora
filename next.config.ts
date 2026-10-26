import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // Photos uploaded before the long cache headers still say max-age=3600.
    // Hold the optimized copies for a month anyway, so Supabase is read once
    // per photo instead of hourly.
    minimumCacheTTL: 2592000,
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  experimental: {
    // Soft-nav between admin pages reuses RSC payloads briefly (default dynamic: 0).
    staleTimes: {
      dynamic: 30,
    },
    serverActions: {
      // Photos are shrunk in the browser first; this is the safety net for
      // clients where that fails. Vercel caps request bodies at 4.5 MB.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
