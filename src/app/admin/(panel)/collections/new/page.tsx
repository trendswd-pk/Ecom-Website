import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CollectionForm,
  type ProductOption,
} from "@/components/admin/CollectionForm";
import { getProductOptions } from "@/lib/collections/admin";

export default async function NewCollectionPage() {
  let products: ProductOption[] = [];

  try {
    products = await getProductOptions();
  } catch {
    // ignore
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Link
        href="/admin/collections"
        className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collections
      </Link>

      <div className="mt-6 w-full">
        <CollectionForm mode="create" products={products} />
      </div>
    </div>
  );
}
