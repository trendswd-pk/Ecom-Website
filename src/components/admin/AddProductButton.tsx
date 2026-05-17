import Link from "next/link";
import { Plus } from "lucide-react";

export function AddProductButton() {
  return (
    <Link
      href="/admin/products/new"
      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
    >
      <Plus className="h-4 w-4" />
      Add Product
    </Link>
  );
}
