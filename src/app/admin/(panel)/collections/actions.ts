"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { CollectionFormPayload } from "@/types/collection";

export type CollectionActionState = {
  error?: string;
  success?: boolean;
};

async function syncCollectionProducts(
  supabase: ReturnType<typeof createAdminClient>,
  collectionId: string,
  productIds: string[],
) {
  const { error: deleteError } = await supabase
    .from("product_collections")
    .delete()
    .eq("collection_id", collectionId);

  if (deleteError) {
    return deleteError.message;
  }

  if (productIds.length === 0) return null;

  const rows = productIds.map((productId) => ({
    product_id: productId,
    collection_id: collectionId,
  }));

  const { error: insertError } = await supabase
    .from("product_collections")
    .insert(rows);

  return insertError?.message ?? null;
}

export async function createCollection(
  payload: CollectionFormPayload,
): Promise<CollectionActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const name = payload.name.trim();
  const slug = slugify(payload.slug || name);

  if (!name) return { error: "Collection name is required." };
  if (!slug) return { error: "Enter a valid URL slug." };

  try {
    const supabase = createAdminClient();

    const { data: collection, error: insertError } = await supabase
      .from("collections")
      .insert({
        name,
        slug,
        description: payload.description.trim() || null,
        sort_order: payload.sort_order,
        show_in_menu: false,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !collection) {
      return { error: insertError?.message ?? "Failed to create collection." };
    }

    const syncError = await syncCollectionProducts(
      supabase,
      collection.id,
      payload.productIds,
    );
    if (syncError) {
      await supabase.from("collections").delete().eq("id", collection.id);
      return { error: syncError };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create collection.",
    };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/");
  revalidatePath("/collections", "layout");
  return { success: true };
}

export async function updateCollection(
  collectionId: string,
  payload: CollectionFormPayload,
): Promise<CollectionActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  if (!collectionId) return { error: "Collection ID is required." };

  const name = payload.name.trim();
  const slug = slugify(payload.slug || name);

  if (!name) return { error: "Collection name is required." };
  if (!slug) return { error: "Enter a valid URL slug." };

  try {
    const supabase = createAdminClient();

    const { error: updateError } = await supabase
      .from("collections")
      .update({
        name,
        slug,
        description: payload.description.trim() || null,
        sort_order: payload.sort_order,
        show_in_menu: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", collectionId);

    if (updateError) {
      return { error: updateError.message };
    }

    const syncError = await syncCollectionProducts(
      supabase,
      collectionId,
      payload.productIds,
    );
    if (syncError) {
      return { error: syncError };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update collection.",
    };
  }

  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${collectionId}/edit`);
  revalidatePath("/");
  revalidatePath("/collections", "layout");
  revalidatePath(`/collections/${slug}`);
  return { success: true };
}

export async function deleteCollection(
  collectionId: string,
): Promise<CollectionActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  if (!collectionId) return { error: "Collection ID is required." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("collections").delete().eq("id", collectionId);

    if (error) return { error: error.message };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to delete collection.",
    };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/");
  revalidatePath("/collections", "layout");
  return { success: true };
}
