/**
 * BIBAZ — Cart Page Content (Client Component)
 * Full cart view with items, coupon, and summary
 * SOP §২ — Frontend Plan F4.2-F4.6
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_CHARGE } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function CartPageContent() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const estimatedShipping = subtotal > 0 ? DELIVERY_CHARGE.DHAKA_INSIDE : 0;
  const total = subtotal + estimatedShipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <div>
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-1">
            Looks like you haven&apos;t added anything yet.
          </p>
        </div>
        <Link
          href="/collections/new-arrivals"
          className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border">
          <span>Product</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
          <span />
        </div>

        {/* Items */}
        {items.map((item) => (
          <div
            key={item.variantId}
            className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_40px] gap-4 items-center py-4 border-b border-border"
          >
            {/* Product Info */}
            <div className="flex gap-4">
              <div className="relative h-24 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="text-sm font-medium leading-snug line-clamp-2 hover:underline"
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " | "}
                  {item.color && `Color: ${item.color}`}
                </p>
                <p className="text-sm font-medium mt-1 md:hidden">{formatPrice(item.price)}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-center">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="h-9 w-9 flex items-center justify-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  disabled={item.quantity >= item.maxStock}
                  className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="text-right">
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>

            {/* Remove */}
            <div className="flex justify-end">
              <button
                onClick={() => removeItem(item.variantId)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${item.productName}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Clear Cart */}
        <div className="pt-2">
          <button
            onClick={clearCart}
            className="text-sm text-muted-foreground hover:text-destructive underline underline-offset-4 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping (estimated)</span>
              <span className="font-medium">{formatPrice(estimatedShipping)}</span>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="h-9 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors">
              Apply
            </button>
          </div>

          <Separator />

          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Final shipping calculated at checkout based on delivery area.
          </p>

          {/* Checkout Button */}
          <Link
            href="/checkout"
            className="flex items-center justify-center w-full h-11 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
          >
            Proceed to Checkout
          </Link>

          {/* Continue Shopping */}
          <Link
            href="/collections/new-arrivals"
            className="flex items-center justify-center w-full h-10 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
