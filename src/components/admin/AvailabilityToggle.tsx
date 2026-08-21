"use client";

import { useTransition } from "react";

import { toggleItemAvailableAction } from "@/app/admin/actions/items";

export function AvailabilityToggle({
  itemId,
  available,
}: {
  itemId: string;
  available: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await toggleItemAvailableAction(itemId, !available);
        });
      }}
      className={`inline-flex min-w-[7.5rem] items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
        available
          ? "bg-[#e8efc8] text-[#3d4a14]"
          : "bg-[#f0e4e0] text-[#7a3b2e]"
      }`}
    >
      {pending ? "…" : available ? "ხელმისაწვდომი" : "გაყიდულია"}
    </button>
  );
}
