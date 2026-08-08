import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminMenuData, requireAdminUser } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [{ user }, { restaurant, categories, items }] = await Promise.all([
    requireAdminUser(),
    getAdminMenuData(),
  ]);

  const soldOut = items.filter((item) => !item.available).length;

  return (
    <AdminShell email={user.email}>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl font-semibold">{restaurant.name}</h1>
          <p className="mt-1 text-[#66665f]">Menu management</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Categories" value={String(categories.length)} />
          <Stat label="Items" value={String(items.length)} />
          <Stat label="Sold out" value={String(soldOut)} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/items/new"
            className="rounded-lg bg-[#1a1a18] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add item
          </Link>
          <Link
            href="/admin/items"
            className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold"
          >
            Manage items
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold"
          >
            Manage categories
          </Link>
        </div>
      </div>
    </AdminShell>
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
