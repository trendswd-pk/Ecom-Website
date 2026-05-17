"use client";

import { useActionState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/app/admin/(panel)/products/actions";
import type { ProductListItem } from "@/components/admin/ProductsTable";

const initialState: ProductFormState = {};

const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

type ProductFormProps = {
  mode?: "create" | "edit";
  product?: ProductListItem;
  onSuccess?: () => void;
};

export function ProductForm({
  mode = "create",
  product,
  onSuccess,
}: ProductFormProps) {
  const isEdit = mode === "edit" && product;
  const action = isEdit ? updateProduct : createProduct;

  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      {isEdit && <input type="hidden" name="productId" value={product.id} />}

      <div>
        <label htmlFor={`name-${product?.id ?? "new"}`} className="block text-sm font-medium text-slate-300">
          Name
        </label>
        <input
          id={`name-${product?.id ?? "new"}`}
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          className={inputClassName}
          placeholder="Wireless headphones"
        />
      </div>

      <div>
        <label htmlFor={`price-${product?.id ?? "new"}`} className="block text-sm font-medium text-slate-300">
          Price
        </label>
        <input
          id={`price-${product?.id ?? "new"}`}
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={product?.price}
          className={inputClassName}
          placeholder="29.99"
        />
      </div>

      {isEdit && (
        <div>
          <label
            htmlFor={`stock-${product.id}`}
            className="block text-sm font-medium text-slate-300"
          >
            Stock
          </label>
          <input
            id={`stock-${product.id}`}
            name="stock_quantity"
            type="number"
            min="0"
            required
            defaultValue={product.stock_quantity}
            className={inputClassName}
          />
        </div>
      )}

      <div>
        <label
          htmlFor={`description-${product?.id ?? "new"}`}
          className="block text-sm font-medium text-slate-300"
        >
          Description
        </label>
        <textarea
          id={`description-${product?.id ?? "new"}`}
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className={inputClassName}
          placeholder="Short product description..."
        />
      </div>

      <div>
        <label
          htmlFor={`image_url-${product?.id ?? "new"}`}
          className="block text-sm font-medium text-slate-300"
        >
          Image URL
        </label>
        <input
          id={`image_url-${product?.id ?? "new"}`}
          name="image_url"
          type="url"
          defaultValue={product?.image_url ?? ""}
          className={inputClassName}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="rounded-lg border border-emerald-900/50 bg-emerald-950/50 px-3 py-2 text-sm text-emerald-300">
          {isEdit ? "Product updated successfully." : "Product saved successfully."}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : isEdit ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
