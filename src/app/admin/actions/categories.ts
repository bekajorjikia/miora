"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_RESTAURANT_ID } from "@/lib/admin/constants";
import {
  getAdminCategories,
  getNextCategorySortOrder,
  requireAdminUser,
} from "@/lib/admin/data";
import { createEntityId } from "@/lib/admin/ids";

export type CategoryActionState = {
  error?: string;
  success?: string;
};

function revalidateMenu() {
  revalidatePath("/admin");
  revalidatePath("/admin/items");
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  revalidatePath("/");
}

function readNames(formData: FormData) {
  const en = String(formData.get("name_en") ?? "").trim();
  const ka = String(formData.get("name_ka") ?? "").trim();

  if (!en) {
    throw new Error("სახელი (EN) სავალდებულოა.");
  }
  if (!ka) {
    throw new Error("სახელი (KA) სავალდებულოა.");
  }

  return { en, ka };
}

export async function createCategoryAction(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  try {
    const { supabase } = await requireAdminUser();
    const name = readNames(formData);
    const sortOrder = await getNextCategorySortOrder();
    const id = createEntityId(name.en);

    const { error } = await supabase.from("categories").insert({
      id,
      restaurant_id: ADMIN_RESTAURANT_ID,
      name,
      sort_order: sortOrder,
    });

    if (error) {
      return { error: error.message };
    }

    revalidateMenu();
    return { success: "კატეგორია შეიქმნა." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "კატეგორიის შექმნა ვერ მოხერხდა.",
    };
  }
}

export async function updateCategoryAction(
  categoryId: string,
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  try {
    const { supabase } = await requireAdminUser();
    const name = readNames(formData);

    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", categoryId)
      .eq("restaurant_id", ADMIN_RESTAURANT_ID);

    if (error) {
      return { error: error.message };
    }

    revalidateMenu();
    return { success: "შენახულია." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "კატეგორიის განახლება ვერ მოხერხდა.",
    };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  const { supabase } = await requireAdminUser();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("restaurant_id", ADMIN_RESTAURANT_ID);

  if (error) {
    throw error;
  }

  revalidateMenu();
  redirect("/admin/categories");
}

export async function moveCategoryAction(
  categoryId: string,
  direction: "up" | "down",
) {
  const { supabase } = await requireAdminUser();
  const categories = await getAdminCategories();
  const ordered = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const index = ordered.findIndex((category) => category.id === categoryId);
  const swapWith =
    direction === "up" ? ordered[index - 1] : ordered[index + 1];

  if (!swapWith || index === -1) {
    return;
  }

  const updates = [
    { id: ordered[index]!.id, sort_order: swapWith.sortOrder },
    { id: swapWith.id, sort_order: ordered[index]!.sortOrder },
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from("categories")
      .update({ sort_order: update.sort_order })
      .eq("id", update.id);
    if (error) {
      throw error;
    }
  }

  revalidateMenu();
}
