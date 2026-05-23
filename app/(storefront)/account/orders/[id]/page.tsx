/**
 * BIBAZ — Order Detail Page
 * Items, status timeline, tracking info
 * SOP §২ — Frontend Plan F5.7
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

// Placeholder order detail
const orderDetail = {
  orderNumber: "ORD-2026-00001",
  date: "May 20, 2026",
  status: "DELIVERED",
  items: [
    {
      id: "1",
      name: "Elegant Black Borka with Gold Embroidery",
      size: "M",
      color: "Black",
      quantity: 1,
      price: 2850,
    },
    {
      id: "2",
      name: "Premium Silk Saree — Royal Blue",
      size: "Free Size",
      color: "Blue",
      quantity: 1,
      price: 4500,
    },
  ],
  subtotal: 7350,
  shipping: 80,
  discount: 0,
  total: 7430,
  address: {
    name: "Habiba Hafiz",
    phone: "+880 1860-744181",
    street: "House 60, Road 10, Block D",
    area: "Banani",
    city: "Dhaka",
    postalCode: "1216",
  },
  paymentMethod: "Cash on Delivery",
  timeline: [
    { status: "Order Placed", date: "May 20, 2026 — 10:30 AM", active: true },
    { status: "Confirmed", date: "May 20, 2026 — 11:00 AM", active: true },
    { status: "Processing", date: "May 20, 2026 — 2:00 PM", active: true },
    { status: "Shipped", date: "May 21, 2026 — 9:00 AM", active: true },
    { status: "Delivered", date: "May 22, 2026 — 3:30 PM", active: true },
  ],
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = await params;

  // TODO: Fetch order from DB using `id` (Phase 3)
  const order = orderDetail;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold font-mono">{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">{order.date}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-green-100 text-green-800">
          {order.status}
        </span>
      </div>

      <Separator />

      {/* Order Timeline */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Order Timeline</h3>
        <div className="space-y-0">
          {order.timeline.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full ${
                    step.active ? "bg-foreground" : "bg-muted-foreground/30"
                  }`}
                />
                {index < order.timeline.length - 1 && (
                  <div
                    className={`w-0.5 h-8 ${
                      step.active ? "bg-foreground" : "bg-muted-foreground/20"
                    }`}
                  />
                )}
              </div>
              <div className="pb-6">
                <p className="text-sm font-medium -mt-0.5">{step.status}</p>
                <p className="text-xs text-muted-foreground">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Items ({order.items.length})</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start p-3 rounded-lg bg-muted/30"
            >
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price)}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p>{order.address.name}</p>
            <p>{order.address.phone}</p>
            <p>{order.address.street}</p>
            <p>
              {order.address.area}, {order.address.city} {order.address.postalCode}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Payment Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">Payment: {order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
