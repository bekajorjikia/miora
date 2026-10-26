"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { DishDetailSheet } from "@/components/DishDetailSheet";
import { formatPrice, getLocalized } from "@/lib/menu";
import { getUiStrings } from "@/lib/ui-strings";
import type { LanguageCode, MenuItem } from "@/lib/types";

interface MenuItemCardProps {
  item: MenuItem;
  language: LanguageCode;
  fallbackLanguage: LanguageCode;
  currency: string;
}

export function MenuItemCard({
  item,
  language,
  fallbackLanguage,
  currency,
}: MenuItemCardProps) {
  const [open, setOpen] = useState(false);
  const [imageState, setImageState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const imageRef = useRef<HTMLImageElement>(null);
  const itemName = getLocalized(item.name, language, fallbackLanguage);
  const price =
    item.priceMinor === undefined
      ? null
      : formatPrice(item.priceMinor, currency, language);
  const showImage = Boolean(item.photoUrl) && imageState !== "error";
  const strings = getUiStrings(language, fallbackLanguage);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.complete) {
      return;
    }

    setImageState(image.naturalWidth > 0 ? "loaded" : "error");
  }, [item.photoUrl]);

  return (
    <li data-item-id={item.id} data-available={item.available}>
      <article
        className={`relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-black/[0.06] bg-white shadow-[0_18px_50px_rgba(38,38,31,0.06)] ${
          item.available ? "" : "bg-[#f1efe8]"
        }`}
      >
        {!item.available && (
          <span className="absolute right-3 top-3 z-30 rounded-full bg-[#1a1a18] px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-white">
            {strings.soldOut}
          </span>
        )}

        <div
          className={`relative aspect-square overflow-hidden bg-[#f1efe8] ${
            item.available ? "" : "opacity-55 grayscale"
          }`}
          data-photo-state={item.photoUrl ? imageState : "missing"}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,#fdfcf9_0%,#f1efe8_72%)]"
          >
            <img
              src="/miora_black_transparent.png"
              alt=""
              width={240}
              height={80}
              className="h-20 w-auto opacity-35"
            />
          </div>

          {showImage && item.photoUrl && (
            <Image
              ref={imageRef}
              src={item.photoUrl}
              alt={itemName}
              fill
              sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw"
              quality={70}
              loading="lazy"
              onLoad={() => setImageState("loaded")}
              onError={() => setImageState("error")}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                imageState === "loaded" ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        <div
          className={`flex flex-1 flex-col p-4 ${
            item.available ? "" : "opacity-55"
          }`}
        >
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
            <h3 className="font-display text-[1.35rem] font-semibold leading-[1.05] text-[#1a1a18]">
              {itemName}
            </h3>
            {price !== null && (
              <p
                className="shrink-0 text-xs font-extrabold tabular-nums text-[#1a1a18] sm:text-sm"
                data-price
              >
                {price}
              </p>
            )}
          </div>

          {item.tags.length > 0 && (
            <ul
              className="mt-4 flex flex-wrap gap-1.5"
              aria-label={strings.tagsFor(itemName)}
            >
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[#eef0df] px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.08em] text-[#596323]"
                >
                  {strings.tagLabels[tag]}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          aria-label={itemName}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          onKeyDown={handleCardKeyDown}
          className="absolute inset-0 z-20 cursor-pointer rounded-[1.4rem] transition-colors duration-200 active:bg-black/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#7f8f3a]"
        />
      </article>

      <DishDetailSheet
        item={item}
        language={language}
        fallbackLanguage={fallbackLanguage}
        currency={currency}
        open={open}
        onClose={handleClose}
      />
    </li>
  );
}
