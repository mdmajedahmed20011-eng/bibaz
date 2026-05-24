/**
 * BIBAZ — Admin Panel Layout
 * SOP §৬F — Admin Dashboard
 * Protected: Only STAFF, MANAGER, ADMIN, SUPER_ADMIN can access
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata = {
  title: "Admin Panel — BIBAZ",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Auth guard — redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Role guard — only admin roles can access
  const role = (session.user as { role?: string }).role;
  const adminRoles = ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"];

  if (!adminRoles.includes(role || "")) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar role={role || "STAFF"} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader userName={session.user.name || "Admin"} userRole={role || "STAFF"} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
