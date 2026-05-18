import Image from "next/image";
import { notFound } from "next/navigation";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { getCollectionBySlug } from "@/lib/collections/storefront";
import { formatPrice } from "@/lib/utils";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const data = await getCollectionBySlug(slug);

  if (!data) {
    notFound();
  }

  const { collection, products } = data;

  return (
    <StorefrontLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {collection.name}
        </h1>
        {collection.description ? (
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            {collection.description}
          </p>
        ) : null}

        {products.length === 0 ? (
          <p className="mt-12 rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No products in this collection yet.
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StorefrontLayout>
  );
}
