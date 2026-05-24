/**
 * BIBAZ — Admin Reports Page
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    redirect("/admin");
  }

  // Get basic report data
  const [totalOrders, totalRevenue, ordersByStatus, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.orderItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">Sales and performance analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            ৳{Number(totalRevenue._sum.total || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            ৳
            {totalOrders > 0
              ? Math.round(Number(totalRevenue._sum.total || 0) / totalOrders).toLocaleString()
              : "0"}
          </p>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Orders by Status</h2>
        <div className="space-y-2">
          {ordersByStatus.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
            >
              <span className="text-sm text-gray-700">{item.status}</span>
              <span className="text-sm font-medium text-gray-900">{item._count}</span>
            </div>
          ))}
          {ordersByStatus.length === 0 && (
            <p className="text-sm text-gray-500">No order data yet</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Top Selling Products</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No sales data yet</p>
        ) : (
          <div className="space-y-2">
            {topProducts.map((item, index) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <span className="text-sm text-gray-700">
                  #{index + 1} — Variant {item.variantId.slice(0, 8)}...
                </span>
                <span className="text-sm font-medium text-gray-900">{item._sum.quantity} sold</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
