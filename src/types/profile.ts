export type UserRole = "admin" | "editor" | "viewer";

export type UserPermissions = {
  can_view?: boolean;
  can_edit?: boolean;
  can_delete?: boolean;
};

export type Profile = {
  id: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  created_at?: string;
  updated_at?: string;
};
