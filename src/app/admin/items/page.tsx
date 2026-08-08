import Link from "next/link";
import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { ItemsFilters } from "@/components/admin/ItemsFilters";
import { ItemsTable } from "@/components/admin/ItemsTable";
import { getAdminMenuData, requireAdminUser } from "@/lib/admin/data";
import { getLocalized } from "@/lib/menu";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    availability?: string;
  }>;
}) {
  const params = await searchParams;
  const [{ user }, { restaurant, categories, items }] = await Promise.all([
    requireAdminUser(),
    getAdminMenuData(),
  ]);

  const query = (params.q ?? "").trim().toLocaleLowerCase();
  const filtered = items.filter((item) => {
    if (params.category && item.categoryId !== params.category) {
      return false;
    }
    if (params.availability === "available" && !item.available) {
      return false;
    }
    if (params.availability === "sold-out" && item.available) {
      return false;
    }
    if (query) {
      const haystack = [
        getLocalized(item.name, "en", "ka"),
        getLocalized(item.name, "ka", "en"),
        getLocalized(item.description, "en", "ka"),
        getLocalized(item.description, "ka", "en"),
      ]
        .join(" ")
        .toLocaleLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const ordered = [...filtered].sort((a, b) => {
    const categoryOrder =
      (categories.find((category) => category.id === a.categoryId)?.sortOrder ??
        0) -
      (categories.find((category) => category.id === b.categoryId)?.sortOrder ??
        0);
    if (categoryOrder !== 0) {
      return categoryOrder;
    }
    return a.sortOrder - b.sortOrder;
  });

  return (
    <AdminShell email={user.email}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-semibold">Items</h1>
            <p className="mt-1 text-sm text-[#66665f]">
              {ordered.length} shown · {items.length} total
            </p>
          </div>
          <Link
            href="/admin/items/new"
            className="rounded-lg bg-[#1a1a18] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add item
          </Link>
        </div>

        <Suspense fallback={null}>
          <ItemsFilters
            categories={categories.map((category) => ({
              id: category.id,
              label: category.name.en,
            }))}
          />
        </Suspense>

        <ItemsTable
          items={ordered}
          categories={categories}
          currency={restaurant.currency}
        />
      </div>
    </AdminShell>
  );
}
