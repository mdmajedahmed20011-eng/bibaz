/* eslint-disable react-hooks/purity */
/**
 * BIBAZ — Customer Directory with Lifetime Value (LTV) Segmentation
 * SOP §৪ — High-end customer details, spend calculations, and dynamic tier badges
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Award, DollarSign, Package, Calendar } from "lucide-react";

export default async function AdminCustomersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    redirect("/admin");
  }

  // Fetch customers with their successful orders to calculate total LTV spend
  const rawCustomers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      orders: {
        where: {
          status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        },
        select: {
          total: true,
        },
      },
      _count: { select: { orders: true } },
    },
  });

  // Calculate dynamic LTV and tiering for each customer
  const customers = rawCustomers.map((c) => {
    const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.total), 0);
    const orderCount = c._count.orders;
    const joinedDaysAgo = Math.floor(
      (Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    let tier = "New";
    let tierColor = "bg-emerald-50 text-emerald-700 border-emerald-200";

    if (totalSpent >= 15000 || orderCount >= 5) {
      tier = "VIP";
      tierColor = "bg-amber-50 text-amber-700 border-amber-200 font-bold";
    } else if (totalSpent >= 2000) {
      tier = "Regular";
      tierColor = "bg-blue-50 text-blue-700 border-blue-200";
    } else if (orderCount === 0 && joinedDaysAgo > 90) {
      tier = "Dormant";
      tierColor = "bg-rose-50 text-rose-700 border-rose-200";
    } else if (orderCount > 0) {
      tier = "Regular";
      tierColor = "bg-blue-50 text-blue-700 border-blue-200";
    }

    return {
      ...c,
      totalSpent,
      tier,
      tierColor,
    };
  });

  // Calculate high-level customer segment summaries
  const totalCustomersCount = customers.length;
  const vipCount = customers.filter((c) => c.tier === "VIP").length;
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpendPerCustomer =
    totalCustomersCount > 0 ? Math.round(totalSpentAll / totalCustomersCount) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-gray-800" />
            Customer Management Suite
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor client acquisition, order metrics, and Lifetime Value (LTV) segmentation.
          </p>
        </div>
      </div>

      {/* Segment Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400">Total Customer Directory</span>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalCustomersCount}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400">Elite VIP Segments</span>
            <p className="mt-1 text-2xl font-bold text-amber-600">{vipCount}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400">Average Spend (AOV) / User</span>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              ৳{avgSpendPerCustomer.toLocaleString("en-BD")}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Customer Registry Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 sm:px-6 flex items-center justify-between bg-gray-50/40">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Registered Accounts</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Showing latest {customers.length} profiles
            </p>
          </div>
          <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-mono text-gray-600">
            CUSTOMER REGISTRY
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-450 bg-gray-50/20">
                <th className="px-6 py-3">Client Profile</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Mobile Contact</th>
                <th className="px-6 py-3 text-center">Tiers</th>
                <th className="px-6 py-3 text-center">Orders Count</th>
                <th className="px-6 py-3 text-right">Lifetime Spent (LTV)</th>
                <th className="px-6 py-3 text-right">Acquisition Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-gray-900">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-gray-550">{customer.email}</td>
                    <td className="px-6 py-3.5 font-mono text-gray-550">{customer.phone || "—"}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className={`inline-flex rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${customer.tierColor}`}
                      >
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center font-bold text-gray-900">
                      <span className="inline-flex items-center gap-1 justify-center rounded-lg bg-gray-50 px-2 py-1 border border-gray-100">
                        <Package className="h-3 w-3 text-gray-450" />
                        {customer._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-emerald-600 font-mono">
                      ৳{customer.totalSpent.toLocaleString("en-BD")}
                    </td>
                    <td className="px-6 py-3.5 text-right text-gray-500 font-mono">
                      <span className="flex items-center justify-end gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-350" />
                        {new Date(customer.createdAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
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
