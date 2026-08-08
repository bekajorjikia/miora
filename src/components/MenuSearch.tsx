"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { DishDetailSheet } from "@/components/DishDetailSheet";
import {
  formatPrice,
  getLocalized,
  searchMenuItems,
} from "@/lib/menu";
import { getUiStrings } from "@/lib/ui-strings";
import type { LanguageCode, MenuItem } from "@/lib/types";

interface MenuSearchProps {
  items: MenuItem[];
  language: LanguageCode;
  fallbackLanguage: LanguageCode;
  currency: string;
  onClose: () => void;
}

interface SearchResultImageProps {
  item: MenuItem;
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      <circle cx="10.75" cy="10.75" r="6.25" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  );
}

function SearchResultImage({ item }: SearchResultImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(item.photoUrl) && !imageFailed;

  return (
    <div
      className={`relative h-[4.125rem] w-[4.125rem] shrink-0 overflow-hidden rounded-[0.875rem] bg-[radial-gradient(circle_at_50%_18%,#f8f7f2,#ebe9e0)] ${
        item.available ? "" : "grayscale"
      }`}
    >
      <img
        src="/miora_black_transparent.png"
        alt=""
        width={120}
        height={40}
        className="absolute left-1/2 top-1/2 h-auto w-[72%] -translate-x-1/2 -translate-y-1/2 opacity-30"
      />
      {showImage && (
        <img
          src={item.photoUrl}
          alt=""
          width={132}
          height={132}
          onError={() => setImageFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${
            item.available ? "" : "opacity-55"
          }`}
        />
      )}
    </div>
  );
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return name;
  }

  const matchIndex = name
    .toLocaleLowerCase()
    .indexOf(trimmedQuery.toLocaleLowerCase());
  if (matchIndex === -1) {
    return name;
  }

  const matchEnd = matchIndex + trimmedQuery.length;

  return (
    <>
      {name.slice(0, matchIndex)}
      <mark className="rounded bg-[#eef1e2] px-0.5 text-[#4d5622]">
        {name.slice(matchIndex, matchEnd)}
      </mark>
      {name.slice(matchEnd)}
    </>
  );
}

export function MenuSearch({
  items,
  language,
  fallbackLanguage,
  currency,
  onClose,
}: MenuSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const strings = getUiStrings(language, fallbackLanguage);
  const results = useMemo(
    () =>
      searchMenuItems(
        items,
        query,
        language,
        fallbackLanguage,
        strings.tagLabels,
      ),
    [fallbackLanguage, items, language, query, strings.tagLabels],
  );
  const suggestions = useMemo(
    () => ["Tanqueray", "Absolut", "Havana Club", "Four Roses"],
    [],
  );
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const originalBodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      body.style.overflow = originalBodyStyles.overflow;
      body.style.position = originalBodyStyles.position;
      body.style.top = originalBodyStyles.top;
      body.style.width = originalBodyStyles.width;
      body.style.paddingRight = originalBodyStyles.paddingRight;

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }

      const html = document.documentElement;
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedItem) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, selectedItem]);

  return createPortal(
    <>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#fdfcf9]"
      >
        <h2 id={titleId} className="sr-only">
          {strings.searchMenu}
        </h2>

        <div className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#fdfcf9]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-5 py-3 sm:px-8">
            <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2.5 rounded-full bg-white px-4 text-[#7f8f3a] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.14)] ring-[1.5px] ring-[#7f8f3a]">
              <span className="sr-only">{strings.searchMenu}</span>
              <SearchIcon className="h-[1.125rem] w-[1.125rem] shrink-0" />
              <input
                ref={inputRef}
                type="search"
                aria-label={strings.searchMenu}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={strings.searchPlaceholder}
                autoComplete="off"
                enterKeyHint="search"
                className="min-w-0 flex-1 appearance-none bg-transparent py-3 text-base font-semibold text-[#1a1a18] outline-none placeholder:font-medium placeholder:text-[#9a9a90] [&::-webkit-search-cancel-button]:hidden"
              />
              {hasQuery && (
                <button
                  type="button"
                  aria-label={strings.clearSearch}
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#77776f] transition-colors duration-200 hover:bg-[#f1efe8] active:bg-[#e8e6dc] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7f8f3a]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  >
                    <path d="m7.5 7.5 9 9m0-9-9 9" />
                  </svg>
                </button>
              )}
            </label>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full px-1 text-sm font-semibold text-[#66665f] transition-colors duration-200 hover:text-[#1a1a18] active:text-[#7f8f3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f8f3a]"
            >
              {strings.cancel}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pt-7">
          {hasQuery && (
            <p
              aria-live="polite"
              className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[#77776f]"
            >
              {strings.searchResults(results.length)}
            </p>
          )}

          {hasQuery && results.length > 0 && (
            <ul className="flex flex-col gap-3">
              {results.map((item) => {
                const itemName = getLocalized(
                  item.name,
                  language,
                  fallbackLanguage,
                );
                const description = getLocalized(
                  item.description,
                  language,
                  fallbackLanguage,
                );
                const price =
                  item.priceMinor === undefined
                    ? null
                    : formatPrice(item.priceMinor, currency, language);

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => setSelectedItem(item)}
                      className="grid min-h-[5.375rem] w-full cursor-pointer grid-cols-[4.125rem_minmax(0,1fr)_auto] items-center gap-3.5 rounded-[1.125rem] bg-white p-2.5 text-left shadow-[0_5px_15px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] transition-colors duration-200 hover:bg-[#fffefa] active:bg-[#f8f6ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f8f3a]"
                    >
                      <SearchResultImage item={item} />

                      <span className="min-w-0">
                        <span className="block text-[0.90625rem] font-bold leading-tight text-[#1a1a18]">
                          <HighlightedName name={itemName} query={query} />
                        </span>
                        <span className="mt-1 block truncate text-xs text-[#77776f]">
                          {description}
                        </span>
                        {!item.available && (
                          <span className="mt-1 block text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-[#66665f]">
                            {strings.soldOut}
                          </span>
                        )}
                      </span>

                      {price !== null && (
                        <span className="shrink-0 text-sm font-extrabold tabular-nums text-[#626e2b]">
                          {price}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {hasQuery && results.length === 0 && (
            <div className="rounded-[1.125rem] bg-white px-5 py-8 text-center shadow-[0_5px_15px_-8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)]">
              <p className="font-display text-2xl font-semibold text-[#1a1a18]">
                {strings.noSearchResults}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#66665f]">
                {strings.noSearchResultsHint}
              </p>
            </div>
          )}

          <div className={hasQuery ? "mt-5" : "mt-1"}>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[#77776f]">
              {strings.trySearches}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-[#f1efe8] px-4 text-xs font-semibold text-[#66665f] transition-colors duration-200 hover:bg-[#e8e6dc] hover:text-[#1a1a18] active:bg-[#dedbd0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f8f3a]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <DishDetailSheet
          item={selectedItem}
          language={language}
          fallbackLanguage={fallbackLanguage}
          currency={currency}
          open
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>,
    document.body,
  );
}
