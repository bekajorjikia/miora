"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function MenuQrCard({ defaultUrl }: { defaultUrl: string }) {
  const [menuUrl, setMenuUrl] = useState(defaultUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [generatedFor, setGeneratedFor] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const trimmed = menuUrl.trim();
    if (!trimmed || !isValidHttpUrl(trimmed)) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      Promise.all([
        QRCode.toDataURL(trimmed, {
          width: 280,
          margin: 2,
          color: { dark: "#1a1a18", light: "#ffffff" },
        }),
        QRCode.toDataURL(trimmed, {
          width: 1024,
          margin: 2,
          color: { dark: "#1a1a18", light: "#ffffff" },
        }),
      ])
        .then(([preview, download]) => {
          if (cancelled) return;
          setPreviewUrl(preview);
          setDownloadUrl(download);
          setGeneratedFor(trimmed);
          setGenerationError(null);
        })
        .catch(() => {
          if (!cancelled) {
            setGeneratedFor(trimmed);
            setGenerationError("QR კოდის გენერაცია ვერ მოხერხდა.");
          }
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [menuUrl]);

  async function handleDownload() {
    if (!currentDownloadUrl) return;

    try {
      const response = await fetch(currentDownloadUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "miora-menu-qr.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const link = document.createElement("a");
      link.href = currentDownloadUrl;
      link.download = "miora-menu-qr.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  async function handleCopy() {
    const trimmed = menuUrl.trim();
    if (!trimmed) return;
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setGenerationError("ბმულის კოპირება ვერ მოხერხდა.");
    }
  }

  const trimmedUrl = menuUrl.trim();
  const isValidUrl = isValidHttpUrl(trimmedUrl);
  const isCurrentQr = generatedFor === trimmedUrl && !generationError;
  const currentPreviewUrl = isCurrentQr ? previewUrl : null;
  const currentDownloadUrl = isCurrentQr ? downloadUrl : null;
  const error = trimmedUrl && !isValidUrl
    ? "შეიყვანეთ სწორი http(s) ბმული."
    : generatedFor === trimmedUrl
      ? generationError
      : null;
  const canUseUrl = Boolean(currentDownloadUrl) && isValidUrl;
  const isCustom = trimmedUrl !== defaultUrl;

  return (
    <section className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">მენიუს QR კოდი</h2>
            <p className="mt-1 text-sm text-[#66665f]">
              ჩასვით ნებისმიერი ბმული — QR ავტომატურად განახლდება.
            </p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#77776e]">
              ბმული
            </span>
            <input
              type="url"
              value={menuUrl}
              onChange={(event) => setMenuUrl(event.target.value)}
              placeholder="https://your-domain.com/menu"
              spellCheck={false}
              className="w-full rounded-lg border border-black/10 bg-[#f4f3ef] px-3 py-2.5 font-mono text-sm text-[#1a1a18] outline-none ring-[#626e2b]/40 focus:ring-2"
            />
          </label>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!canUseUrl}
              className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {copied ? "დაკოპირებულია" : "ბმულის კოპირება"}
            </button>
            {canUseUrl ? (
              <a
                href={trimmedUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold"
              >
                ბმულის გახსნა
              </a>
            ) : null}
            {isCustom ? (
              <button
                type="button"
                onClick={() => setMenuUrl(defaultUrl)}
                className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold"
              >
                აღდგენა
              </button>
            ) : null}
          </div>
        </div>

        <div className="mx-auto flex w-[200px] shrink-0 flex-col gap-3 sm:mx-0">
          <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl border border-black/10 bg-white p-3">
            {currentPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentPreviewUrl}
                alt="შეყვანილი ბმულის QR კოდი"
                width={174}
                height={174}
                className="h-full w-full"
              />
            ) : (
              <div className="h-24 w-24 animate-pulse rounded bg-black/5" />
            )}
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!canUseUrl}
            className="w-full rounded-lg bg-[#1a1a18] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            QR-ის გადმოწერა
          </button>
        </div>
      </div>
    </section>
  );
}
