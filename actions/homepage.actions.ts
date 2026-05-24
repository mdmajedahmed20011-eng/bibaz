"use server";

/**
 * BIBAZ — Homepage Builder Server Actions
 * Admin controls homepage sections dynamically
 */

import { prisma } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ═══════════════════════════════════════════
// PUBLIC — Get homepage sections (for storefront)
// ═══════════════════════════════════════════

/**
 * Get all active homepage sections (ordered)
 */
export async function getHomepageSections() {
  try {
    const sections = await db.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return { success: true, sections };
  } catch (error) {
    console.error("[HOMEPAGE] getHomepageSections error:", error);
    return { success: false, sections: [] };
  }
}

// ═══════════════════════════════════════════
// ADMIN — Manage homepage sections
// ═══════════════════════════════════════════

/**
 * Get all sections including inactive (Admin)
 */
export async function getAdminHomepageSections() {
  const session = await auth();
  if (!session?.user) return { success: false, sections: [] };

  const role = (session.user as { role?: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return { success: false, sections: [], error: "Insufficient permissions" };
  }

  try {
    const sections = await db.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return { success: true, sections };
  } catch (error) {
    console.error("[HOMEPAGE] getAdminHomepageSections error:", error);
    return { success: false, sections: [] };
  }
}

/**
 * Create a homepage section (Admin)
 */
export async function createHomepageSection(data: {
  type: string;
  title?: string;
  subtitle?: string;
  content?: object;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    // Get max sort order
    const maxOrder = await db.homepageSection.aggregate({
      _max: { sortOrder: true },
    });

    const section = await db.homepageSection.create({
      data: {
        type: data.type,
        title: data.title,
        subtitle: data.subtitle,
        content: (data.content || {}) as object,
        sortOrder: data.sortOrder ?? (maxOrder._max.sortOrder || 0) + 1,
        isActive: data.isActive ?? true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id as string,
        action: "CREATE_HOMEPAGE_SECTION",
        entity: "HomepageSection",
        entityId: section.id,
        newValue: { type: section.type, title: section.title },
      },
    });

    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true, section };
  } catch (error) {
    console.error("[HOMEPAGE] createHomepageSection error:", error);
    return { success: false, error: "Failed to create section" };
  }
}

/**
 * Update a homepage section (Admin)
 */
export async function updateHomepageSection(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    content?: object;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const section = await db.homepageSection.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content as object | undefined,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id as string,
        action: "UPDATE_HOMEPAGE_SECTION",
        entity: "HomepageSection",
        entityId: section.id,
        newValue: data,
      },
    });

    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true, section };
  } catch (error) {
    console.error("[HOMEPAGE] updateHomepageSection error:", error);
    return { success: false, error: "Failed to update section" };
  }
}

/**
 * Delete a homepage section (Admin)
 */
export async function deleteHomepageSection(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    await db.homepageSection.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id as string,
        action: "DELETE_HOMEPAGE_SECTION",
        entity: "HomepageSection",
        entityId: id,
      },
    });

    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[HOMEPAGE] deleteHomepageSection error:", error);
    return { success: false, error: "Failed to delete section" };
  }
}

/**
 * Reorder homepage sections (Admin)
 */
export async function reorderHomepageSections(orderedIds: string[]) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.homepageSection.update({
        where: { id: orderedIds[i] },
        data: { sortOrder: i + 1 },
      });
    }

    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[HOMEPAGE] reorderHomepageSections error:", error);
    return { success: false, error: "Failed to reorder sections" };
  }
}
