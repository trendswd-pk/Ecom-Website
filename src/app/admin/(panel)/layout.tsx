import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdminProfile } from "@/lib/admin/currentUser";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentAdminProfile();

  if (!profile) {
    redirect("/admin/login?error=profile");
  }

  return <AdminShell>{children}</AdminShell>;
}
