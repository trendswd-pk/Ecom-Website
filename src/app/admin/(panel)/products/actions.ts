"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/server";
import type { CreateProductPayload, ProductStatus } from "@/types/product";

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

export type UploadImagesResult = {
  urls?: string[];
  error?: string;
};

export async function uploadProductImages(
  formData: FormData,
): Promise<UploadImagesResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const files = formData.getAll("files");
  if (files.length === 0) {
    return { error: "No files selected." };
  }

  try {
    const supabase = createAdminClient();
    const urls: string[] = [];

    for (const entry of files) {
      if (!(entry instanceof File) || entry.size === 0) continue;

      const extension = entry.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const buffer = Buffer.from(await entry.arrayBuffer());

      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, buffer, {
          contentType: entry.type || "image/jpeg",
          upsert: false,
        });

      if (error) {
        return { error: error.message };
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    if (urls.length === 0) {
      return { error: "No valid image files to upload." };
    }

    return { urls };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload images.";
    return { error: message };
  }
}

export async function createProductWithVariants(
  payload: CreateProductPayload,
): Promise<{ error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const title = payload.title.trim();
  if (!title) {
    return { error: "Product title is required." };
  }

  if (!payload.variants.length) {
    return { error: "Add at least one color, one size, and fill variant prices." };
  }

  for (const variant of payload.variants) {
    if (variant.salePrice < 0 || variant.stockQuantity < 0) {
      return { error: "Variant prices and stock must be zero or greater." };
    }
  }

  const minSalePrice = Math.min(...payload.variants.map((v) => v.salePrice));
  const totalStock = payload.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  const imageUrls = payload.imageUrls.filter(Boolean);

  try {
    const supabase = createAdminClient();

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: title,
        description: payload.description.trim() || null,
        status: payload.status,
        image_urls: imageUrls,
        image_url: imageUrls[0] ?? null,
        price: minSalePrice,
        stock_quantity: totalStock,
      })
      .select("id")
      .single();

    if (productError || !product) {
      return { error: productError?.message ?? "Failed to create product." };
    }

    const variantRows = payload.variants.map((variant) => ({
      product_id: product.id,
      color: variant.color,
      size: variant.size,
      sale_price: variant.salePrice,
      compare_price: variant.comparePrice,
      cost_price: variant.costPrice,
      stock_quantity: variant.stockQuantity,
    }));

    const { error: variantsError } = await supabase
      .from("product_variants")
      .insert(variantRows);

    if (variantsError) {
      await supabase.from("products").delete().eq("id", product.id);
      return { error: variantsError.message };
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save product.";
    return { error: message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

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
      image_urls: imageUrl ? [imageUrl] : [],
      status: "draft" as ProductStatus,
      stock_quantity: 0,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    redirect("/admin/products");
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Failed to save product.";
    return { error: message };
  }
}

export async function updateProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const stockRaw = String(formData.get("stock_quantity") ?? "0").trim();

  if (!productId) {
    return { error: "Product ID is required." };
  }

  if (!name) {
    return { error: "Product name is required." };
  }

  const price = Number.parseFloat(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    return { error: "Enter a valid price." };
  }

  const stockQuantity = Number.parseInt(stockRaw, 10);
  if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
    return { error: "Enter a valid stock quantity." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("products")
      .update({
        name,
        price,
        description: description || null,
        image_url: imageUrl || null,
        image_urls: imageUrl ? [imageUrl] : [],
        stock_quantity: stockQuantity,
      })
      .eq("id", productId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update product.";
    return { error: message };
  }
}

export type ProductActionState = {
  error?: string;
  success?: boolean;
};

export async function deleteProduct(productId: string): Promise<ProductActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  if (!productId) {
    return { error: "Product ID is required." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete product.";
    return { error: message };
  }
}
