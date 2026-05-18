import Link from "next/link";
import { logoutAction } from "@/app/admin/(panel)/actions";

type AdminShellProps = {
  children: React.ReactNode;
};

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Website Settings" },
];

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Admin Panel
          </p>
          <Link href="/admin" className="mt-1 block text-lg font-semibold text-white">
            Ecom Store
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-slate-800 px-3 py-4">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            &larr; View storefront
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-300"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-h-screen w-full min-w-0 pl-60">
        <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
