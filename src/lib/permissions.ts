import type { Profile, UserPermissions, UserRole } from "@/types/profile";

export type PermissionSubject = Pick<Profile, "role" | "permissions">;

const DEFAULT_PERMISSIONS: UserPermissions = {
  can_view: true,
  can_edit: false,
  can_delete: false,
};

export function normalizePermissions(
  permissions: UserPermissions | null | undefined,
): UserPermissions {
  return { ...DEFAULT_PERMISSIONS, ...permissions };
}

/** Whether the signed-in user can open user detail views. */
export function canView(subject: PermissionSubject | null): boolean {
  if (!subject) return false;
  if (subject.role === "admin") return true;
  const permissions = normalizePermissions(subject.permissions);
  return permissions.can_view === true;
}

/** Whether the signed-in user can edit other users. */
export function canEdit(subject: PermissionSubject | null): boolean {
  if (!subject) return false;
  if (subject.role === "admin") return true;
  const permissions = normalizePermissions(subject.permissions);
  return permissions.can_edit === true;
}

/**
 * Whether the signed-in user can delete other users.
 * Delete is restricted to the admin role for now.
 */
export function canDelete(subject: PermissionSubject | null): boolean {
  if (!subject) return false;
  return subject.role === "admin";
}

export function isValidRole(role: string): role is UserRole {
  return role === "admin" || role === "editor" || role === "viewer";
}

export function roleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
  };
  return labels[role];
}
