import { AdminShell } from "@/components/admin/AdminShell";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { getAdminMenuData, requireAdminUser } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [{ user }, { categories, items }] = await Promise.all([
    requireAdminUser(),
    getAdminMenuData(),
  ]);

  const itemCounts = Object.fromEntries(
    categories.map((category) => [
      category.id,
      items.filter((item) => item.categoryId === category.id).length,
    ]),
  );

  return (
    <AdminShell email={user.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-[#66665f]">
            Rename, reorder, or permanently delete categories. Deleting a
            category also deletes its items.
          </p>
        </div>
        <CategoriesManager categories={categories} itemCounts={itemCounts} />
      </div>
    </AdminShell>
  );
}
