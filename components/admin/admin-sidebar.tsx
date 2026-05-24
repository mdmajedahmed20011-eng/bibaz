"use client";

/**
 * BIBAZ — Admin Sidebar Navigation (Advanced)
 * Collapsible, animated, with active indicators and section grouping
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
  Star,
  Store,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  role: string;
}

const navSections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        roles: ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    title: "Storefront",
    items: [
      {
        label: "Collections",
        href: "/admin/collections",
        icon: Sparkles,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "Homepage Banners",
        href: "/admin/homepage",
        icon: Store,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "Bulk Stock",
        href: "/admin/products/bulk-stock",
        icon: SlidersHorizontal,
        roles: ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: Star,
        roles: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },

  {
    title: "Sales",
    items: [
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
      { label: "Coupons", href: "/admin/coupons", icon: Tag, roles: ["ADMIN", "SUPER_ADMIN"] },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        label: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      { label: "Audit Log", href: "/admin/audit-log", icon: Shield, roles: ["SUPER_ADMIN"] },
    ],
  },
];

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-gray-200/80 bg-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center border-b border-gray-100 px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Store className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-gray-900">BIBAZ</span>
              <span className="text-[10px] font-medium text-gray-400">Admin Panel</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-5">
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-600" />
                      )}
                      <item.icon
                        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                          isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-600 hover:shadow"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3">
        {!collapsed ? (
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
            <p className="text-[11px] font-semibold text-blue-900">BIBAZ Admin</p>
            <p className="text-[10px] text-blue-600">v1.1 • Premium Suite Live</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-green-400" title="System Online" />
          </div>
        )}
      </div>
    </aside>
  );
}
