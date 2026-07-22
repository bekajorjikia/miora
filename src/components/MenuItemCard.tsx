"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

import { formatPrice, getLocalized } from "@/lib/menu";
import type { LanguageCode, MenuItem, Tag } from "@/lib/types";

const tagLabels: Record<Tag, string> = {
  spicy: "Spicy",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "contains-nuts": "Contains nuts",
  "gluten-free": "Gluten free",
};

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
  const [imageState, setImageState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const imageRef = useRef<HTMLImageElement>(null);
  const itemName = getLocalized(item.name, language, fallbackLanguage);
  const description = getLocalized(
    item.description,
    language,
    fallbackLanguage,
  );
  const price =
    item.priceMinor === undefined
      ? null
      : formatPrice(item.priceMinor, currency, language);
  const showImage = Boolean(item.photoUrl) && imageState !== "error";

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
          <span className="absolute right-3 top-3 z-10 rounded-full bg-[#1a1a18] px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-white">
            Sold out
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
            <span className="font-display text-xl font-semibold tracking-[0.22em] text-[#9a9a90]">
              MIORA
            </span>
          </div>

          {showImage && (
            <img
              ref={imageRef}
              src={item.photoUrl}
              alt={itemName}
              width={720}
              height={720}
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

          {/* <p className="mt-2 text-[0.8125rem] leading-[1.55] text-[#66665f]">
            {description}
          </p> */}

          {item.tags.length > 0 && (
            <ul
              className="mt-4 flex flex-wrap gap-1.5"
              aria-label={`Tags for ${itemName}`}
            >
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[#eef0df] px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.08em] text-[#596323]"
                >
                  {tagLabels[tag]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </li>
  );
}
