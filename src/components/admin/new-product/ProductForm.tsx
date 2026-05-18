"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createProductWithVariants,
  updateProductWithVariants,
} from "@/app/admin/(panel)/products/actions";
import { ProductImageUpload } from "@/components/admin/new-product/ProductImageUpload";
import { TagInput } from "@/components/admin/new-product/TagInput";
import { VariantsTable } from "@/components/admin/new-product/VariantsTable";
import { buildVariantCombinations } from "@/lib/products/variants";
import { cn } from "@/lib/utils";
import type { ProductEditorInitial, ProductStatus, VariantRowState } from "@/types/product";

const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

type TabId = "basic" | "variants";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initial?: ProductEditorInitial;
};

export function ProductForm({ mode, productId, initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && productId && initial;

  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<ProductStatus>(initial?.status ?? "draft");
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.imageUrls ?? []);
  const [colors, setColors] = useState<string[]>(initial?.colors ?? []);
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? []);
  const [variantRows, setVariantRows] = useState<VariantRowState[]>(
    initial?.variantRows ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rebuildVariants = (
    nextColors: string[],
    nextSizes: string[],
    currentRows: VariantRowState[],
  ) => {
    const map: Record<string, VariantRowState> = {};
    for (const row of currentRows) {
      map[row.key] = row;
    }
    return buildVariantCombinations(nextColors, nextSizes, map);
  };

  const handleColorsChange = (next: string[]) => {
    setColors(next);
    setVariantRows((current) => rebuildVariants(next, sizes, current));
  };

  const handleSizesChange = (next: string[]) => {
    setSizes(next);
    setVariantRows((current) => rebuildVariants(colors, next, current));
  };

  const handleSubmit = () => {
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      setActiveTab("basic");
      return;
    }

    if (colors.length === 0 || sizes.length === 0) {
      setError("Add at least one color and one size.");
      setActiveTab("variants");
      return;
    }

    const parsedVariants = variantRows.map((row) => {
      const salePrice = Number.parseFloat(row.salePrice);
      const comparePrice = row.comparePrice
        ? Number.parseFloat(row.comparePrice)
        : null;
      const costPrice = row.costPrice ? Number.parseFloat(row.costPrice) : null;
      const stockQuantity = Number.parseInt(row.stockQuantity, 10);

      return {
        color: row.color,
        size: row.size,
        salePrice,
        comparePrice:
          comparePrice !== null && !Number.isNaN(comparePrice)
            ? comparePrice
            : null,
        costPrice:
          costPrice !== null && !Number.isNaN(costPrice) ? costPrice : null,
        stockQuantity,
        key: row.key,
      };
    });

    for (const variant of parsedVariants) {
      if (Number.isNaN(variant.salePrice) || variant.salePrice < 0) {
        setError(`Enter a valid sale price for ${variant.color} / ${variant.size}.`);
        setActiveTab("variants");
        return;
      }
      if (Number.isNaN(variant.stockQuantity) || variant.stockQuantity < 0) {
        setError(`Enter valid stock for ${variant.color} / ${variant.size}.`);
        setActiveTab("variants");
        return;
      }
    }

    const variantPayload = parsedVariants.map(({ key: _key, ...variant }) => variant);

    startTransition(async () => {
      const result = isEdit
        ? await updateProductWithVariants({
            productId,
            title,
            description,
            status,
            imageUrls,
            variants: variantPayload,
          })
        : await createProductWithVariants({
            title,
            description,
            status,
            imageUrls,
            variants: variantPayload,
          });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    });
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "basic", label: "Basic information" },
    { id: "variants", label: "Variants & pricing" },
  ];

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClassName}
                placeholder="Product title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClassName}
                placeholder="Describe your product..."
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-300">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className={inputClassName}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <ProductImageUpload imageUrls={imageUrls} onChange={setImageUrls} />
          </div>
        )}

        {activeTab === "variants" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <TagInput
                label="Colors"
                placeholder="e.g. Red"
                tags={colors}
                onChange={handleColorsChange}
              />
              <TagInput
                label="Sizes"
                placeholder="e.g. Medium"
                tags={sizes}
                onChange={handleSizesChange}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-300">
                Variant combinations ({variantRows.length})
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Profit updates automatically: Sale price − Cost price
              </p>
              <div className="mt-4">
                <VariantsTable variants={variantRows} onChange={setVariantRows} />
              </div>
            </div>
          </div>
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
          onClick={() => router.push("/admin/products")}
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
            "Update product"
          ) : (
            "Save product"
          )}
        </button>
      </div>
    </div>
  );
}
