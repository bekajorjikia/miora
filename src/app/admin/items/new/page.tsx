import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { getAdminMenuData, requireAdminUser } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminNewItemPage() {
  const [{ user }, { categories }] = await Promise.all([
    requireAdminUser(),
    getAdminMenuData(),
  ]);

  return (
    <AdminShell email={user.email}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href="/admin/items"
            className="text-sm font-semibold text-[#626e2b] hover:underline"
          >
            ← Items
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold">New item</h1>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
          <ItemForm categories={categories} />
        </div>
      </div>
    </AdminShell>
  );
}
