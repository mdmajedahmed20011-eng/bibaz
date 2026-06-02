/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Admin2FAVerify } from "@/components/admin/admin-2fa-verify";

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

  // Double check 2FA status from DB with a runtime self-healing patcher
  let user: { isTwoFactorEnabled: boolean } | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isTwoFactorEnabled: true },
    });
  } catch (dbErr: any) {
    console.log("[DB PATCH] users table query failed, verifying columns...", dbErr.message);
    try {
      // Alter table structure to inject missing 2FA fields dynamically
      await prisma.$executeRawUnsafe(
        "ALTER TABLE users ADD COLUMN `two_factor_secret` VARCHAR(191) NULL, ADD COLUMN `is_two_factor_enabled` TINYINT(1) NOT NULL DEFAULT 0;"
      );
      console.log("[DB PATCH] Successfully altered users table to inject 2FA columns.");
      // Re-query user status
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isTwoFactorEnabled: true },
      });
    } catch (patchErr: any) {
      console.error("[DB PATCH] Failed to execute database alter query:", patchErr.message);
    }
  }

  if (user?.isTwoFactorEnabled) {
    const cookieStore = await cookies();
    const verifiedCookie = cookieStore.get("admin_2fa_verified")?.value;

    // Challenge 2FA if not verified for this session
    if (verifiedCookie !== session.user.id) {
      return <Admin2FAVerify />;
    }
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
