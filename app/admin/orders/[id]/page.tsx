/**
 * BIBAZ — Admin Order Detail Page
 * SOP §৬F — Order detail + status update + timeline
 */

import { getOrderDetail } from "@/actions/order.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { OrderStatusUpdateForm } from "@/components/admin/order-status-form";
import { OrderNotesForm } from "@/components/admin/order-notes-form";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderDetail(id);

  if (!result.success || !result.order) {
    notFound();
  }

  const order = result.order;
  const address = order.shippingAddress as {
    name: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    postalCode: string;
  };

  // Parse initial delivery date and clean notes
  let deliveryDate = "";
  let cleanNotes = order.notes || "";

  if (cleanNotes.startsWith("Estimated Delivery: ")) {
    const match = cleanNotes.match(/^Estimated Delivery: ([^\n]+)\n?([\s\S]*)$/);
    if (match) {
      deliveryDate = match[1] || "";
      cleanNotes = match[2] || "";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column — Order Items + Status Update */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.variant.product.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.variant.size && `Size: ${item.variant.size}`}
                      {item.variant.color && ` • Color: ${item.variant.color}`}
                      {` • SKU: ${item.variant.sku}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ৳{Number(item.unitPrice).toLocaleString()} × {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      ৳{Number(item.totalPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>৳{Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>৳{Number(order.shippingCharge).toLocaleString()}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600">
                    -৳{Number(order.discount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold">
                <span>Total</span>
                <span>৳{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status Update & Delivery Form */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900">Fulfillment Status</h2>
              <OrderStatusUpdateForm orderId={order.id} currentStatus={order.status} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900">Delivery Date & Remarks</h2>
              <OrderNotesForm orderId={order.id} initialNotes={order.notes || ""} />
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((entry, index) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        index === 0 ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                    {index < order.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900">{entry.status}</p>
                    {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
                    <p className="text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Customer Info + Payment */}
        <div className="space-y-6">
          {/* Estimated Delivery Date Badge */}
          {deliveryDate && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                  Estimated Delivery
                </p>
                <p className="text-sm font-bold text-blue-900">
                  {new Date(deliveryDate).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Customer</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{order.guestName || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{order.guestPhone}</p>
              </div>
              {order.guestEmail && (
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.guestEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipping Address</h2>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{address.name}</p>
              <p>{address.street}</p>
              <p>
                {address.area}, {address.city}
              </p>
              <p>{address.postalCode}</p>
              <p className="mt-2 text-gray-500">{address.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "PAID" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {cleanNotes && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Internal Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{cleanNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
