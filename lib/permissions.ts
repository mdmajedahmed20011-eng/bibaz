/**
 * BIBAZ — Hierarchical Role-Based Access Control (RBAC)
 * Centralized permissions mapping and verification
 */

import { auth } from "./auth";

export type RoleLevel = "CUSTOMER" | "STAFF" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";

export const ROLE_PERMISSIONS: Record<RoleLevel, string[]> = {
  CUSTOMER: [],
  STAFF: [
    "view_orders",
    "process_orders",
    "update_stock",
    "view_products",
    "view_categories",
    "view_customers",
    "view_coupons",
    "view_reviews",
  ],
  MANAGER: [
    "view_orders",
    "process_orders",
    "update_stock",
    "view_products",
    "view_categories",
    "view_customers",
    "view_coupons",
    "view_reviews",
    "manage_products",
    "manage_categories",
    "view_reports",
    "moderate_reviews",
  ],
  ADMIN: [
    "view_orders",
    "process_orders",
    "manage_orders",
    "update_stock",
    "view_products",
    "view_categories",
    "view_customers",
    "view_coupons",
    "view_reviews",
    "manage_products",
    "manage_categories",
    "view_reports",
    "moderate_reviews",
    "manage_coupons",
    "view_audit_logs",
    "manage_customers",
  ],
  SUPER_ADMIN: ["*"], // Complete access
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: RoleLevel, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes("*");
}

/**
 * Verify permission in Server Actions.
 * Throws an error if authentication fails or permission is denied,
 * which will be caught by the action's try-catch block.
 */
export async function requirePermission(requiredPermission: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const role = (session.user as { role: RoleLevel }).role || "CUSTOMER";
  const isAllowed = hasPermission(role, requiredPermission);

  if (!isAllowed) {
    throw new Error(`Access denied. Insufficient permissions for: ${requiredPermission}`);
  }

  return { userId: session.user.id, role, user: session.user };
}

/**
 * Simple admin role check. Throws if the user is not an admin-level role.
 * Use this for actions that don't need granular permission checks.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const role = (session.user as { role: RoleLevel }).role || "CUSTOMER";
  const adminRoles: RoleLevel[] = ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"];

  if (!adminRoles.includes(role)) {
    throw new Error("Access denied. Admin role required.");
  }

  return { userId: session.user.id, role, user: session.user };
}
