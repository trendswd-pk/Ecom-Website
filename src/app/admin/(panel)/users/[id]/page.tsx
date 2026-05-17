import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getCurrentAdminProfile } from "@/lib/admin/currentUser";
import { canEdit, canView, normalizePermissions, roleLabel } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/profile";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function getUser(id: string): Promise<Profile | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, permissions, created_at, updated_at")
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
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const currentUser = await getCurrentAdminProfile();

  if (!canView(currentUser)) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-red-200">
        You do not have permission to view users.
      </div>
    );
  }

  const user = await getUser(id);
  if (!user) notFound();

  const showEdit = canEdit(currentUser);

  return (
    <div>
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </Link>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">{user.email}</h1>
            <p className="mt-1 text-sm text-slate-400">User profile</p>
          </div>
          {showEdit && (
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Edit user
            </Link>
          )}
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <DetailItem label="Role" value={roleLabel(user.role)} />
          <DetailItem label="User ID" value={user.id} mono />
          <DetailItem
            label="Can view"
            value={user.permissions.can_view ? "Yes" : "No"}
          />
          <DetailItem
            label="Can edit"
            value={user.permissions.can_edit ? "Yes" : "No"}
          />
          <DetailItem
            label="Can delete"
            value={user.permissions.can_delete ? "Yes" : "No"}
          />
          {user.created_at && (
            <DetailItem
              label="Created"
              value={new Date(user.created_at).toLocaleString()}
            />
          )}
        </dl>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-slate-200 ${mono ? "font-mono text-xs break-all" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
