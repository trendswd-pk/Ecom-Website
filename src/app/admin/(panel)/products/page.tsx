import { AddProductButton } from "@/components/admin/AddProductButton";
import {
  ProductsTable,
  type ProductListItem,
} from "@/components/admin/ProductsTable";
import { createAdminClient } from "@/lib/supabase/server";

async function getProducts(): Promise<ProductListItem[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, price, description, image_url, stock_quantity, created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    price: Number(row.price),
    description: row.description,
    image_url: row.image_url,
    stock_quantity: row.stock_quantity ?? 0,
    created_at: row.created_at,
  }));
}

export default async function AdminProductsPage() {
  let products: ProductListItem[] = [];

  try {
    products = await getProducts();
  } catch {
    // Schema may not be applied yet
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <AddProductButton />
      </div>

      <section className="mt-6 w-full min-w-0 sm:mt-8">
        <ProductsTable products={products} />
      </section>
    </div>
  );
}
