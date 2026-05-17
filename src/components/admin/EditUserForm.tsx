"use client";

import { useActionState } from "react";
import {
  updateUser,
  type UserActionState,
} from "@/app/admin/(panel)/users/actions";
import type { Profile, UserRole } from "@/types/profile";

const initialState: UserActionState = {};

const roles: UserRole[] = ["admin", "editor", "viewer"];

const inputClassName =
  "rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white";

type EditUserFormProps = {
  user: Profile;
};

export function EditUserForm({ user }: EditUserFormProps) {
  const [state, formAction, isPending] = useActionState(updateUser, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="userId" value={user.id} />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={user.email}
          disabled
          className={`${inputClassName} mt-1 w-full opacity-60`}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-300">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue={user.role}
          className={`${inputClassName} mt-1 w-full`}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-3 rounded-lg border border-slate-800 p-4">
        <legend className="px-1 text-sm font-medium text-slate-300">
          Permissions
        </legend>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="can_view"
            defaultChecked={user.permissions.can_view}
            className="rounded border-slate-600"
          />
          Can view
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="can_edit"
            defaultChecked={user.permissions.can_edit}
            className="rounded border-slate-600"
          />
          Can edit
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="can_delete"
            defaultChecked={user.permissions.can_delete}
            className="rounded border-slate-600"
          />
          Can delete (UI still requires admin role to delete users)
        </label>
      </fieldset>

      {state.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
