"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { uploadProductImagesClient } from "@/lib/storage/uploadProductImagesClient";
import { cn } from "@/lib/utils";

type ProductImageUploadProps = {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
};

export function ProductImageUpload({
  imageUrls,
  onChange,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const fileList = Array.from(files);

    startTransition(async () => {
      setError(null);
      const result = await uploadProductImagesClient(fileList);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.urls.length) {
        onChange([...imageUrls, ...result.urls]);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    });
  };

  const removeImage = (url: string) => {
    onChange(imageUrls.filter((item) => item !== url));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">
        Product images
      </label>

      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-6 py-8 transition-colors",
          isPending && "opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          disabled={isPending}
          onChange={(event) => handleFiles(event.target.files)}
        />
        <ImagePlus className="h-8 w-8 text-slate-500" />
        <p className="mt-2 text-center text-sm text-slate-400">
          Uploads go directly to Supabase{" "}
          <code className="text-slate-300">product-images</code>
        </p>
        <p className="mt-1 text-xs text-slate-500">Max 5 MB per image</p>
        <button
          type="button"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            "Choose files"
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {imageUrls.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {imageUrls.map((url) => (
            <li
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-700 bg-slate-800"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
