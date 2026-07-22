import { MenuView } from "@/components/MenuView";
import { categories, menuItems, restaurant } from "@/lib/seed-data";

export default function Home() {
  return (
    <MenuView
      restaurant={restaurant}
      categories={categories}
      items={menuItems}
    />
  );
}
