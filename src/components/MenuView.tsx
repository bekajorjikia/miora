import { CategorySection } from "@/components/CategorySection";
import { getLocalized, groupItemsByCategory } from "@/lib/menu";
import type { Category, MenuItem, Restaurant } from "@/lib/types";
import Image from "next/image";

interface MenuViewProps {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}

export function MenuView({ restaurant, categories, items }: MenuViewProps) {
  const groupedMenu = groupItemsByCategory(categories, items);
  const language = restaurant.defaultLanguage;

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#fdfcf9]">
      <header className="border-b border-black/[0.07]">
        <div className="mx-auto max-w-6xl px-5 pb-7 pt-8 sm:px-8 sm:pt-12">
          <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-[#7f8f3a]">
            Modern Asian Kitchen
          </p>
          <div className="mt-3">
            <div>
              <h1 className="font-display text-6xl font-semibold leading-none tracking-[-0.045em] text-[#1a1a18] sm:text-7xl">
                {restaurant.name}
              </h1>
              <Image src="/logo.png" alt="MIORA" width={100} height={100} />
              {/* <p className="mt-4 max-w-xl text-sm leading-6 text-[#66665f] sm:text-base">
                Season by season, plate by plate — cuisine crafted to be shared.
              </p> */}
            </div>
          </div>

          <nav className="mt-7" aria-label="Menu categories">
            <ul className="flex flex-wrap gap-2">
              {groupedMenu.map(({ category }) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-white px-4 text-xs font-bold text-[#1a1a18] transition-colors duration-200 hover:border-[#7f8f3a] hover:bg-[#eef0df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f8f3a]"
                  >
                    {getLocalized(category.name, language, language)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main
        id="menu"
        className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-10 sm:gap-20 sm:px-8 sm:py-16"
      >
        {groupedMenu.map(({ category, items: categoryItems }) => (
          <CategorySection
            key={category.id}
            category={category}
            items={categoryItems}
            language={language}
            fallbackLanguage={restaurant.defaultLanguage}
            currency={restaurant.currency}
          />
        ))}
      </main>
    </div>
  );
}
