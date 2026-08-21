"use client";

import { useActionState } from "react";
import { useTransition } from "react";

import {
  createCategoryAction,
  deleteCategoryAction,
  moveCategoryAction,
  updateCategoryAction,
  type CategoryActionState,
} from "@/app/admin/actions/categories";
import type { Category } from "@/lib/types";

const initialState: CategoryActionState = {};
const fieldClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#626e2b]";

export function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-black/10 bg-white p-4 sm:grid-cols-[1fr_1fr_auto]"
    >
      <input
        name="name_en"
        required
        placeholder="სახელი (EN)"
        className={fieldClass}
      />
      <input
        name="name_ka"
        required
        placeholder="სახელი (KA)"
        className={fieldClass}
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1a1a18] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "დამატება…" : "კატეგორიის დამატება"}
      </button>
      {state.error ? (
        <p className="sm:col-span-3 text-sm text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="sm:col-span-3 text-sm text-[#3d4a14]">{state.success}</p>
      ) : null}
    </form>
  );
}

function CategoryRowForm({
  category,
  itemCount,
  isFirst,
  isLast,
}: {
  category: Category;
  itemCount: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const boundUpdate = updateCategoryAction.bind(null, category.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);
  const [moving, startMove] = useTransition();
  const [deleting, startDelete] = useTransition();
  const displayName = category.name.ka || category.name.en;

  return (
    <li className="rounded-xl border border-black/10 bg-white p-4">
      <form action={formAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          name="name_en"
          required
          defaultValue={category.name.en}
          className={fieldClass}
        />
        <input
          name="name_ka"
          required
          defaultValue={category.name.ka}
          className={fieldClass}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60"
        >
          {pending ? "შენახვა…" : "შენახვა"}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#66665f]">
        <span>{itemCount} კერძი</span>
        <button
          type="button"
          disabled={isFirst || moving}
          onClick={() => startMove(() => moveCategoryAction(category.id, "up"))}
          className="rounded-md border border-black/10 px-2 py-1 disabled:opacity-40"
        >
          ზემოთ
        </button>
        <button
          type="button"
          disabled={isLast || moving}
          onClick={() => startMove(() => moveCategoryAction(category.id, "down"))}
          className="rounded-md border border-black/10 px-2 py-1 disabled:opacity-40"
        >
          ქვემოთ
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={() => {
            const message =
              itemCount > 0
                ? `წავშალოთ „${displayName}“ და მისი ${itemCount} კერძი სამუდამოდ?`
                : `წავშალოთ „${displayName}“ სამუდამოდ?`;
            if (!window.confirm(message)) {
              return;
            }
            startDelete(() => deleteCategoryAction(category.id));
          }}
          className="ml-auto rounded-md border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50"
        >
          {deleting ? "წაშლა…" : "წაშლა"}
        </button>
      </div>
      {state.error ? <p className="mt-2 text-sm text-red-700">{state.error}</p> : null}
      {state.success ? (
        <p className="mt-2 text-sm text-[#3d4a14]">{state.success}</p>
      ) : null}
    </li>
  );
}

export function CategoriesManager({
  categories,
  itemCounts,
}: {
  categories: Category[];
  itemCounts: Record<string, number>;
}) {
  return (
    <div className="space-y-6">
      <CreateCategoryForm />
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <CategoryRowForm
            key={category.id}
            category={category}
            itemCount={itemCounts[category.id] ?? 0}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}
