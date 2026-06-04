/**
 * BIBAZ — Admin Dashboard (Advanced)
 * Premium dashboard with stats, quick actions, recent activity, revenue overview
 */

import { getAdminDashboardStats, getDashboardAnalytics } from "@/actions/order.actions";
import {
  getVisitorStats,
  getConversionStats,
  getDeviceBreakdown,
  getTopPages,
} from "@/actions/analytics.actions";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { QuickStockUpdate } from "@/components/admin/quick-stock-update";
import { prisma } from "@/lib/db";
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Plus,
  Eye,
  RefreshCw,
  Users,
  TrendingUp,
  FileText,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import {
  StatCard,
  QuickStatCard,
  VisitorStatCard,
  DeviceBreakdownChart,
  TopPagesList,
  StaggeredGrid,
} from "@/components/admin/dashboard-ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardStats();
  const analyticsResult = await getDashboardAnalytics("7d");

  // Visitor analytics (fail silently if tables don't exist yet)
  const [visitorResult, conversionResult, deviceResult, topPagesResult] = await Promise.allSettled([
    getVisitorStats(),
    getConversionStats(),
    getDeviceBreakdown(),
    getTopPages(),
  ]);

  const visitors =
    visitorResult.status === "fulfilled" && visitorResult.value.success
      ? visitorResult.value.data
      : null;
  const conversion =
    conversionResult.status === "fulfilled" && conversionResult.value.success
      ? conversionResult.value.data
      : null;
  const devices =
    deviceResult.status === "fulfilled" && deviceResult.value.success
      ? deviceResult.value.data
      : [];
  const topPages =
    topPagesResult.status === "fulfilled" && topPagesResult.value.success
      ? topPagesResult.value.data
      : [];

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

  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stock: { lt: 5 }, isActive: true },
    include: { product: { select: { name: true } } },
    orderBy: { stock: "asc" },
    take: 5,
  });

  const chartData = (analyticsResult.success ? analyticsResult.dataPoints || [] : []) as {
    label: string;
    revenue: number;
    count: number;
  }[];

  return (
    <div className="space-y-6 pb-20 lg:pb-6 overflow-hidden">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Overview</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/30 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">New</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-white hover:shadow-md active:scale-[0.98]"
          >
            <Eye className="h-4 w-4" />
            Orders
          </Link>
        </div>
      </div>

      {/* Primary Stats — 4 cards (Staggered Animation via Framer Motion) */}
      <StaggeredGrid className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders.toString()}
          icon={<ShoppingCart className="h-5 w-5" />}
          trend={stats.todayOrders > 0 ? "up" : "neutral"}
          trendValue={stats.todayOrders > 0 ? `+${stats.todayOrders}` : "0"}
          color="blue"
          href="/admin/orders?date=today"
        />
        <StatCard
          title="Today's Revenue"
          value={`৳${stats.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={stats.todayRevenue > 0 ? "up" : "neutral"}
          trendValue={stats.todayRevenue > 0 ? "Active" : "—"}
          color="emerald"
          href="/admin/reports"
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
      </StaggeredGrid>

      {/* Revenue + Quick Stats Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Overview Card */}
        <div className="lg:col-span-2">
          <DashboardCharts initialData={chartData} />
        </div>

        {/* Quick Stats (Order Summary) & Low Stock Widgets */}
        <StaggeredGrid className="space-y-4 lg:col-span-1">
          <div className="space-y-3">
            <QuickStatCard
              label="Pending Orders"
              value={stats.pendingOrders.toString()}
              icon={<Clock className="h-5 w-5" />}
              href="/admin/orders?status=PENDING"
              color="amber"
            />
            <QuickStatCard
              label="Processing Orders"
              value={stats.processingOrders.toString()}
              icon={<Package className="h-5 w-5" />}
              href="/admin/orders?status=PROCESSING"
              color="indigo"
            />
            <QuickStatCard
              label="Delivered Orders"
              value={stats.deliveredOrders.toString()}
              icon={<ShoppingCart className="h-5 w-5" />}
              href="/admin/orders?status=DELIVERED"
              color="teal"
            />
          </div>

          <QuickStockUpdate initialItems={lowStockVariants} />
        </StaggeredGrid>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100/80 px-5 py-4 sm:px-6 bg-white/40">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">Latest customer orders</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
          >
            View All
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Desktop: Table view */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100/80 text-left bg-gray-50/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Order
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Customer
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">
                  Total
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No orders yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50/60 group">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {order.guestName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900 text-right font-mono">
                      ৳{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* Visitor Analytics Section                    */}
      {/* ═══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-xl p-5 shadow-sm sm:p-7 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="mb-6 relative">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-blue-100/50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            Audience Overview
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Real-time traffic and visitor behavior analysis
          </p>
        </div>

        {/* Visitor Stats Grid (Staggered Animation) */}
        <StaggeredGrid className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6 relative">
          <VisitorStatCard
            label="Today"
            visitors={visitors?.today?.visitors ?? 0}
            views={visitors?.today?.views ?? 0}
          />
          <VisitorStatCard
            label="Yesterday"
            visitors={visitors?.yesterday?.visitors ?? 0}
            views={visitors?.yesterday?.views ?? 0}
          />
          <VisitorStatCard
            label="7 Days"
            visitors={visitors?.sevenDay?.visitors ?? 0}
            views={visitors?.sevenDay?.views ?? 0}
            prevVisitors={visitors?.sevenDay?.prevVisitors}
          />
          <VisitorStatCard
            label="30 Days"
            visitors={visitors?.thirtyDay?.visitors ?? 0}
            views={visitors?.thirtyDay?.views ?? 0}
            prevVisitors={visitors?.thirtyDay?.prevVisitors}
          />
        </StaggeredGrid>

        {/* Conversion + Device Breakdown */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 relative">
          {/* Conversion Rate */}
          <div className="rounded-2xl border border-gray-200/50 bg-white/60 p-5 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-emerald-100/50 rounded-md">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Conversion Rate
              </p>
            </div>
            <p className="text-4xl font-black tracking-tighter text-gray-900">
              {conversion?.conversionRate ?? 0}
              <span className="text-2xl text-gray-400">%</span>
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full mt-3">
              {conversion?.totalOrders ?? 0} orders / {conversion?.totalVisitors ?? 0} visitors
            </p>
          </div>

          {/* Device Breakdown (Recharts Donut) */}
          <div className="rounded-2xl border border-gray-200/50 bg-white/60 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-100/50 rounded-md">
                <Smartphone className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Device Breakdown
              </p>
            </div>
            <DeviceBreakdownChart devices={devices} />
          </div>
        </div>

        {/* Top Pages (Animated Bars) */}
        {topPages && topPages.length > 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200/50 bg-white/60 p-5 shadow-sm relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-indigo-100/50 rounded-md">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Top Visited Pages (7d)
              </p>
            </div>
            <TopPagesList topPages={topPages} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Helpers for badges (Kept Server-Side)
// ═══════════════════════════════════════════
function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100/50 text-amber-700 border-amber-200/50",
    CONFIRMED: "bg-blue-100/50 text-blue-700 border-blue-200/50",
    PROCESSING: "bg-indigo-100/50 text-indigo-700 border-indigo-200/50",
    SHIPPED: "bg-purple-100/50 text-purple-700 border-purple-200/50",
    DELIVERED: "bg-emerald-100/50 text-emerald-700 border-emerald-200/50",
    CANCELLED: "bg-rose-100/50 text-rose-700 border-rose-200/50",
    RETURNED: "bg-orange-100/50 text-orange-700 border-orange-200/50",
    REFUNDED: "bg-gray-100/50 text-gray-700 border-gray-200/50",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${colors[status] || "bg-gray-100/50 text-gray-600 border-gray-200/50"}`}
    >
      {status}
    </span>
  );
}
