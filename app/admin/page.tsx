/**
 * BIBAZ — Admin Dashboard
 * SOP §৬F — Overview page with stats, charts, recent orders
 */

import { getAdminDashboardStats } from "@/actions/order.actions";
import { ShoppingCart, DollarSign, Package, Users, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardStats();

  if (!result.success || !result.stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { stats } = result;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders.toString()}
          icon={<ShoppingCart className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Today's Revenue"
          value={`৳${stats.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={<Clock className="h-5 w-5" />}
          color="yellow"
          href="/admin/orders?status=PENDING"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
          href="/admin/products?stock=low"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={`৳${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={<Package className="h-5 w-5" />}
          color="purple"
          href="/admin/products"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          icon={<Users className="h-5 w-5" />}
          color="indigo"
          href="/admin/customers"
        />
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{order.guestName || "—"}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      ৳{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
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
// Sub-components
// ═══════════════════════════════════════════

function StatCard({
  title,
  value,
  icon,
  color,
  href,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
  href?: string;
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </Wrapper>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-indigo-100 text-indigo-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURNED: "bg-orange-100 text-orange-700",
    REFUNDED: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    UNPAID: "bg-red-100 text-red-700",
    PAID: "bg-green-100 text-green-700",
    PARTIALLY_REFUNDED: "bg-orange-100 text-orange-700",
    REFUNDED: "bg-gray-100 text-gray-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
