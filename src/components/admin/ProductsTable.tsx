import Image from "next/image";
import Link from "next/link";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { cn } from "@/lib/utils";

export type ProductListItem = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock_quantity: number;
  created_at: string;
};

type ProductsTableProps = {
  products: ProductListItem[];
};

const stickyProduct =
  "sticky left-0 z-20 min-w-[240px] w-[240px] bg-slate-900";

const stickyActions =
  "sticky right-0 z-20 min-w-[80px] w-[80px] bg-slate-900";

const stickyHover = "group-hover:bg-slate-800";

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center text-sm text-slate-500">
        No products yet. Click <strong className="text-slate-400">Add Product</strong> to
        create your first item.
      </p>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th
                className={cn(
                  stickyProduct,
                  "z-30 px-4 py-3 font-medium text-slate-400",
                )}
              >
                Product
              </th>
              <th className="min-w-[100px] whitespace-nowrap px-4 py-3 font-medium text-slate-400">
                Price
              </th>
              <th className="min-w-[80px] whitespace-nowrap px-4 py-3 font-medium text-slate-400">
                Stock
              </th>
              <th className="min-w-[120px] whitespace-nowrap px-4 py-3 font-medium text-slate-400">
                Added
              </th>
              <th
                className={cn(
                  stickyActions,
                  "z-30 px-4 py-3 text-right font-medium text-slate-400",
                )}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="group border-b border-slate-800/80 transition-colors last:border-b-0 hover:bg-slate-800/40"
              >
                <td className={cn(stickyProduct, stickyHover, "px-4 py-3")}>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-600">
                          —
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="min-w-0 flex-1 truncate font-medium text-slate-200 transition-colors hover:text-indigo-300"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td className="min-w-[100px] whitespace-nowrap px-4 py-3 font-medium text-indigo-300">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="min-w-[80px] whitespace-nowrap px-4 py-3 text-slate-300">
                  {product.stock_quantity}
                </td>
                <td className="min-w-[120px] whitespace-nowrap px-4 py-3 text-slate-400">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className={cn(stickyActions, stickyHover, "px-4 py-3")}>
                  <ProductRowActions product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
