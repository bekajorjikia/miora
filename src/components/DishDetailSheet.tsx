"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { formatPrice, getLocalized } from "@/lib/menu";
import { getUiStrings } from "@/lib/ui-strings";
import type { LanguageCode, MenuItem } from "@/lib/types";

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface DishDetailSheetProps {
  item: MenuItem;
  language: LanguageCode;
  fallbackLanguage: LanguageCode;
  currency: string;
  open: boolean;
  onClose: () => void;
}

export function DishDetailSheet({
  item,
  language,
  fallbackLanguage,
  currency,
  open,
  onClose,
}: DishDetailSheetProps) {
  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [imageState, setImageState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const titleId = useId();
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
  const strings = getUiStrings(language, fallbackLanguage);
  const closeSheet = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    closingRef.current = true;
    setClosing(true);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    closeTimerRef.current = window.setTimeout(
      () => {
        closeTimerRef.current = null;
        onClose();
        closingRef.current = false;
        setClosing(false);
      },
      reduceMotion ? 0 : 200,
    );
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const image = imageRef.current;
    if (!image?.complete) {
      return;
    }

    setImageState(image.naturalWidth > 0 ? "loaded" : "error");
  }, [item.photoUrl, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

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
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSheet();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel.focus();
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
      } else if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
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
  }, [closeSheet, open]);

  if (!mounted) {
    return null;
  }

  const sheetVisible = open && !closing;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center ${
        open ? "visible" : "invisible"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={strings.closeDishDetails}
        tabIndex={-1}
        onClick={closeSheet}
        className={`absolute inset-0 cursor-default bg-[rgba(26,26,24,0.55)] transition-opacity duration-200 ${
          sheetVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative z-10 max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-[2rem] bg-[#fdfcf9] shadow-[0_-24px_80px_rgba(26,26,24,0.24)] transition-transform duration-200 ease-out ${
          sheetVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {open && (
          <>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={strings.closeDishDetails}
              onClick={closeSheet}
              className="sticky top-0 z-30 flex h-11 w-full cursor-pointer justify-center border-0 bg-[#fdfcf9]/95 pt-3 backdrop-blur-sm transition-colors duration-200 active:bg-black/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#7f8f3a]"
            >
              <span
                aria-hidden="true"
                className="h-1 w-10 rounded-full bg-black/20"
              />
            </button>

            <div
              className={`relative aspect-[4/3] w-full overflow-hidden bg-[#f1efe8] sm:aspect-[16/7] ${
                item.available ? "" : "grayscale"
              }`}
              data-detail-photo-state={item.photoUrl ? imageState : "missing"}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,#fdfcf9_0%,#f1efe8_72%)]"
              >
                <img
                  src="/miora_black_transparent.png"
                  alt=""
                  width={320}
                  height={106}
                  className="h-24 w-auto max-w-[65%] opacity-35"
                />
              </div>

              {showImage && item.photoUrl && (
                <Image
                  ref={imageRef}
                  src={item.photoUrl}
                  alt={itemName}
                  fill
                  sizes="(min-width: 640px) 640px, 100vw"
                  onLoad={() => setImageState("loaded")}
                  onError={() => setImageState("error")}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    imageState === "loaded"
                      ? item.available
                        ? "opacity-100"
                        : "opacity-55"
                      : "opacity-0"
                  }`}
                />
              )}

              {!item.available && (
                <span className="absolute bottom-4 left-5 rounded-full bg-[#1a1a18] px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-white">
                  {strings.soldOut}
                </span>
              )}
            </div>

            <div className="mx-auto max-w-2xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-start justify-between gap-5">
                <h2
                  id={titleId}
                  className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.025em] text-[#1a1a18] sm:text-5xl"
                >
                  {itemName}
                </h2>
                {price !== null && (
                  <p
                    className="shrink-0 pt-1 text-sm font-extrabold tabular-nums text-[#1a1a18] sm:text-base"
                    data-detail-price
                  >
                    {price}
                  </p>
                )}
              </div>

              <p className="mt-5 max-w-prose whitespace-pre-line text-base leading-7 text-[#66665f]">
                {description}
              </p>

              {item.tags.length > 0 && (
                <ul
                  className="mt-6 flex flex-wrap gap-2"
                  aria-label={strings.tagsFor(itemName)}
                >
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-[#eef0df] px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-[#596323]"
                    >
                      {strings.tagLabels[tag]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
