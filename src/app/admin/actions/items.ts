"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  ADMIN_RESTAURANT_ID,
  ALL_TAGS,
  MENU_PHOTOS_BUCKET,
} from "@/lib/admin/constants";
import {
  getAdminItemsInCategory,
  requireAdminUser,
} from "@/lib/admin/data";
import { createEntityId } from "@/lib/admin/ids";
import { majorToMinor, parsePriceMajor } from "@/lib/admin/price";
import type { Tag } from "@/lib/types";

export type ItemActionState = {
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

function parseTags(formData: FormData): Tag[] {
  const selected = formData.getAll("tags").map(String);
  return ALL_TAGS.filter((tag) => selected.includes(tag));
}

function storagePathFromPublicUrl(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  const marker = `/object/public/${MENU_PHOTOS_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length));
}

async function uploadPhoto(
  supabase: Awaited<ReturnType<typeof requireAdminUser>>["supabase"],
  itemId: string,
  file: File,
): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${ADMIN_RESTAURANT_ID}/${itemId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(MENU_PHOTOS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(MENU_PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function deleteStoragePath(
  supabase: Awaited<ReturnType<typeof requireAdminUser>>["supabase"],
  path: string | null,
) {
  if (!path) {
    return;
  }

  await supabase.storage.from(MENU_PHOTOS_BUCKET).remove([path]);
}

function readLocalizedPair(
  formData: FormData,
  enKey: string,
  kaKey: string,
  requiredLabel: string,
): Record<string, string> {
  const en = String(formData.get(enKey) ?? "").trim();
  const ka = String(formData.get(kaKey) ?? "").trim();

  if (!en) {
    throw new Error(`${requiredLabel} (EN) სავალდებულოა.`);
  }
  if (!ka) {
    throw new Error(`${requiredLabel} (KA) სავალდებულოა.`);
  }

  return { en, ka };
}

export async function createItemAction(
  _prev: ItemActionState,
  formData: FormData,
): Promise<ItemActionState> {
  let createdId = "";

  try {
    const { supabase } = await requireAdminUser();
    const name = readLocalizedPair(formData, "name_en", "name_ka", "სახელი");
    const descriptionEn = String(formData.get("description_en") ?? "").trim();
    const descriptionKa = String(formData.get("description_ka") ?? "").trim();
    const categoryId = String(formData.get("category_id") ?? "").trim();
    const available = formData.get("available") === "on";
    const tags = parseTags(formData);
    const priceMajor = parsePriceMajor(String(formData.get("price") ?? ""));
    const photo = formData.get("photo");

    if (!categoryId) {
      return { error: "კატეგორია სავალდებულოა." };
    }

    const { data: existing } = await supabase
      .from("menu_items")
      .select("sort_order")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const sortOrder = (existing?.[0]?.sort_order ?? 0) + 1;
    const id = createEntityId(name.en);

    let photoUrl: string | undefined;
    if (photo instanceof File && photo.size > 0) {
      photoUrl = await uploadPhoto(supabase, id, photo);
    }

    const { error } = await supabase.from("menu_items").insert({
      id,
      restaurant_id: ADMIN_RESTAURANT_ID,
      category_id: categoryId,
      name,
      description: {
        en: descriptionEn,
        ka: descriptionKa,
      },
      price_minor: priceMajor === undefined ? null : majorToMinor(priceMajor),
      photo_url: photoUrl ?? null,
      tags,
      available,
      sort_order: sortOrder,
    });

    if (error) {
      return { error: error.message };
    }

    createdId = id;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "კერძის შექმნა ვერ მოხერხდა.",
    };
  }

  revalidateMenu();
  redirect(`/admin/items/${createdId}`);
}

export async function updateItemAction(
  itemId: string,
  _prev: ItemActionState,
  formData: FormData,
): Promise<ItemActionState> {
  try {
    const { supabase } = await requireAdminUser();
    const name = readLocalizedPair(formData, "name_en", "name_ka", "სახელი");
    const descriptionEn = String(formData.get("description_en") ?? "").trim();
    const descriptionKa = String(formData.get("description_ka") ?? "").trim();
    const categoryId = String(formData.get("category_id") ?? "").trim();
    const available = formData.get("available") === "on";
    const removePhoto = formData.get("remove_photo") === "on";
    const tags = parseTags(formData);
    const priceMajor = parsePriceMajor(String(formData.get("price") ?? ""));
    const photo = formData.get("photo");

    if (!categoryId) {
      return { error: "კატეგორია სავალდებულოა." };
    }

    const { data: current, error: currentError } = await supabase
      .from("menu_items")
      .select("photo_url")
      .eq("id", itemId)
      .eq("restaurant_id", ADMIN_RESTAURANT_ID)
      .maybeSingle();

    if (currentError) {
      return { error: currentError.message };
    }
    if (!current) {
      return { error: "კერძი ვერ მოიძებნა." };
    }

    let photoUrl: string | null = current.photo_url;
    const previousPath = storagePathFromPublicUrl(current.photo_url ?? undefined);

    if (photo instanceof File && photo.size > 0) {
      photoUrl = await uploadPhoto(supabase, itemId, photo);
      await deleteStoragePath(supabase, previousPath);
    } else if (removePhoto) {
      await deleteStoragePath(supabase, previousPath);
      photoUrl = null;
    }

    const { error } = await supabase
      .from("menu_items")
      .update({
        category_id: categoryId,
        name,
        description: {
          en: descriptionEn,
          ka: descriptionKa,
        },
        price_minor: priceMajor === undefined ? null : majorToMinor(priceMajor),
        photo_url: photoUrl,
        tags,
        available,
      })
      .eq("id", itemId)
      .eq("restaurant_id", ADMIN_RESTAURANT_ID);

    if (error) {
      return { error: error.message };
    }

    revalidateMenu();
    revalidatePath(`/admin/items/${itemId}`);
    return { success: "შენახულია." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "კერძის განახლება ვერ მოხერხდა.",
    };
  }
}

export async function toggleItemAvailableAction(itemId: string, available: boolean) {
  const { supabase } = await requireAdminUser();
  const { error } = await supabase
    .from("menu_items")
    .update({ available })
    .eq("id", itemId)
    .eq("restaurant_id", ADMIN_RESTAURANT_ID);

  if (error) {
    throw error;
  }

  revalidateMenu();
  revalidatePath(`/admin/items/${itemId}`);
}

export async function deleteItemAction(itemId: string) {
  const { supabase } = await requireAdminUser();

  const { data: current } = await supabase
    .from("menu_items")
    .select("photo_url")
    .eq("id", itemId)
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .maybeSingle();

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", itemId)
    .eq("restaurant_id", ADMIN_RESTAURANT_ID);

  if (error) {
    throw error;
  }

  await deleteStoragePath(
    supabase,
    storagePathFromPublicUrl(current?.photo_url ?? undefined),
  );

  revalidateMenu();
  redirect("/admin/items");
}

export async function moveItemAction(
  itemId: string,
  direction: "up" | "down",
) {
  const { supabase } = await requireAdminUser();

  const { data: current, error: currentError } = await supabase
    .from("menu_items")
    .select("id, sort_order, category_id")
    .eq("id", itemId)
    .eq("restaurant_id", ADMIN_RESTAURANT_ID)
    .maybeSingle();

  if (currentError) {
    throw currentError;
  }
  if (!current) {
    throw new Error("კერძი ვერ მოიძებნა.");
  }

  const siblings = await getAdminItemsInCategory(current.category_id as string);
  const index = siblings.findIndex((entry) => entry.id === itemId);
  const swapWith =
    direction === "up" ? siblings[index - 1] : siblings[index + 1];
  if (!swapWith || index === -1) {
    return;
  }

  const updates = [
    { id: current.id as string, sort_order: swapWith.sortOrder },
    { id: swapWith.id, sort_order: current.sort_order as number },
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from("menu_items")
      .update({ sort_order: update.sort_order })
      .eq("id", update.id);
    if (error) {
      throw error;
    }
  }

  revalidateMenu();
}
