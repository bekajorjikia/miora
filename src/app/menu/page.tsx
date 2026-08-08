import { MenuView } from "@/components/MenuView";
import { getMenuData } from "@/lib/menu-repository";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { restaurant, categories, items } = await getMenuData();

  return (
    <MenuView
      restaurant={restaurant}
      categories={categories}
      items={items}
    />
  );
}
