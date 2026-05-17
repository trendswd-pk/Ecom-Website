"use client";

import { MoreVertical, Pencil, Trash2, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { deleteProduct } from "@/app/admin/(panel)/products/actions";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductListItem } from "@/components/admin/ProductsTable";
import { cn } from "@/lib/utils";

const MENU_WIDTH = 160;
const MENU_ITEM_HEIGHT = 40;
const MENU_PADDING = 8;

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "danger";
  onSelect: () => void;
};

type MenuPosition = {
  top: number;
  left: number;
};

type ProductRowActionsProps = {
  product: ProductListItem;
};

export function ProductRowActions({ product }: ProductRowActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: "edit",
      label: "Edit",
      icon: Pencil,
      onSelect: () => {
        setMenuOpen(false);
        setEditOpen(true);
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "danger",
      onSelect: () => {
        setMenuOpen(false);
        const confirmed = window.confirm(
          `Delete "${product.name}"? This cannot be undone.`,
        );
        if (!confirmed) return;

        startTransition(async () => {
          const result = await deleteProduct(product.id);
          if (result.error) {
            window.alert(result.error);
            return;
          }
          router.refresh();
        });
      },
    },
  ];

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menuItems.length * MENU_ITEM_HEIGHT + MENU_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + 8 && rect.top > menuHeight + 8;

    let top = openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4;
    let left = rect.right - MENU_WIDTH;

    left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - menuHeight - 8));

    setMenuPosition({ top, left });
  }, [menuItems.length]);

  const openMenu = () => {
    updateMenuPosition();
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setMenuPosition(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [menuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!editOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [editOpen]);

  const handleEditSuccess = () => {
    setEditOpen(false);
    router.refresh();
  };

  const dropdownMenu =
    menuOpen && menuPosition ? (
      <ul
        ref={menuRef}
        role="menu"
        style={{
          position: "fixed",
          top: menuPosition.top,
          left: menuPosition.left,
          width: MENU_WIDTH,
          zIndex: 9999,
        }}
        className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl"
      >
        {menuItems.map((item) => (
          <li key={item.id} role="none">
            <button
              type="button"
              role="menuitem"
              onClick={item.onSelect}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                item.variant === "danger"
                  ? "text-red-300 hover:bg-red-500/10"
                  : "text-slate-200 hover:bg-slate-800",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <>
      <div className="flex justify-end">
        <button
          ref={triggerRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (menuOpen) {
              closeMenu();
            } else {
              openMenu();
            }
          }}
          disabled={isPending}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Product actions"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {mounted && dropdownMenu ? createPortal(dropdownMenu, document.body) : null}

      {editOpen && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`edit-product-${product.id}`}
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/60"
                aria-label="Close dialog"
                onClick={() => setEditOpen(false)}
              />
              <div className="relative z-10 w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h2
                  id={`edit-product-${product.id}`}
                  className="mb-6 text-lg font-semibold text-white"
                >
                  Edit product
                </h2>
                <ProductForm
                  mode="edit"
                  product={product}
                  onSuccess={handleEditSuccess}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
