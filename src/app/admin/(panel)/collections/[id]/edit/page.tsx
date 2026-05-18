import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import {
  getCollectionForEdit,
  getProductOptions,
} from "@/lib/collections/admin";
import type { ProductOption } from "@/components/admin/CollectionForm";
import type { CollectionFormPayload } from "@/types/collection";

type EditCollectionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = await params;

  let initial: CollectionFormPayload | null = null;
  let products: ProductOption[] = [];

  try {
    [initial, products] = await Promise.all([
      getCollectionForEdit(id),
      getProductOptions(),
    ]);
  } catch {
    // ignore
  }

  if (!initial) {
    notFound();
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
        <CollectionForm
          mode="edit"
          collectionId={id}
          initial={initial}
          products={products}
        />
      </div>
    </div>
  );
}
