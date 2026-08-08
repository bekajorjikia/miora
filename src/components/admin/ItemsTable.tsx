"use client";

import Link from "next/link";
import { useTransition } from "react";

import {
  deleteItemAction,
  moveItemAction,
} from "@/app/admin/actions/items";
import { AvailabilityToggle } from "@/components/admin/AvailabilityToggle";
import { formatPrice, getLocalized } from "@/lib/menu";
import type { Category, MenuItem } from "@/lib/types";

export function ItemsTable({
  items,
  categories,
  currency,
}: {
  items: MenuItem[];
  categories: Category[];
  currency: string;
}) {
  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.id, category.name.en]),
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-black/10 bg-[#faf9f5] text-xs uppercase tracking-wide text-[#77776e]">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Order</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              categoryLabel={categoryNames[item.categoryId] ?? "—"}
              currency={currency}
              isFirst={
                index === 0 ||
                items[index - 1]?.categoryId !== item.categoryId
              }
              isLast={
                index === items.length - 1 ||
                items[index + 1]?.categoryId !== item.categoryId
              }
            />
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[#77776e]">
                No items match these filters.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function ItemRow({
  item,
  categoryLabel,
  currency,
  isFirst,
  isLast,
}: {
  item: MenuItem;
  categoryLabel: string;
  currency: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [moving, startMove] = useTransition();
  const [deleting, startDelete] = useTransition();
  const name = getLocalized(item.name, "en", "ka");

  return (
    <tr className="border-b border-black/[0.06] last:border-0">
      <td className="px-4 py-3">
        <Link
          href={`/admin/items/${item.id}`}
          className="font-semibold hover:underline"
        >
          {name}
        </Link>
        <div className="text-xs text-[#888880]">
          {getLocalized(item.name, "ka", "en")}
        </div>
      </td>
      <td className="px-4 py-3 text-[#55554d]">{categoryLabel}</td>
      <td className="px-4 py-3 tabular-nums">
        {item.priceMinor !== undefined
          ? formatPrice(item.priceMinor, currency, "en-GE")
          : "—"}
      </td>
      <td className="px-4 py-3">
        <AvailabilityToggle itemId={item.id} available={item.available} />
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <button
            type="button"
            disabled={isFirst || moving}
            onClick={() => startMove(() => moveItemAction(item.id, "up"))}
            className="rounded border border-black/10 px-2 py-0.5 text-xs disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast || moving}
            onClick={() => startMove(() => moveItemAction(item.id, "down"))}
            className="rounded border border-black/10 px-2 py-0.5 text-xs disabled:opacity-40"
          >
            ↓
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link
            href={`/admin/items/${item.id}`}
            className="text-xs font-semibold text-[#626e2b] hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              if (!window.confirm(`Delete “${name}” permanently?`)) {
                return;
              }
              startDelete(() => deleteItemAction(item.id));
            }}
            className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
          >
            {deleting ? "…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
