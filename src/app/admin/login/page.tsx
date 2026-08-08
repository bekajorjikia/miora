import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/admin") ? params.next : "/admin";

  return (
    <div className="flex min-h-full items-center justify-center bg-[#f4f3ef] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-[#fdfcf9] p-8 shadow-[0_20px_60px_rgba(38,38,31,0.08)]">
        <p className="font-display text-3xl font-semibold tracking-wide">MIORA</p>
        <h1 className="mt-1 text-lg font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-[#66665f]">
          Staff access to edit the digital menu.
        </p>
        {params.error === "missing-config" ? (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Supabase env vars are missing. Check `.env`.
          </p>
        ) : null}
        <div className="mt-6">
          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
