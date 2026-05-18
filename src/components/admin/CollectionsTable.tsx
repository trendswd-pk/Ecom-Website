import Link from "next/link";
import { CollectionRowActions } from "@/components/admin/CollectionRowActions";
import type { CollectionListItem } from "@/types/collection";

type CollectionsTableProps = {
  collections: CollectionListItem[];
};

export function CollectionsTable({ collections }: CollectionsTableProps) {
  if (collections.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center text-sm text-slate-500">
        No collections yet. Click{" "}
        <strong className="text-slate-400">Add Collection</strong> to group products
        for your storefront.
      </p>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[520px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 font-medium text-slate-400">Collection</th>
              <th className="px-4 py-3 font-medium text-slate-400">Products</th>
              <th className="px-4 py-3 text-right font-medium text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr
                key={collection.id}
                className="border-b border-slate-800/80 transition-colors last:border-b-0 hover:bg-slate-800/40"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/collections/${collection.id}/edit`}
                    className="font-medium text-slate-200 transition-colors hover:text-indigo-300"
                  >
                    {collection.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    /collections/{collection.slug}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-300">{collection.product_count}</td>
                <td className="px-4 py-3">
                  <CollectionRowActions collection={collection} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
