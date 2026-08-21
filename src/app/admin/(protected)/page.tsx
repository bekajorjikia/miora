import Link from "next/link";
import { headers } from "next/headers";

import { MenuQrCard } from "@/components/admin/MenuQrCard";
import { getAdminDashboardStats } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, requestHeaders] = await Promise.all([
    getAdminDashboardStats(),
    headers(),
  ]);

  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const requestOrigin = host ? `${protocol}://${host}` : "";
  const menuUrl = `${configuredOrigin || requestOrigin}/menu`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-semibold">{stats.restaurantName}</h1>
        <p className="mt-1 text-[#66665f]">მენიუს მართვა</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="კატეგორიები" value={String(stats.categoryCount)} />
        <Stat label="კერძები" value={String(stats.itemCount)} />
        <Stat label="გაყიდულია" value={String(stats.soldOutCount)} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/items/new"
          className="rounded-lg bg-[#1a1a18] px-4 py-2.5 text-sm font-semibold text-white"
        >
          კერძის დამატება
        </Link>
        <Link
          href="/admin/items"
          className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold"
        >
          კერძების მართვა
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold"
        >
          კატეგორიების მართვა
        </Link>
      </div>

      <MenuQrCard defaultUrl={menuUrl} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#77776e]">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl font-semibold">{value}</p>
    </div>
  );
}
