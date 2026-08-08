"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  languageStorageKey,
  resolveLanguage,
} from "@/lib/menu";
import { getUiStrings } from "@/lib/ui-strings";
import type { LanguageCode, Restaurant } from "@/lib/types";

interface WelcomePageProps {
  restaurant: Restaurant;
}

const languageOptions: Array<{
  code: "en" | "ka";
  label: string;
  flag: string;
}> = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ka", label: "ქართული", flag: "🇬🇪" },
];

export function WelcomePage({ restaurant }: WelcomePageProps) {
  const [language, setLanguage] = useState(restaurant.defaultLanguage);
  const [languageReady, setLanguageReady] = useState(false);
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

  const selectLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(languageStorageKey, nextLanguage);
  };

  return (
    <main
      aria-labelledby="welcome-title"
      className="min-h-dvh overflow-x-clip bg-[#fdfcf9]"
    >
      <section className="welcome-shell mx-auto flex min-h-dvh w-full max-w-xl flex-col px-8 pb-[max(2.625rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:px-12">
        <div className="welcome-content flex flex-1 flex-col items-center justify-center py-8 text-center sm:py-12">
          <h1 id="welcome-title" className="sr-only">
            {restaurant.name}
          </h1>

          <div className="welcome-mark relative h-52 w-52 overflow-hidden rounded-full bg-white shadow-[0_24px_40px_-18px_rgba(26,26,24,0.3)] sm:h-56 sm:w-56">
            <Image
              src="/miora_black_transparent.png"
              alt=""
              aria-hidden="true"
              width={220}
              height={220}
              priority
              className="h-full w-full origin-top scale-[1.08] object-cover object-top"
            />
          </div>

          <p className="welcome-eyebrow mt-6 font-display text-lg font-semibold uppercase tracking-[0.28em] text-[#8f8f86] sm:text-xl">
            {strings.modernAsianKitchen}
          </p>
          <p className="welcome-tagline mt-6 max-w-sm font-display text-[1.75rem] font-medium leading-[1.35] text-[#2a2a26] sm:text-[2rem]">
            {strings.welcomeTagline}
          </p>
        </div>

        <div className="welcome-actions flex shrink-0 flex-col gap-4">
          <div
            className="flex justify-center gap-2"
            role="group"
            aria-label="Language"
          >
            {languageOptions
              .filter(({ code }) =>
                restaurant.supportedLanguages.includes(code),
              )
              .map(({ code, label, flag }) => {
                const isActive = language === code;

                return (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectLanguage(code)}
                    className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f8f3a] ${
                      isActive
                        ? "bg-[#1a1a18] font-bold text-white"
                        : "bg-[#f1efe8] font-semibold text-[#6c6c66] hover:bg-[#e8e6dc] active:bg-[#dedbd0]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="text-[0.9375rem] leading-none"
                    >
                      {flag}
                    </span>
                    {label}
                  </button>
                );
              })}
          </div>

          <Link
            href="/menu"
            onClick={() => {
              window.localStorage.setItem(languageStorageKey, language);
            }}
            className="inline-flex min-h-[3.625rem] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#7f8f3a] px-6 text-base font-bold tracking-[0.02em] text-white shadow-[0_14px_26px_-10px_rgba(127,143,58,0.7)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-[#708033] hover:shadow-[0_16px_30px_-10px_rgba(127,143,58,0.72)] active:scale-[0.98] active:bg-[#626e2b] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#626e2b]"
          >
            {strings.viewMenu}
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12" />
              <path d="m11 5 5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
