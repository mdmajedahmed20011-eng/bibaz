/**
 * BIBAZ — Admin Panel Layout (Advanced)
 * Premium admin experience with responsive sidebar, mobile drawer, breadcrumbs
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export const metadata = {
  title: "Admin Panel — BIBAZ",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = (session.user as { role?: string }).role;
  const adminRoles = ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"];

  if (!adminRoles.includes(role || "")) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc]">
      {/* Desktop Sidebar — hidden on mobile */}
      <div className="hidden lg:block">
        <AdminSidebar role={role || "STAFF"} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader userName={session.user.name || "Admin"} userRole={role || "STAFF"} />

        {/* Mobile Bottom Nav — visible only on mobile */}
        <AdminMobileNav role={role || "STAFF"} />

        {/* Page Content with smooth scroll */}
        <main className="flex-1 overflow-y-auto scroll-smooth px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
