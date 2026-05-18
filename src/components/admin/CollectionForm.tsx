"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  createCollection,
  updateCollection,
} from "@/app/admin/(panel)/collections/actions";
import { slugify } from "@/lib/utils";
import type { CollectionFormPayload } from "@/types/collection";

const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export type ProductOption = {
  id: string;
  name: string;
};

type CollectionFormProps = {
  mode: "create" | "edit";
  collectionId?: string;
  initial?: CollectionFormPayload;
  products: ProductOption[];
};

export function CollectionForm({
  mode,
  collectionId,
  initial,
  products,
}: CollectionFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && collectionId && initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0));
  const [showInMenu, setShowInMenu] = useState(initial?.show_in_menu ?? true);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    () => new Set(initial?.productIds ?? []),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    setError(null);

    const parsedSortOrder = Number.parseInt(sortOrder, 10);
    if (Number.isNaN(parsedSortOrder)) {
      setError("Menu order must be a number.");
      return;
    }

    const payload: CollectionFormPayload = {
      name,
      slug,
      description,
      sort_order: parsedSortOrder,
      show_in_menu: showInMenu,
      productIds: [...selectedProductIds],
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateCollection(collectionId, payload)
        : await createCollection(payload);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/admin/collections");
      router.refresh();
    });
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <div>
          <label htmlFor="collection-name" className="block text-sm font-medium text-slate-300">
            Name
          </label>
          <input
            id="collection-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClassName}
            placeholder="e.g. Summer Sale"
          />
        </div>

        <div>
          <label htmlFor="collection-slug" className="block text-sm font-medium text-slate-300">
            URL slug
          </label>
          <input
            id="collection-slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className={inputClassName}
            placeholder="summer-sale"
          />
          <p className="mt-1 text-xs text-slate-500">
            Storefront link: /collections/{slug || "your-slug"}
          </p>
        </div>

        <div>
          <label
            htmlFor="collection-description"
            className="block text-sm font-medium text-slate-300"
          >
            Description (optional)
          </label>
          <textarea
            id="collection-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClassName}
            placeholder="Shown on the collection page"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="sort-order" className="block text-sm font-medium text-slate-300">
              Menu order
            </label>
            <input
              id="sort-order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-slate-500">Lower numbers appear first in the menu.</p>
          </div>

          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={showInMenu}
                onChange={(e) => setShowInMenu(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              Show in storefront menu
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-sm font-medium text-slate-300">Products in this collection</h3>
        <p className="mt-1 text-xs text-slate-500">
          Selected products appear on the collection page.
        </p>

        {products.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No products yet. Add products first.</p>
        ) : (
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {products.map((product) => (
              <li key={product.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800 px-3 py-2.5 transition-colors hover:bg-slate-800/60">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.has(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-200">{product.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/collections")}
          className="rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Update collection"
          ) : (
            "Save collection"
          )}
        </button>
      </div>
    </div>
  );
}
