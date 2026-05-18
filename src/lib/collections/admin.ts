import { createAdminClient } from "@/lib/supabase/server";
import type { CollectionFormPayload, CollectionListItem } from "@/types/collection";

export async function getCollectionsForAdmin(): Promise<CollectionListItem[]> {
  const supabase = createAdminClient();

  const { data: collections, error } = await supabase
    .from("collections")
    .select("id, name, slug, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !collections) return [];

  const { data: links } = await supabase
    .from("product_collections")
    .select("collection_id");

  const countByCollection = new Map<string, number>();
  for (const link of links ?? []) {
    const id = link.collection_id as string;
    countByCollection.set(id, (countByCollection.get(id) ?? 0) + 1);
  }

  return collections.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    sort_order: row.sort_order,
    created_at: row.created_at,
    product_count: countByCollection.get(row.id) ?? 0,
  }));
}

export async function getCollectionForEdit(
  id: string,
): Promise<CollectionFormPayload | null> {
  const supabase = createAdminClient();

  const { data: collection, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, sort_order")
    .eq("id", id)
    .maybeSingle();

  if (error || !collection) return null;

  const { data: links } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", id);

  return {
    name: collection.name,
    slug: collection.slug,
    description: collection.description ?? "",
    sort_order: collection.sort_order,
    productIds: (links ?? []).map((row) => row.product_id as string),
  };
}

export async function getCollectionOptions(): Promise<
  { id: string; name: string; slug: string }[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getProductCollectionIds(productId: string): Promise<string[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_collections")
    .select("collection_id")
    .eq("product_id", productId);

  if (error || !data) return [];
  return data.map((row) => row.collection_id as string);
}

export async function getProductOptions(): Promise<{ id: string; name: string }[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data;
}
