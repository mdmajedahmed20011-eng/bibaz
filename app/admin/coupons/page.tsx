/**
 * BIBAZ — Admin Coupons Page
 */

import { getCoupons, deleteCoupon } from "@/actions/coupon.actions";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminCouponsPage() {
  const result = await getCoupons();
  const coupons = result.coupons || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">Manage discount codes and promotions</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
              <th className="px-6 py-4 font-medium text-gray-900">Code</th>
              <th className="px-6 py-4 font-medium text-gray-900">Type</th>
              <th className="px-6 py-4 font-medium text-gray-900">Value</th>
              <th className="px-6 py-4 font-medium text-gray-900">Min Order</th>
              <th className="px-6 py-4 font-medium text-gray-900">Uses</th>
              <th className="px-6 py-4 font-medium text-gray-900">Expires</th>
              <th className="px-6 py-4 font-medium text-gray-900">Status</th>
              <th className="px-6 py-4 font-medium text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                  No coupons yet. Create your first coupon!
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-mono font-medium text-gray-900">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{coupon.type}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {coupon.type === "PERCENTAGE"
                      ? `${Number(coupon.value)}%`
                      : coupon.type === "FREE_SHIPPING"
                        ? "Free Ship"
                        : `৳${Number(coupon.value)}`}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {coupon.minOrder ? `৳${Number(coupon.minOrder)}` : "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {coupon.usedCount}
                    {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString("en-BD")
                      : "Never"}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deleteCoupon(coupon.id);
                        revalidatePath("/admin/coupons");
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
