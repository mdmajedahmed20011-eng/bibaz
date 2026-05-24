"use client";

/**
 * BIBAZ — Admin Sidebar Navigation
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  role: string;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
    roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "Audit Log",
    href: "/admin/audit-log",
    icon: Shield,
    roles: ["SUPER_ADMIN"],
  },
];

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        {!collapsed && (
          <Link href="/admin" className="text-xl font-bold text-gray-900">
            BIBAZ
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="text-lg font-bold text-gray-900">
            B
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        {!collapsed && <p className="text-xs text-gray-400">BIBAZ Admin v1.0</p>}
      </div>
    </aside>
  );
}
