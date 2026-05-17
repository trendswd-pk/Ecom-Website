import { redirect } from "next/navigation";
import { UsersTable } from "@/components/admin/UsersTable";
import { getCurrentAdminProfile } from "@/lib/admin/currentUser";
import {
  canDelete,
  canEdit,
  canView,
  normalizePermissions,
} from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/profile";

function mapProfile(row: {
  id: string;
  email: string;
  role: string;
  permissions: unknown;
}): Profile {
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    permissions: normalizePermissions(
      row.permissions && typeof row.permissions === "object"
        ? (row.permissions as Profile["permissions"])
        : {},
    ),
  };
}

async function getUsers(): Promise<Profile[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, permissions")
    .order("email", { ascending: true });

  if (error || !data) return [];
  return data.map(mapProfile);
}

export default async function AdminUsersPage() {
  const currentUser = await getCurrentAdminProfile();
  if (!currentUser) {
    redirect("/admin/login");
  }

  const permissions = {
    allowView: canView(currentUser),
    allowEdit: canEdit(currentUser),
    allowDelete: canDelete(currentUser),
  };

  let users: Profile[] = [];
  try {
    users = await getUsers();
  } catch {
    // profiles table may not exist yet
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="mt-2 text-slate-400">
            Manage team access. Signed in as{" "}
            <span className="font-medium text-slate-200">{currentUser.email}</span>{" "}
            ({currentUser.role})
          </p>
        </div>
      </div>

      {!permissions.allowDelete && (
        <p className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-400">
          Delete is only available to users with the <strong className="text-slate-200">admin</strong> role.
        </p>
      )}

      <div className="mt-8">
        <UsersTable users={users} {...permissions} />
      </div>
    </div>
  );
}
