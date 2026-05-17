import { ProductForm } from "@/components/admin/ProductForm";
import { createAdminClient } from "@/lib/supabase/server";

async function getProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return [];
  return data ?? [];
}

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    products = await getProducts();
  } catch {
    // Schema may not be applied yet
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <p className="mt-2 text-slate-400">Add a new product to your catalog.</p>
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <ProductForm />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white">Recent products</h2>
        {products.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No products yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-200">{product.name}</span>
                <span className="text-slate-400">
                  ${Number(product.price).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
