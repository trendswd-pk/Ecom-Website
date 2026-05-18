import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/new-product/ProductForm";
import {
  getCollectionOptions,
  getProductCollectionIds,
} from "@/lib/collections/admin";
import { mapProductToEditorInitial } from "@/lib/products/loadProductForEdit";
import { createAdminClient } from "@/lib/supabase/server";
import type { ProductEditorInitial } from "@/types/product";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

async function getProductForEdit(id: string): Promise<ProductEditorInitial | null> {
  const supabase = createAdminClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, description, status, image_urls, image_url")
    .eq("id", id)
    .maybeSingle();

  if (productError || !product) return null;

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select(
      "color, size, sale_price, compare_price, cost_price, stock_quantity",
    )
    .eq("product_id", id)
    .order("color")
    .order("size");

  if (variantsError) return null;

  const collectionIds = await getProductCollectionIds(id);
  const initial = mapProductToEditorInitial(product, variants ?? []);
  initial.collectionIds = collectionIds;

  return initial;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  let initial: ProductEditorInitial | null = null;
  let collections: Awaited<ReturnType<typeof getCollectionOptions>> = [];

  try {
    [initial, collections] = await Promise.all([
      getProductForEdit(id),
      getCollectionOptions(),
    ]);
  } catch {
    // ignore
  }

  if (!initial) {
    notFound();
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Link
        href="/admin/products"
        className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 w-full">
        <ProductForm
          mode="edit"
          productId={id}
          initial={initial}
          collections={collections}
        />
      </div>
    </div>
  );
}
