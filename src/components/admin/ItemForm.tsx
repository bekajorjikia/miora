"use client";

import { useActionState, useRef, useState } from "react";

import {
  createItemAction,
  updateItemAction,
  type ItemActionState,
} from "@/app/admin/actions/items";
import { ALL_TAGS, TAG_LABELS } from "@/lib/admin/constants";
import { MAX_UPLOAD_BYTES, shrinkImageFile } from "@/lib/admin/image";
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
  const [photoError, setPhotoError] = useState("");
  const [preparingPhoto, setPreparingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  /**
   * Shrink the picked photo before submit: full-size camera shots blow past the
   * Server Action body limit and the request fails before our action runs.
   */
  async function handlePhotoChange() {
    const input = photoInputRef.current;
    const file = input?.files?.[0];
    setPhotoError("");

    if (!input || !file) {
      return;
    }

    setPreparingPhoto(true);
    try {
      const prepared = await shrinkImageFile(file);

      if (prepared.size > MAX_UPLOAD_BYTES) {
        input.value = "";
        setPhotoError(
          "ფოტო ძალიან დიდია. აირჩიეთ 4 MB-ზე პატარა სურათი (ან JPEG/PNG ფორმატში).",
        );
        return;
      }

      if (prepared !== file) {
        const transfer = new DataTransfer();
        transfer.items.add(prepared);
        input.files = transfer.files;
      }
    } finally {
      setPreparingPhoto(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <span>სახელი (EN)</span>
          <input
            name="name_en"
            required
            defaultValue={item?.name.en ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          <span>სახელი (KA)</span>
          <input
            name="name_ka"
            required
            defaultValue={item?.name.ka ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          <span>აღწერა (EN)</span>
          <textarea
            name="description_en"
            rows={3}
            defaultValue={item?.description.en ?? ""}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          <span>აღწერა (KA)</span>
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
          <span>კატეგორია</span>
          <select
            name="category_id"
            required
            defaultValue={item?.categoryId ?? categories[0]?.id}
            className={fieldClass}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.ka || category.name.en}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span>ფასი (₾)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="მაგ. 24.50"
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
          ხელმისაწვდომი
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">ტეგები</legend>
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
          <span>ფოტო</span>
          <input
            ref={photoInputRef}
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm"
          />
        </label>
        {preparingPhoto ? (
          <p className="text-sm text-[#66665f]">ფოტო მუშავდება…</p>
        ) : null}
        {photoError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {photoError}
          </p>
        ) : null}
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
              მიმდინარე ფოტოს წაშლა
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
        disabled={pending || preparingPhoto}
        className="rounded-lg bg-[#1a1a18] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "შენახვა…" : item ? "ცვლილებების შენახვა" : "კერძის შექმნა"}
      </button>
    </form>
  );
}
