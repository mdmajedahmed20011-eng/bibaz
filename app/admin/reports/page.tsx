/**
 * BIBAZ — Admin Reports & Premium Sales Analytics
 * SOP §৪ — High-end analytics, LTV calculation, and product variant resolution
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  BarChart3,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { ReportExportButton } from "@/components/admin/report-export-button";

export default async function AdminReportsPage(props: {
  searchParams?: Promise<{ range?: string }>;
}) {
  const searchParams = await props.searchParams;
  const range = searchParams?.range || "all";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dateFilter: any = {};
  if (range === "7d") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    dateFilter.createdAt = { gte: d };
  } else if (range === "30d") {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    dateFilter.createdAt = { gte: d };
  } else if (range === "this_year") {
    const d = new Date(new Date().getFullYear(), 0, 1);
    dateFilter.createdAt = { gte: d };
  }

  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    redirect("/admin");
  }

  // Fetch report metrics in a single transactional-safe parallel block
  const [
    totalOrders,
    totalRevenueAgg,
    ordersByStatus,
    topProductsRaw,
    totalProducts,
    totalCustomers,
  ] = await Promise.all([
    prisma.order.count({ where: { deletedAt: null, ...dateFilter } }),
    prisma.order.aggregate({
      where: {
        status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        deletedAt: null,
        ...dateFilter,
      },
      _sum: { total: true },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { deletedAt: null, ...dateFilter },
      _count: true,
    }),
    prisma.orderItem.groupBy({
      by: ["variantId"],
      where: { order: { deletedAt: null, ...dateFilter } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    }),
    prisma.product.count({ where: { deletedAt: null, ...dateFilter } }),
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null, ...dateFilter } }),
  ]);

  const totalRevenue = Number(totalRevenueAgg._sum.total || 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Resolve Variant IDs to actual Product Details (name, sku, size, color, price)
  const variantIds = topProductsRaw.map((item) => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        select: { name: true, slug: true },
      },
    },
  });

  const variantMap = new Map(
    variants.map((v) => [
      v.id,
      {
        name: v.product.name,
        slug: v.product.slug,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: Number(v.price),
      },
    ])
  );

  // Combine raw group sales with detailed metadata
  const topProducts = topProductsRaw.map((item) => {
    const details = variantMap.get(item.variantId);
    return {
      variantId: item.variantId,
      quantitySold: Number(item._sum.quantity || 0),
      name: details?.name || `Variant ${item.variantId.slice(0, 8)}`,
      sku: details?.sku || "N/A",
      size: details?.size || "—",
      color: details?.color || "—",
      price: details?.price || 0,
      totalSalesValue: Number(item._sum.quantity || 0) * (details?.price || 0),
    };
  });

  // Calculate order status metrics with percentage
  const statusConfig: Record<
    string,
    { label: string; icon: React.ReactNode; color: string; bg: string; border: string }
  > = {
    PENDING: {
      label: "Pending Payment",
      icon: <Clock className="h-3.5 w-3.5" />,
      color: "text-amber-600",
      bg: "bg-amber-500",
      border: "border-amber-200",
    },
    CONFIRMED: {
      label: "Confirmed",
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      color: "text-blue-600",
      bg: "bg-blue-500",
      border: "border-blue-200",
    },
    PROCESSING: {
      label: "Processing",
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      color: "text-indigo-600",
      bg: "bg-indigo-500",
      border: "border-indigo-200",
    },
    SHIPPED: {
      label: "Shipped",
      icon: <Truck className="h-3.5 w-3.5" />,
      color: "text-purple-600",
      bg: "bg-purple-500",
      border: "border-purple-200",
    },
    DELIVERED: {
      label: "Delivered",
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-500",
      border: "border-emerald-200",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: <XCircle className="h-3.5 w-3.5" />,
      color: "text-rose-600",
      bg: "bg-rose-500",
      border: "border-rose-200",
    },
    RETURNED: {
      label: "Returned",
      icon: <TrendingDown className="h-3.5 w-3.5" />,
      color: "text-orange-600",
      bg: "bg-orange-500",
      border: "border-orange-200",
    },
    REFUNDED: {
      label: "Refunded",
      icon: <XCircle className="h-3.5 w-3.5" />,
      color: "text-gray-600",
      bg: "bg-gray-500",
      border: "border-gray-200",
    },
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-gray-800" />
            Sales Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time financial performance and product popularity indicators.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            {[
              { id: "all", label: "All Time" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "this_year", label: "This Year" },
            ].map((r) => (
              <Link
                key={r.id}
                href={`/admin/reports?range=${r.id}`}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  range === r.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>
          <ReportExportButton
            data={{ totalRevenue, totalOrders, avgOrderValue, totalCustomers, ordersByStatus }}
          />
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              LTV Revenue
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500">Total Confirmed Revenue</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              ৳{totalRevenue.toLocaleString("en-BD")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Volume
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500">Total Storefront Orders</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              {totalOrders.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Average
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500">Average Order Value (AOV)</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              ৳{avgOrderValue.toLocaleString("en-BD")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Customers
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500">Active Customer Base</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              {totalCustomers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Status Distribution & Top Selling Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Order Status Distribution & Quick Stock Health */}
        <div className="space-y-6 lg:col-span-1">
          {/* Order Status Distribution */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-900">Orders Status Breakdown</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Ratio of orders across all operational stages
              </p>
            </div>
            <div className="space-y-4">
              {ordersByStatus.map((item) => {
                const config = statusConfig[item.status] || {
                  label: item.status,
                  icon: <Package className="h-3.5 w-3.5" />,
                  color: "text-gray-600",
                  bg: "bg-gray-500",
                  border: "border-gray-200",
                };
                const percentage =
                  totalOrders > 0 ? Math.round((item._count / totalOrders) * 100) : 0;

                return (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <span className={config.color}>{config.icon}</span>
                        <span>{config.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {item._count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${config.bg} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {ordersByStatus.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">
                  No order data to display.
                </div>
              )}
            </div>
          </div>

          {/* Quick Catalog Insights */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Catalog Summary</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Quick storefront directory statistics
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-3.5">
                <p className="text-[11px] font-medium text-gray-500">Live Products</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Link
                href="/admin/products"
                className="rounded-xl bg-gray-50 p-3.5 hover:bg-gray-100 transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-gray-500 group-hover:text-gray-700">
                    Manage Catalog
                  </p>
                  <ArrowUpRight className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                </div>
                <p className="mt-1 text-xs font-bold text-blue-600 group-hover:underline">
                  View all →
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Top Selling Products Table */}
        <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Top Selling Products</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Highest performing products by items sold
              </p>
            </div>
            <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              Top Performers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">SKU & Options</th>
                  <th className="px-6 py-3 text-center">Qty Sold</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-right">Gross revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs text-gray-400">
                      No sales data available. Try placing some orders first.
                    </td>
                  </tr>
                ) : (
                  topProducts.map((product) => (
                    <tr key={product.variantId} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="text-xs font-bold text-gray-900 max-w-[200px] truncate">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          ID: {product.variantId.slice(0, 8)}...
                        </p>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="text-[10px] font-mono text-gray-600 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 inline-block">
                          {product.sku}
                        </p>
                        <div className="flex gap-1.5 mt-1 text-[10px] text-gray-400">
                          {product.size && <span>Size: {product.size}</span>}
                          {product.color && <span>• Color: {product.color}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-center text-xs font-bold text-gray-900">
                        {product.quantitySold}
                      </td>
                      <td className="px-6 py-3.5 text-right text-xs text-gray-500 font-mono">
                        ৳{product.price.toLocaleString("en-BD")}
                      </td>
                      <td className="px-6 py-3.5 text-right text-xs font-bold text-emerald-600 font-mono">
                        ৳{product.totalSalesValue.toLocaleString("en-BD")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
