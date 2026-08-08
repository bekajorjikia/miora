"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CategorySection } from "@/components/CategorySection";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MenuSearch } from "@/components/MenuSearch";
import {
  getLocalized,
  groupItemsByCategory,
  languageStorageKey,
  nextLanguage,
  resolveLanguage,
} from "@/lib/menu";
import { getUiStrings } from "@/lib/ui-strings";
import type { Category, MenuItem, Restaurant } from "@/lib/types";

interface MenuViewProps {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}

export function MenuView({ restaurant, categories, items }: MenuViewProps) {
  const groupedMenu = useMemo(
    () => groupItemsByCategory(categories, items),
    [categories, items],
  );
  const categoryIds = useMemo(
    () => groupedMenu.map(({ category }) => category.id),
    [groupedMenu],
  );
  const [language, setLanguage] = useState(restaurant.defaultLanguage);
  const [languageReady, setLanguageReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(
    categoryIds[0] ?? "",
  );
  const categoryListRef = useRef<HTMLUListElement>(null);
  const categoryLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const strings = getUiStrings(language, restaurant.defaultLanguage);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    const resolvedLanguage = resolveLanguage(
      storedLanguage,
      restaurant.supportedLanguages,
      restaurant.defaultLanguage,
    );
    const syncTimer = window.setTimeout(() => {
      setLanguage(resolvedLanguage);
      setLanguageReady(true);
    }, 0);

    return () => window.clearTimeout(syncTimer);
  }, [restaurant.defaultLanguage, restaurant.supportedLanguages]);

  useEffect(() => {
    if (!languageReady) {
      return;
    }

    window.localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
  }, [language, languageReady]);

  useEffect(() => {
    const sections = categoryIds
      .map((categoryId) => document.getElementById(categoryId))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    let animationFrame: number | null = null;

    const updateActiveCategory = () => {
      animationFrame = null;
      const activationLine = 148;
      let nextCategoryId = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) {
          nextCategoryId = section.id;
        } else {
          break;
        }
      }

      const reachedPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (reachedPageEnd) {
        nextCategoryId = sections[sections.length - 1].id;
      }

      setActiveCategoryId((currentCategoryId) =>
        currentCategoryId === nextCategoryId
          ? currentCategoryId
          : nextCategoryId,
      );
    };

    const requestActiveCategoryUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateActiveCategory);
      }
    };

    updateActiveCategory();
    window.addEventListener("scroll", requestActiveCategoryUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestActiveCategoryUpdate);

    return () => {
      window.removeEventListener("scroll", requestActiveCategoryUpdate);
      window.removeEventListener("resize", requestActiveCategoryUpdate);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [categoryIds]);

  useEffect(() => {
    const categoryList = categoryListRef.current;
    const activeCategoryLink = categoryLinkRefs.current[activeCategoryId];

    if (!categoryList || !activeCategoryLink) {
      return;
    }

    const targetScrollLeft =
      activeCategoryLink.offsetLeft -
      categoryList.clientWidth / 2 +
      activeCategoryLink.clientWidth / 2;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    categoryList.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeCategoryId]);

  const handleLanguageToggle = () => {
    setLanguage((currentLanguage) =>
      nextLanguage(currentLanguage, restaurant.supportedLanguages),
    );
  };
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#fdfcf9]">
      <header className="sticky top-0 z-40 bg-[#fdfcf9]/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
          <h1 className="font-display text-[1.625rem] font-bold leading-none tracking-[0.08em] text-[#1a1a18]">
            {restaurant.name}
          </h1>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label={strings.searchMenu}
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f1efe8] text-[#1a1a18] transition-colors duration-200 hover:bg-[#e8e6dc] active:bg-[#dedbd0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f8f3a]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[1.125rem] w-[1.125rem]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <circle cx="10.75" cy="10.75" r="6.25" />
                <path d="m15.5 15.5 4 4" />
              </svg>
            </button>
            <div className="relative h-11 w-11">
              <LanguageToggle
                language={language}
                supported={restaurant.supportedLanguages}
                onToggle={handleLanguageToggle}
              />
            </div>
          </div>
        </div>
      </header>

      <nav
        className="sticky top-16 z-30 border-y border-black/[0.07] bg-[#fdfcf9]/95 backdrop-blur-sm"
        aria-label={strings.menuCategories}
      >
        <ul
          ref={categoryListRef}
          className="mx-auto flex max-w-6xl gap-2 overflow-x-auto overscroll-x-contain px-5 py-3 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {groupedMenu.map(({ category }) => {
            const isActive = activeCategoryId === category.id;

            return (
              <li key={category.id} className="shrink-0">
                <a
                  ref={(link) => {
                    categoryLinkRefs.current[category.id] = link;
                  }}
                  href={`#${category.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[0.8125rem] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626e2b] ${
                    isActive
                      ? "border-[#1a1a18] bg-[#1a1a18] font-bold text-white"
                      : "border-transparent bg-transparent font-semibold text-[#66665f] hover:bg-[#f1efe8] hover:text-[#1a1a18] active:bg-[#e8e6dc]"
                  }`}
                >
                  {getLocalized(
                    category.name,
                    language,
                    restaurant.defaultLanguage,
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

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

      {searchOpen && (
        <MenuSearch
          items={items}
          language={language}
          fallbackLanguage={restaurant.defaultLanguage}
          currency={restaurant.currency}
          onClose={handleSearchClose}
        />
      )}
    </div>
  );
}
