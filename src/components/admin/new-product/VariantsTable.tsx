"use client";

import { calculateProfit } from "@/lib/products/variants";
import type { VariantRowState } from "@/types/product";
import { cn } from "@/lib/utils";

const inputClassName =
  "w-full min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

type VariantsTableProps = {
  variants: VariantRowState[];
  onChange: (variants: VariantRowState[]) => void;
};

export function VariantsTable({ variants, onChange }: VariantsTableProps) {
  const updateVariant = (
    key: string,
    field: keyof VariantRowState,
    value: string,
  ) => {
    onChange(
      variants.map((row) =>
        row.key === key ? { ...row, [field]: value } : row,
      ),
    );
  };

  if (variants.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
        Add at least one color and one size to generate variant combinations.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/90">
            <th className="px-3 py-2.5 font-medium text-slate-400">Variant</th>
            <th className="px-3 py-2.5 font-medium text-slate-400">Sale price</th>
            <th className="px-3 py-2.5 font-medium text-slate-400">Compare at</th>
            <th className="px-3 py-2.5 font-medium text-slate-400">Cost</th>
            <th className="px-3 py-2.5 font-medium text-slate-400">Profit</th>
            <th className="px-3 py-2.5 font-medium text-slate-400">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {variants.map((row) => {
            const profit = calculateProfit(row.salePrice, row.costPrice);

            return (
              <tr key={row.key} className="bg-slate-900/50">
                <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-200">
                  {row.color} / {row.size}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={row.salePrice}
                    onChange={(e) =>
                      updateVariant(row.key, "salePrice", e.target.value)
                    }
                    className={inputClassName}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.comparePrice}
                    onChange={(e) =>
                      updateVariant(row.key, "comparePrice", e.target.value)
                    }
                    className={inputClassName}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.costPrice}
                    onChange={(e) =>
                      updateVariant(row.key, "costPrice", e.target.value)
                    }
                    className={inputClassName}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "inline-block min-w-[4rem] font-medium",
                      profit === null
                        ? "text-slate-500"
                        : profit >= 0
                          ? "text-emerald-400"
                          : "text-red-400",
                    )}
                  >
                    {profit === null ? "—" : `$${profit.toFixed(2)}`}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={row.stockQuantity}
                    onChange={(e) =>
                      updateVariant(row.key, "stockQuantity", e.target.value)
                    }
                    className={inputClassName}
                    placeholder="0"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
