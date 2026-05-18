"use client";

import {
  ProductForm,
} from "@/components/admin/new-product/ProductForm";
import type { CollectionOption } from "@/components/admin/new-product/CollectionSelect";

type NewProductFormProps = {
  collections: CollectionOption[];
};

export function NewProductForm({ collections }: NewProductFormProps) {
  return <ProductForm mode="create" collections={collections} />;
}
