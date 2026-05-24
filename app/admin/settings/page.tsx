/**
 * BIBAZ — Admin Settings Page
 */

import { BUSINESS, DELIVERY_CHARGE, CURRENCY } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Store configuration</p>
      </div>

      {/* Store Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Store Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow label="Store Name" value={BUSINESS.NAME} />
          <InfoRow label="Phone" value={BUSINESS.PHONE} />
          <InfoRow label="Email" value={BUSINESS.EMAIL} />
          <InfoRow label="Currency" value={`${CURRENCY.SYMBOL} (${CURRENCY.CODE})`} />
          <InfoRow label="Address" value={BUSINESS.ADDRESS} className="sm:col-span-2" />
        </div>
      </div>

      {/* Shipping */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipping Zones</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
            <span className="text-sm text-gray-700">Dhaka Inside</span>
            <span className="text-sm font-medium">৳{DELIVERY_CHARGE.DHAKA_INSIDE}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
            <span className="text-sm text-gray-700">Outside Dhaka</span>
            <span className="text-sm font-medium">৳{DELIVERY_CHARGE.OUTSIDE_DHAKA}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          To update shipping charges, edit lib/constants.ts
        </p>
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Methods</h2>
        <div className="space-y-3">
          <PaymentMethodRow name="Cash on Delivery (COD)" enabled={true} phase="Phase 1" />
          <PaymentMethodRow name="bKash" enabled={false} phase="Phase 2" />
          <PaymentMethodRow name="Nagad" enabled={false} phase="Phase 2" />
          <PaymentMethodRow name="SSLCommerz" enabled={false} phase="Phase 3" />
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Social Media</h2>
        <div className="space-y-3">
          <InfoRow label="Facebook" value={BUSINESS.FACEBOOK} />
          <InfoRow label="Instagram" value={BUSINESS.INSTAGRAM} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function PaymentMethodRow({
  name,
  enabled,
  phase,
}: {
  name: string;
  enabled: boolean;
  phase: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
      <div className="flex items-center gap-3">
        <div className={`h-2.5 w-2.5 rounded-full ${enabled ? "bg-green-500" : "bg-gray-300"}`} />
        <span className="text-sm text-gray-700">{name}</span>
      </div>
      <span className="text-xs text-gray-400">{phase}</span>
    </div>
  );
}
