import { createAdminClient } from "@/lib/supabase/server";

export type CollectionProduct = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

export async function getCollectionBySlug(slug: string) {
  const supabase = createAdminClient();

  const { data: collection, error } = await supabase
    .from("collections")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !collection) return null;

  const { data: links } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", collection.id);

  const productIds = (links ?? []).map((row) => row.product_id as string);

  if (productIds.length === 0) {
    return { collection, products: [] as CollectionProduct[] };
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, description, image_url")
    .in("id", productIds)
    .order("created_at", { ascending: false });

  return {
    collection,
    products: (products ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      description: row.description,
      image_url: row.image_url,
    })),
  };
}
