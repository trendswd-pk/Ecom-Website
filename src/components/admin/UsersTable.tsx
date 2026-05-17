import { UserRowActions } from "@/components/admin/UserRowActions";
import { roleLabel } from "@/lib/permissions";
import type { Profile, UserRole } from "@/types/profile";

type UsersTableProps = {
  users: Profile[];
  allowView: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
};

const roleStyles: Record<UserRole, string> = {
  admin: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/30",
  editor: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  viewer: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
};

export function UsersTable({
  users,
  allowView,
  allowEdit,
  allowDelete,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center text-sm text-slate-500">
        No users found. Create auth users in Supabase or run the seed in{" "}
        <code className="text-slate-400">supabase/profiles.sql</code>.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th className="px-4 py-3 font-medium text-slate-400">Email</th>
              <th className="px-4 py-3 font-medium text-slate-400">Role</th>
              <th className="px-4 py-3 font-medium text-slate-400">Permissions</th>
              <th className="px-4 py-3 text-right font-medium text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-medium text-slate-200">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${roleStyles[user.role]}`}
                  >
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  <PermissionSummary permissions={user.permissions} />
                </td>
                <td className="px-4 py-3">
                  <UserRowActions
                    user={user}
                    allowView={allowView}
                    allowEdit={allowEdit}
                    allowDelete={allowDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PermissionSummary({
  permissions,
}: {
  permissions: Profile["permissions"];
}) {
  const flags = [
    permissions.can_view && "view",
    permissions.can_edit && "edit",
    permissions.can_delete && "delete",
  ].filter(Boolean);

  if (flags.length === 0) {
    return <span className="text-slate-600">—</span>;
  }

  return (
    <span className="capitalize">{flags.join(" · ")}</span>
  );
}
