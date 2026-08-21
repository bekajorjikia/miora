import Link from "next/link";
import { Suspense } from "react";

import { ItemsFilters } from "@/components/admin/ItemsFilters";
import { ItemsTable } from "@/components/admin/ItemsTable";
import { getAdminMenuData } from "@/lib/admin/data";
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
  const { restaurant, categories, items } = await getAdminMenuData();

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

  const categorySortOrder = new Map(
    categories.map((category) => [category.id, category.sortOrder]),
  );
  const ordered = [...filtered].sort((a, b) => {
    const categoryOrder =
      (categorySortOrder.get(a.categoryId) ?? 0) -
      (categorySortOrder.get(b.categoryId) ?? 0);
    if (categoryOrder !== 0) {
      return categoryOrder;
    }
    return a.sortOrder - b.sortOrder;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold">კერძები</h1>
          <p className="mt-1 text-sm text-[#66665f]">
            ნაჩვენებია {ordered.length} · სულ {items.length}
          </p>
        </div>
        <Link
          href="/admin/items/new"
          className="rounded-lg bg-[#1a1a18] px-4 py-2.5 text-sm font-semibold text-white"
        >
          კერძის დამატება
        </Link>
      </div>

      <Suspense fallback={null}>
        <ItemsFilters
          categories={categories.map((category) => ({
            id: category.id,
            label: category.name.ka || category.name.en,
          }))}
        />
      </Suspense>

      <ItemsTable
        items={ordered}
        categories={categories}
        currency={restaurant.currency}
      />
    </div>
  );
}
