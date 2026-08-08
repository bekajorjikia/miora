import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import {
  getAdminItem,
  getAdminMenuData,
  requireAdminUser,
} from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminEditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ user }, { categories }, item] = await Promise.all([
    requireAdminUser(),
    getAdminMenuData(),
    getAdminItem(id),
  ]);

  if (!item) {
    notFound();
  }

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
          <h1 className="mt-2 font-display text-4xl font-semibold">
            Edit item
          </h1>
          <p className="mt-1 text-sm text-[#66665f]">{item.name.en}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
          <ItemForm categories={categories} item={item} />
        </div>
      </div>
    </AdminShell>
  );
}
