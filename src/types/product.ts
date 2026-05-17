export type ProductStatus = "active" | "draft";

export type ProductVariantInput = {
  color: string;
  size: string;
  salePrice: number;
  comparePrice: number | null;
  costPrice: number | null;
  stockQuantity: number;
};

export type CreateProductPayload = {
  title: string;
  description: string;
  status: ProductStatus;
  imageUrls: string[];
  variants: ProductVariantInput[];
};

export type VariantRowState = {
  key: string;
  color: string;
  size: string;
  salePrice: string;
  comparePrice: string;
  costPrice: string;
  stockQuantity: string;
};
