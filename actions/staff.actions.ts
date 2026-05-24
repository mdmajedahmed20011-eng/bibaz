"use server";

/**
 * BIBAZ — Staff Management Server Actions
 * Handles RBAC (Role-Based Access Control) assignments
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getStaffMembers() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, staff };
  } catch (error) {
    console.error("[STAFF] getStaffMembers error:", error);
    return { success: false, error: "Failed to fetch staff" };
  }
}

export async function assignRole(userId: string, newRole: string) {
  const session = await auth();
  const currentUserRole = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole || "")) {
    return { success: false, error: "Unauthorized" };
  }

  const validRoles = ["USER", "STAFF", "MANAGER", "ADMIN"];
  if (!validRoles.includes(newRole) && currentUserRole !== "SUPER_ADMIN") {
    return { success: false, error: "Invalid role assignment" };
  }

  try {
    // Prevent modifying SUPER_ADMIN unless you are SUPER_ADMIN
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (targetUser?.role === "SUPER_ADMIN" && currentUserRole !== "SUPER_ADMIN") {
      return { success: false, error: "Cannot modify SUPER_ADMIN" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any },
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    console.error("[STAFF] assignRole error:", error);
    return { success: false, error: "Failed to assign role" };
  }
}

export async function searchUsersByEmail(emailQuery: string) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return { success: false, error: "Unauthorized" };
  }

  if (emailQuery.length < 3) return { success: true, users: [] };

  try {
    const users = await prisma.user.findMany({
      where: {
        email: { contains: emailQuery },
        role: "USER",
      },
      take: 5,
    });
    return { success: true, users };
  } catch (error) {
    console.error("[STAFF] searchUsersByEmail error:", error);
    return { success: false, error: "Failed to search users" };
  }
}
