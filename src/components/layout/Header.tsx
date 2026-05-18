import Link from "next/link";
import type { MenuCollection } from "@/types/collection";

type HeaderProps = {
  menuCollections?: MenuCollection[];
};

export function Header({ menuCollections = [] }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Ecom Store
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-4 overflow-x-auto sm:gap-6">
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          {menuCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="shrink-0 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {collection.name}
            </Link>
          ))}
          <Link
            href="/products"
            className="shrink-0 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            All products
          </Link>
        </nav>
      </div>
    </header>
  );
}
