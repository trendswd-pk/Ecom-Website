"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteUser } from "@/app/admin/(panel)/users/actions";
import type { Profile } from "@/types/profile";

type UserRowActionsProps = {
  user: Profile;
  allowView: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
};

const iconButtonBase =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export function UserRowActions({
  user,
  allowView,
  allowEdit,
  allowDelete,
}: UserRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!allowDelete) return;
    const confirmed = window.confirm(
      `Delete user ${user.email}? This cannot be undone.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result.error) {
        window.alert(result.error);
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {allowView ? (
        <Link
          href={`/admin/users/${user.id}`}
          title="View user"
          className={`${iconButtonBase} border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300`}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Link>
      ) : (
        <button
          type="button"
          disabled
          title="View not permitted"
          className={`${iconButtonBase} border-slate-800 text-slate-600`}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </button>
      )}

      {allowEdit ? (
        <Link
          href={`/admin/users/${user.id}/edit`}
          title="Edit user"
          className={`${iconButtonBase} border-slate-700 text-slate-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300`}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      ) : (
        <button
          type="button"
          disabled
          title="Edit not permitted"
          className={`${iconButtonBase} border-slate-800 text-slate-600`}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={!allowDelete || isPending}
        title={allowDelete ? "Delete user" : "Delete requires admin role"}
        className={`${iconButtonBase} border-slate-700 text-slate-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300`}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </button>
    </div>
  );
}
