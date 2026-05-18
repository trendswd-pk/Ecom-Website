"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState, useTransition } from "react";
import { BrowseProductsModal } from "@/components/admin/BrowseProductsModal";
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
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    () => new Set(initial?.productIds ?? []),
  );
  const [browseOpen, setBrowseOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const productsInCollection = useMemo(
    () => products.filter((p) => selectedProductIds.has(p.id)),
    [products, selectedProductIds],
  );

  const productsNotInCollection = useMemo(
    () => products.filter((p) => !selectedProductIds.has(p.id)),
    [products, selectedProductIds],
  );

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const removeProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const addProducts = (productIds: string[]) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      for (const id of productIds) {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    setError(null);

    const payload: CollectionFormPayload = {
      name,
      slug,
      description,
      sort_order: initial?.sort_order ?? 0,
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
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-300">Products in this collection</h3>
            <p className="mt-1 text-xs text-slate-500">
              {productsInCollection.length} product
              {productsInCollection.length === 1 ? "" : "s"} in this collection
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBrowseOpen(true)}
            disabled={products.length === 0 || productsNotInCollection.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-indigo-500 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Browse
          </button>
        </div>

        {products.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No products in your store yet. Add products first.
          </p>
        ) : productsInCollection.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
            No products in this collection. Click <strong className="text-slate-400">Browse</strong> to
            add products.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-800 rounded-lg border border-slate-800">
            {productsInCollection.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <span className="min-w-0 truncate text-sm text-slate-200">{product.name}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  aria-label={`Remove ${product.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BrowseProductsModal
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        availableProducts={productsNotInCollection}
        onAdd={addProducts}
      />

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
