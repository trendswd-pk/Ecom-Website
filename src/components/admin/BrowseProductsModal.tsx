"use client";

import { Check, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { ProductOption } from "@/components/admin/CollectionForm";
import { cn } from "@/lib/utils";

type BrowseProductsModalProps = {
  open: boolean;
  onClose: () => void;
  availableProducts: ProductOption[];
  onAdd: (productIds: string[]) => void;
};

export function BrowseProductsModal({
  open,
  onClose,
  availableProducts,
  onAdd,
}: BrowseProductsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setPicked(new Set());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableProducts;
    return availableProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [availableProducts, query]);

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    if (picked.size === 0) return;
    onAdd([...picked]);
    onClose();
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="browse-products-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 id="browse-products-title" className="text-lg font-semibold text-white">
            Add products
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-800 px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto py-2">
          {availableProducts.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-slate-500">
              All products are already in this collection.
            </li>
          ) : filtered.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-slate-500">
              No products match &ldquo;{query}&rdquo;
            </li>
          ) : (
            filtered.map((product) => {
              const isPicked = picked.has(product.id);
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => toggle(product.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors hover:bg-slate-800",
                      isPicked && "bg-slate-800/80",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        isPicked
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-slate-600 bg-slate-800",
                      )}
                    >
                      {isPicked ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className="font-medium text-slate-200">{product.name}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex justify-end gap-3 border-t border-slate-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={picked.size === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add{picked.size > 0 ? ` (${picked.size})` : ""}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
