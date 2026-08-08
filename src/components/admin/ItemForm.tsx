"use client";

import { useActionState } from "react";

import {
  createItemAction,
  updateItemAction,
  type ItemActionState,
} from "@/app/admin/actions/items";
import { ALL_TAGS, TAG_LABELS } from "@/lib/admin/constants";
import { minorToMajor } from "@/lib/admin/price";
import type { Category, MenuItem } from "@/lib/types";

const initialState: ItemActionState = {};

const fieldClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#626e2b]";
const labelClass = "block space-y-1.5 text-sm font-semibold";

export function ItemForm({
  categories,
  item,
}: {
  categories: Category[];
  item?: MenuItem;
}) {
  const action = item
    ? updateItemAction.bind(null, item.id)
    : createItemAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <span>Name (EN)</span>
          <input
            name="name_en"
            required
            defaultValue={item?.name.en ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          <span>Name (KA)</span>
          <input
            name="name_ka"
            required
            defaultValue={item?.name.ka ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          <span>Description (EN)</span>
          <textarea
            name="description_en"
            rows={3}
            defaultValue={item?.description.en ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          <span>Description (KA)</span>
          <textarea
            name="description_ka"
            rows={3}
            defaultValue={item?.description.ka ?? ""}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          <span>Category</span>
          <select
            name="category_id"
            required
            defaultValue={item?.categoryId ?? categories[0]?.id}
            className={fieldClass}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.en}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span>Price (GEL)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 24.50"
            defaultValue={
              item?.priceMinor !== undefined
                ? minorToMajor(item.priceMinor)
                : ""
            }
            className={fieldClass}
          />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="available"
            defaultChecked={item?.available ?? true}
            className="size-4"
          />
          Available
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Tags</legend>
        <div className="flex flex-wrap gap-3">
          {ALL_TAGS.map((tag) => (
            <label key={tag} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                defaultChecked={item?.tags.includes(tag)}
              />
              {TAG_LABELS[tag]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <label className={labelClass}>
          <span>Photo</span>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="block w-full text-sm"
          />
        </label>
        {item?.photoUrl ? (
          <div className="flex flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photoUrl}
              alt=""
              className="h-24 w-24 rounded-lg object-cover"
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="remove_photo" />
              Remove current photo
            </label>
          </div>
        ) : null}
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-[#e8efc8] px-3 py-2 text-sm text-[#3d4a14]">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1a1a18] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : item ? "Save changes" : "Create item"}
      </button>
    </form>
  );
}
