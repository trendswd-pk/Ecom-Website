import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          New collection
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Shop smarter with a modern storefront
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          A Next.js e-commerce starter wired for Supabase. Add products, manage
          orders, and scale your store from one clean codebase.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary">Admin</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
