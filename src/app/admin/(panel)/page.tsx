import { createAdminClient } from "@/lib/supabase/server";

async function getDashboardStats() {
  const supabase = createAdminClient();

  const [products, orders, categories] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  return {
    productCount: products.count ?? 0,
    orderCount: orders.count ?? 0,
    categoryCount: categories.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  let stats = { productCount: 0, orderCount: 0, categoryCount: 0 };

  try {
    stats = await getDashboardStats();
  } catch {
    // Tables may not exist until schema.sql is applied
  }

  const cards = [
    { label: "Products", value: stats.productCount, href: "/admin/products" },
    { label: "Orders", value: stats.orderCount, href: "#" },
    { label: "Categories", value: stats.categoryCount, href: "#" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <p className="mt-2 text-slate-400">
        Overview of your store. Add products from the Products page.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <p className="text-sm font-medium text-slate-400">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
            {card.href !== "#" && (
              <a
                href={card.href}
                className="mt-4 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Manage &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
