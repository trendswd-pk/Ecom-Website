import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProductForm } from "@/components/admin/new-product/NewProductForm";

export default function NewProductPage() {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <Link
        href="/admin/products"
        className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <h1 className="mt-6 text-2xl font-semibold text-white">Add new product</h1>
      <p className="mt-2 text-slate-400">
        Basic details, images, and variant pricing in two steps.
      </p>

      <div className="mt-8 w-full">
        <NewProductForm />
      </div>
    </div>
  );
}
