import { createClient } from "@/lib/supabase/client";

const BUCKET = "product-images";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // matches supabase/storage-product-images.sql

export type UploadImagesClientResult = {
  urls: string[];
  error?: string;
};

export async function uploadProductImagesClient(
  files: File[],
): Promise<UploadImagesClientResult> {
  if (!files.length) {
    return { urls: [], error: "No files selected." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { urls: [], error: "You must be signed in to upload images." };
  }

  const urls: string[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        urls: [],
        error: `"${file.name}" exceeds the 5 MB limit per image.`,
      };
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `products/${user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

    if (error) {
      return { urls: [], error: error.message };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return { urls };
}
