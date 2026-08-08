import { MenuItemCard } from "@/components/MenuItemCard";
import { getLocalized } from "@/lib/menu";
import { getUiStrings } from "@/lib/ui-strings";
import type { Category, LanguageCode, MenuItem } from "@/lib/types";

interface CategorySectionProps {
  category: Category;
  items: MenuItem[];
  language: LanguageCode;
  fallbackLanguage: LanguageCode;
  currency: string;
}

export function CategorySection({
  category,
  items,
  language,
  fallbackLanguage,
  currency,
}: CategorySectionProps) {
  const categoryName = getLocalized(
    category.name,
    language,
    fallbackLanguage,
  );
  const headingId = `${category.id}-heading`;
  const strings = getUiStrings(language, fallbackLanguage);

  return (
    <section
      id={category.id}
      aria-labelledby={headingId}
      className="scroll-mt-36"
    >
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-black/10 pb-3">
        <h2
          id={headingId}
          className="font-display text-4xl font-semibold tracking-[-0.025em] text-[#1a1a18] sm:text-5xl"
        >
          {categoryName}
        </h2>
        <p className="pb-1 text-[0.625rem] font-extrabold uppercase tracking-[0.16em] text-[#7f8f3a]">
          {strings.dishCount(items.length)}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            language={language}
            fallbackLanguage={fallbackLanguage}
            currency={currency}
          />
        ))}
      </ul>
    </section>
  );
}
