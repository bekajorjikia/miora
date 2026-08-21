import { CategoriesManager } from "@/components/admin/CategoriesManager";
import {
  getAdminCategories,
  getAdminCategoryItemCounts,
} from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, itemCounts] = await Promise.all([
    getAdminCategories(),
    getAdminCategoryItemCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold">კატეგორიები</h1>
        <p className="mt-1 text-sm text-[#66665f]">
          გადაარქვით სახელი, შეცვალეთ რიგი ან სამუდამოდ წაშალეთ კატეგორიები.
          კატეგორიის წაშლა წაშლის მასში არსებულ კერძებსაც.
        </p>
      </div>
      <CategoriesManager categories={categories} itemCounts={itemCounts} />
    </div>
  );
}
