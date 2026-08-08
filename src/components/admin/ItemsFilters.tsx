"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export function ItemsFilters({
  categories,
}: {
  categories: Array<{ id: string; label: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const debounceRef = useRef<number | null>(null);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const availability = searchParams.get("availability") ?? "";

  function update(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    startTransition(() => {
      router.push(`/admin/items?${params.toString()}`);
    });
  }

  return (
    <div
      className={`grid gap-3 sm:grid-cols-[1fr_auto_auto] ${pending ? "opacity-70" : ""}`}
    >
      <input
        type="search"
        defaultValue={q}
        placeholder="Search by name…"
        onChange={(event) => {
          const value = event.target.value;
          if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
          }
          debounceRef.current = window.setTimeout(() => {
            update({ q: value });
          }, 250);
        }}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#626e2b]"
      />
      <select
        value={category}
        onChange={(event) => update({ category: event.target.value })}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">All categories</option>
        {categories.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.label}
          </option>
        ))}
      </select>
      <select
        value={availability}
        onChange={(event) => update({ availability: event.target.value })}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">All</option>
        <option value="available">Available</option>
        <option value="sold-out">Sold out</option>
      </select>
    </div>
  );
}
