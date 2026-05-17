import type { VariantRowState } from "@/types/product";

export function variantKey(color: string, size: string): string {
  return `${color}::${size}`;
}

export function buildVariantCombinations(
  colors: string[],
  sizes: string[],
  existing: Record<string, VariantRowState>,
): VariantRowState[] {
  const normalizedColors = colors.map((c) => c.trim()).filter(Boolean);
  const normalizedSizes = sizes.map((s) => s.trim()).filter(Boolean);

  if (normalizedColors.length === 0 || normalizedSizes.length === 0) {
    return [];
  }

  const rows: VariantRowState[] = [];

  for (const color of normalizedColors) {
    for (const size of normalizedSizes) {
      const key = variantKey(color, size);
      const prev = existing[key];
      rows.push(
        prev ?? {
          key,
          color,
          size,
          salePrice: "",
          comparePrice: "",
          costPrice: "",
          stockQuantity: "0",
        },
      );
    }
  }

  return rows;
}

export function calculateProfit(
  salePrice: string,
  costPrice: string,
): number | null {
  const sale = Number.parseFloat(salePrice);
  const cost = Number.parseFloat(costPrice);
  if (Number.isNaN(sale) || Number.isNaN(cost)) return null;
  return sale - cost;
}
