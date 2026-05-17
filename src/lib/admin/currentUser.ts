import { createClient } from "@/lib/supabase/server";
import { normalizePermissions } from "@/lib/permissions";
import type { Profile, UserRole } from "@/types/profile";

function mapRow(row: {
  id: string;
  email: string;
  role: string;
  permissions: unknown;
  created_at?: string;
  updated_at?: string;
}): Profile {
  const role = row.role as UserRole;
  const permissions =
    row.permissions && typeof row.permissions === "object"
      ? (row.permissions as Profile["permissions"])
      : {};

  return {
    id: row.id,
    email: row.email,
    role,
    permissions: normalizePermissions(permissions),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** Profile for the currently signed-in Supabase Auth user. */
export async function getCurrentAdminProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, permissions, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapRow(data);
}
