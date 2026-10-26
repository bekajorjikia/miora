/**
 * Emergency switch for the offline menu.
 *
 * While this is `true`, guests are served the generated mirror in
 * `src/lib/seed-data.ts` whenever Supabase cannot answer — in production too.
 * It exists because the Vercel dashboard (and with it `ALLOW_SEED_FALLBACK`)
 * is not always reachable when Supabase goes down.
 *
 * Set it back to `false` as soon as Supabase is healthy: while it is on, a
 * future outage silently serves a stale menu instead of an honest error.
 */
export const forceSeedFallback = false;
