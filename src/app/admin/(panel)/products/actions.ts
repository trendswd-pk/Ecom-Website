"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/server";

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  if (!name) {
    return { error: "Product name is required." };
  }

  const price = Number.parseFloat(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    return { error: "Enter a valid price." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").insert({
      name,
      price,
      description: description || null,
      image_url: imageUrl || null,
      stock_quantity: 0,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save product.";
    return { error: message };
  }
}
