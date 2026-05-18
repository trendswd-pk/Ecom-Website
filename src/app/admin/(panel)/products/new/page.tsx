import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProductForm } from "@/components/admin/new-product/NewProductForm";
import { getCollectionOptions } from "@/lib/collections/admin";

export default async function NewProductPage() {
  let collections: Awaited<ReturnType<typeof getCollectionOptions>> = [];

  try {
    collections = await getCollectionOptions();
  } catch {
    // collections table may not exist yet
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Link
        href="/admin/products"
        className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 w-full">
        <NewProductForm collections={collections} />
      </div>
    </div>
  );
}
