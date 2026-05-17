"use client";

import { useActionState } from "react";
import {
  createProduct,
  type ProductFormState,
} from "@/app/admin/(panel)/products/actions";

const initialState: ProductFormState = {};

const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export function ProductForm() {
  const [state, formAction, isPending] = useActionState(
    createProduct,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={inputClassName}
          placeholder="Wireless headphones"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-slate-300">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          className={inputClassName}
          placeholder="29.99"
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
          name="description"
          rows={4}
          className={inputClassName}
          placeholder="Short product description..."
        />
      </div>

      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-slate-300"
        >
          Image URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
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
          Product saved successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Add product"}
      </button>
    </form>
  );
}
