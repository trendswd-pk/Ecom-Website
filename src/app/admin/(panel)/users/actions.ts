"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdminProfile } from "@/lib/admin/currentUser";
import { isAdminAuthenticated } from "@/lib/admin/session";
import {
  canDelete as userCanDelete,
  canEdit as userCanEdit,
  isValidRole,
} from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/server";
import type { UserPermissions, UserRole } from "@/types/profile";

export type UserActionState = {
  error?: string;
  success?: boolean;
};

export async function deleteUser(userId: string): Promise<UserActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const currentUser = await getCurrentAdminProfile();
  if (!currentUser || !userCanDelete(currentUser)) {
    return { error: "You do not have permission to delete users." };
  }

  if (userId === currentUser.id) {
    return { error: "You cannot delete your own account." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete user.";
    return { error: message };
  }
}

export async function updateUser(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const currentUser = await getCurrentAdminProfile();
  if (!currentUser || !userCanEdit(currentUser)) {
    return { error: "You do not have permission to edit users." };
  }

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  const canView = formData.get("can_view") === "on";
  const canEdit = formData.get("can_edit") === "on";
  const canDeletePermission = formData.get("can_delete") === "on";

  if (!userId) {
    return { error: "User ID is required." };
  }

  if (!isValidRole(role)) {
    return { error: "Invalid role selected." };
  }

  const permissions: UserPermissions = {
    can_view: canView,
    can_edit: canEdit,
    can_delete: canDeletePermission,
  };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role: role as UserRole, permissions })
      .eq("id", userId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath(`/admin/users/${userId}/edit`);
    redirect("/admin/users");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update user.";
    return { error: message };
  }
}
