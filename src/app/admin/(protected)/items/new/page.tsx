import Link from "next/link";

import { ItemForm } from "@/components/admin/ItemForm";
import { getAdminCategories } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminNewItemPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/items"
          className="text-sm font-semibold text-[#626e2b] hover:underline"
        >
          ← კერძები
        </Link>
        <h1 className="mt-2 font-display text-4xl font-semibold">ახალი კერძი</h1>
      </div>
      <div className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
        <ItemForm categories={categories} />
      </div>
    </div>
  );
}
