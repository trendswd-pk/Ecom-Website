import { LoginForm } from "@/components/admin/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Admin access
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with your Supabase account. Users are stored in{" "}
          <span className="text-slate-300">auth.users</span> and{" "}
          <span className="text-slate-300">profiles</span>.
        </p>

        {params.error === "profile" && (
          <p className="mt-4 rounded-lg border border-amber-900/50 bg-amber-950/50 px-3 py-2 text-sm text-amber-200">
            Signed in, but no profile found. Run{" "}
            <code className="text-amber-100">npm run seed:admin</code> or add a row in{" "}
            <code className="text-amber-100">profiles</code>.
          </p>
        )}

        <div className="mt-6">
          <LoginForm redirectTo={params.next ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
