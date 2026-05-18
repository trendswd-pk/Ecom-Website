import { AddCollectionButton } from "@/components/admin/AddCollectionButton";
import { CollectionsTable } from "@/components/admin/CollectionsTable";
import { getCollectionsForAdmin } from "@/lib/collections/admin";

export default async function AdminCollectionsPage() {
  let collections: Awaited<ReturnType<typeof getCollectionsForAdmin>> = [];

  try {
    collections = await getCollectionsForAdmin();
  } catch {
    // collections table may not exist yet — run supabase/collections.sql
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white">Collections</h1>
        <AddCollectionButton />
      </div>

      <p className="mt-2 text-sm text-slate-400">
        Group products and control what appears in your storefront navigation menu.
      </p>

      <section className="mt-6 w-full min-w-0 sm:mt-8">
        <CollectionsTable collections={collections} />
      </section>
    </div>
  );
}
