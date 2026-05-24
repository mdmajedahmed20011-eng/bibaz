/**
 * BIBAZ — Admin Dashboard (Advanced)
 * Premium dashboard with stats, quick actions, recent activity, revenue overview
 */

import { getAdminDashboardStats } from "@/actions/order.actions";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardStats();

  if (!result.success || !result.stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-gray-600 font-medium">Failed to load dashboard data</p>
        <p className="text-sm text-gray-400 mt-1">Check your database connection</p>
      </div>
    );
  }

  const { stats } = result;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">New</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow active:scale-[0.98]"
          >
            <Eye className="h-3.5 w-3.5" />
            Orders
          </Link>
        </div>
      </div>

      {/* Primary Stats — 4 cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders.toString()}
          icon={<ShoppingCart className="h-5 w-5" />}
          trend={stats.todayOrders > 0 ? "up" : "neutral"}
          trendValue={stats.todayOrders > 0 ? `+${stats.todayOrders}` : "0"}
          color="blue"
        />
        <StatCard
          title="Today's Revenue"
          value={`৳${stats.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={stats.todayRevenue > 0 ? "up" : "neutral"}
          trendValue={stats.todayRevenue > 0 ? "Active" : "—"}
          color="emerald"
        />
        <StatCard
          title="Pending"
          value={stats.pendingOrders.toString()}
          icon={<Clock className="h-5 w-5" />}
          trend={stats.pendingOrders > 3 ? "down" : "neutral"}
          trendValue={stats.pendingOrders > 0 ? "Needs action" : "All clear"}
          color="amber"
          href="/admin/orders?status=PENDING"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={stats.lowStockCount > 0 ? "down" : "neutral"}
          trendValue={stats.lowStockCount > 0 ? "Restock needed" : "Good"}
          color="rose"
          href="/admin/products?stock=low"
        />
      </div>

      {/* Revenue + Quick Stats Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Overview Card */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Total confirmed revenue</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Active</span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-gray-900 sm:text-4xl">
              ৳{stats.totalRevenue.toLocaleString()}
            </p>
            <span className="mb-1 text-xs text-gray-400">total revenue</span>
          </div>
          {/* Mini chart placeholder */}
          <div className="mt-5 flex h-20 items-end gap-1 rounded-lg bg-gray-50 p-3">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-blue-500 to-blue-400 opacity-80 transition-all hover:opacity-100"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <QuickStatCard
            label="Total Products"
            value={stats.totalProducts.toString()}
            icon={<Package className="h-4 w-4" />}
            href="/admin/products"
            color="purple"
          />
          <QuickStatCard
            label="Total Customers"
            value={stats.totalCustomers.toString()}
            icon={<Users className="h-4 w-4" />}
            href="/admin/customers"
            color="indigo"
          />
          <QuickStatCard
            label="Avg Order Value"
            value={
              stats.todayOrders > 0
                ? `৳${Math.round(stats.todayRevenue / stats.todayOrders).toLocaleString()}`
                : "—"
            }
            icon={<TrendingUp className="h-4 w-4" />}
            color="teal"
          />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest customer orders</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-50"
          >
            View All
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mobile: Card view */}
        <div className="divide-y divide-gray-100 sm:hidden">
          {stats.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center py-12 px-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <ShoppingCart className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No orders yet</p>
              <p className="text-xs text-gray-400 mt-1">Orders will appear here</p>
            </div>
          ) : (
            stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 active:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.guestName || "Guest"} •{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ৳{Number(order.total).toLocaleString()}
                  </p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Desktop: Table view */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Payment
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No orders yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-700">{order.guestName || "—"}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">
                      ৳{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3.5">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Components
// ═══════════════════════════════════════════

function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color,
  href,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  color: "blue" | "emerald" | "amber" | "rose";
  href?: string;
}) {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", icon: "bg-rose-100" },
  };

  const trendColors = {
    up: "text-emerald-600",
    down: "text-rose-600",
    neutral: "text-gray-400",
  };

  const Wrapper = href ? Link : "div";

  return (
    <Wrapper
      href={href || ""}
      className="group rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300/80 active:scale-[0.98] sm:p-5"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${colorMap[color].icon} ${colorMap[color].text} sm:h-10 sm:w-10`}
        >
          {icon}
        </div>
        <div className={`flex items-center gap-0.5 text-[11px] font-medium ${trendColors[trend]}`}>
          {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
          {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
          <span className="hidden sm:inline">{trendValue}</span>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-lg font-bold text-gray-900 sm:text-2xl">{value}</p>
        <p className="mt-0.5 text-[11px] font-medium text-gray-500 sm:text-xs">{title}</p>
      </div>
    </Wrapper>
  );
}

function QuickStatCard({
  label,
  value,
  icon,
  href,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
  color: "purple" | "indigo" | "teal";
}) {
  const colorMap = {
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
    teal: "bg-teal-50 text-teal-600",
  };

  const Wrapper = href ? Link : "div";

  return (
    <Wrapper
      href={href || ""}
      className="flex items-center gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </Wrapper>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
    SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
    RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
    REFUNDED: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    UNPAID: "bg-rose-50 text-rose-700 border-rose-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PARTIALLY_REFUNDED: "bg-orange-50 text-orange-700 border-orange-200",
    REFUNDED: "bg-gray-50 text-gray-700 border-gray-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {status}
    </span>
  );
}
