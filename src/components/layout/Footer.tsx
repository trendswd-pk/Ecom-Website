export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500 sm:px-6">
        <p>&copy; {new Date().getFullYear()} Ecom Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
