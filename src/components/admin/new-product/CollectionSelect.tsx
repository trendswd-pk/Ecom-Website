"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CollectionOption = {
  id: string;
  name: string;
  slug: string;
};

type CollectionSelectProps = {
  collections: CollectionOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function CollectionSelect({
  collections,
  selectedIds,
  onChange,
}: CollectionSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCollections = useMemo(
    () => collections.filter((c) => selectedIds.includes(c.id)),
    [collections, selectedIds],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
  }, [collections, query]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleCollection = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeCollection = (id: string) => {
    onChange(selectedIds.filter((item) => item !== id));
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-slate-300">Collections</label>
      <p className="mt-1 text-xs text-slate-500">
        Product will appear in selected collections and storefront menus (if enabled).
      </p>

      {selectedCollections.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {selectedCollections.map((collection) => (
            <li key={collection.id}>
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-200">
                {collection.name}
                <button
                  type="button"
                  onClick={() => removeCollection(collection.id)}
                  className="rounded-full p-0.5 text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-white"
                  aria-label={`Remove ${collection.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "mt-3 flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-left text-sm transition-colors",
          open ? "border-indigo-500 ring-1 ring-indigo-500" : "hover:border-slate-600",
        )}
      >
        <span className={selectedIds.length ? "text-slate-200" : "text-slate-500"}>
          {selectedIds.length
            ? `${selectedIds.length} collection${selectedIds.length === 1 ? "" : "s"} selected`
            : "Search and select collections..."}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          <div className="border-b border-slate-800 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collections..."
                className="w-full rounded-md border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>
          </div>

          <ul className="max-h-56 overflow-y-auto py-1">
            {collections.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-slate-500">
                No collections yet. Create one under Admin → Collections.
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-slate-500">
                No collections match &ldquo;{query}&rdquo;
              </li>
            ) : (
              filtered.map((collection) => {
                const isSelected = selectedIds.includes(collection.id);
                return (
                  <li key={collection.id}>
                    <button
                      type="button"
                      onClick={() => toggleCollection(collection.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-800",
                        isSelected && "bg-slate-800/80",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          isSelected
                            ? "border-indigo-500 bg-indigo-600 text-white"
                            : "border-slate-600 bg-slate-800",
                        )}
                      >
                        {isSelected ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-slate-200">
                          {collection.name}
                        </span>
                        <span className="block text-xs text-slate-500">
                          /collections/{collection.slug}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
