import { variantKey } from "@/lib/products/variants";
import type { ProductEditorInitial, ProductStatus, VariantRowState } from "@/types/product";

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  image_urls: unknown;
  image_url: string | null;
};

type VariantRow = {
  color: string;
  size: string;
  sale_price: number;
  compare_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
};

function parseImageUrls(imageUrls: unknown, imageUrl: string | null): string[] {
  if (Array.isArray(imageUrls)) {
    return imageUrls.filter((url): url is string => typeof url === "string" && url.length > 0);
  }
  if (imageUrl) return [imageUrl];
  return [];
}

function normalizeStatus(status: string | null): ProductStatus {
  return status === "active" ? "active" : "draft";
}

export function mapProductToEditorInitial(
  product: ProductRow,
  variants: VariantRow[],
): ProductEditorInitial {
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  const variantRows: VariantRowState[] = variants.map((variant) => ({
    key: variantKey(variant.color, variant.size),
    color: variant.color,
    size: variant.size,
    salePrice: String(variant.sale_price),
    comparePrice:
      variant.compare_price !== null ? String(variant.compare_price) : "",
    costPrice: variant.cost_price !== null ? String(variant.cost_price) : "",
    stockQuantity: String(variant.stock_quantity),
  }));

  return {
    title: product.name,
    description: product.description ?? "",
    status: normalizeStatus(product.status),
    imageUrls: parseImageUrls(product.image_urls, product.image_url),
    colors,
    sizes,
    variantRows,
  };
}
