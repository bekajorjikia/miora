"use client";

import { nextLanguage } from "@/lib/menu";
import { getUiStrings } from "@/lib/ui-strings";
import type { LanguageCode } from "@/lib/types";

interface LanguageToggleProps {
  language: LanguageCode;
  supported: LanguageCode[];
  onToggle: () => void;
}

function UnitedKingdomFlag() {
  return (
    <svg
      viewBox="0 0 60 40"
      aria-hidden="true"
      className="h-4 w-6 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(26,26,24,0.12)]"
    >
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="9" />
      <path
        d="M0 0 60 40M60 0 0 40"
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="7" />
    </svg>
  );
}

function GeorgianFlag() {
  return (
    <svg
      viewBox="0 0 60 40"
      aria-hidden="true"
      className="h-4 w-6 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(26,26,24,0.12)]"
    >
      <rect width="60" height="40" fill="#fff" />
      <path d="M26 0h8v40h-8zM0 16h60v8H0z" fill="#ff0000" />
      <g fill="#ff0000">
        <path d="M13 5h4v10h-4zM10 8h10v4H10z" />
        <path d="M43 5h4v10h-4zM40 8h10v4H40z" />
        <path d="M13 25h4v10h-4zM10 28h10v4H10z" />
        <path d="M43 25h4v10h-4zM40 28h10v4H40z" />
      </g>
    </svg>
  );
}

export function LanguageToggle({
  language,
  supported,
  onToggle,
}: LanguageToggleProps) {
  if (supported.length < 2) {
    return null;
  }

  const next = nextLanguage(language, supported);
  const strings = getUiStrings(language, "en");
  const ariaLabel =
    strings.switchToLanguage[next as "en" | "ka"] ??
    strings.switchToLanguage.en;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-full border-0 bg-transparent transition-colors duration-200 hover:bg-[#f1efe8] active:bg-[#e8e6dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f8f3a]"
    >
      {language === "ka" ? <GeorgianFlag /> : <UnitedKingdomFlag />}
    </button>
  );
}
