import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { getCurrentAdminProfile } from "@/lib/admin/currentUser";
import { canEdit, normalizePermissions } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/profile";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

async function getUser(id: string): Promise<Profile | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, permissions")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    role: data.role as UserRole,
    permissions: normalizePermissions(
      data.permissions as Profile["permissions"] | null,
    ),
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const currentUser = await getCurrentAdminProfile();

  if (!canEdit(currentUser)) {
    redirect("/admin/users");
  }

  const user = await getUser(id);
  if (!user) notFound();

  return (
    <div>
      <Link
        href={`/admin/users/${user.id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to user
      </Link>

      <h1 className="mt-6 text-2xl font-semibold text-white">Edit user</h1>
      <p className="mt-2 text-slate-400">{user.email}</p>

      <div className="mt-8 max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6">
        <EditUserForm user={user} />
      </div>
    </div>
  );
}
