/**
 * BIBAZ — Checkout Form Component
 * Multi-step checkout: Address → Payment → Review → Confirm
 * SOP §২ — Frontend Plan F4.7-F4.13
 *
 * Guest-first: No login required
 * Zod validated address form
 */

"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, calculateDeliveryCharge } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

type CheckoutStep = "address" | "payment" | "review";

interface AddressData {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  area: string;
  postalCode: string;
}

export function CheckoutForm() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<AddressData>({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    area: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getSubtotal();
  const shippingCharge = address.city ? calculateDeliveryCharge(address.city) : 80;
  const total = subtotal + shippingCharge;

  // Validate address form
  const validateAddress = (): boolean => {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};

    if (!address.name.trim()) newErrors.name = "Name is required";
    if (!address.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^(\+880|0)1[3-9]\d{8}$/.test(address.phone.trim()))
      newErrors.phone = "Enter a valid Bangladesh phone number";
    if (!address.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim()))
      newErrors.email = "Enter a valid email address";
    if (!address.street.trim()) newErrors.street = "Street address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.area.trim()) newErrors.area = "Area is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === "address") {
      if (validateAddress()) setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    // TODO: Call server action to create order (Phase 3)
    // Simulating order placement
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setOrderPlaced(true);
    clearCart();
    setIsSubmitting(false);
  };

  // Empty cart redirect
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <div>
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-1">Add items to your cart before checking out.</p>
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

  // Order Success
  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
        <p className="text-muted-foreground">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <p className="text-sm text-muted-foreground">
          Order Number: <span className="font-mono font-medium">ORD-2026-00001</span>
        </p>
        <div className="pt-4 space-y-2">
          <Link
            href="/track-order"
            className="flex items-center justify-center w-full h-11 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
          >
            Track Your Order
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center w-full h-10 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
      {/* Left: Form Steps */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`font-medium ${step === "address" ? "text-foreground" : "text-muted-foreground"}`}
          >
            1. Address
          </span>
          <span className="text-muted-foreground">→</span>
          <span
            className={`font-medium ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}
          >
            2. Payment
          </span>
          <span className="text-muted-foreground">→</span>
          <span
            className={`font-medium ${step === "review" ? "text-foreground" : "text-muted-foreground"}`}
          >
            3. Review
          </span>
        </div>

        <Separator />

        {/* Step 1: Address */}
        {step === "address" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="01XXXXXXXXX"
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor="street" className="text-sm font-medium">
                  Street Address *
                </label>
                <input
                  id="street"
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="House, Road, Block"
                />
                {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="city" className="text-sm font-medium">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Dhaka"
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="area" className="text-sm font-medium">
                  Area *
                </label>
                <input
                  id="area"
                  type="text"
                  value={address.area}
                  onChange={(e) => setAddress({ ...address, area: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Banani, Gulshan, etc."
                />
                {errors.area && <p className="text-xs text-destructive">{errors.area}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="postalCode" className="text-sm font-medium">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      postalCode: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="1216"
                />
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full md:w-auto h-11 px-8 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === "payment" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Payment Method</h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-muted/30">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                </div>
              </label>

              {/* Future payment methods (disabled for Phase 1) */}
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" value="BKASH" disabled className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">
                    bKash / Nagad{" "}
                    <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Mobile banking payment</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("address")}
                className="h-11 px-6 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="h-11 px-8 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Review Your Order</h2>

            {/* Address Summary */}
            <div className="p-4 rounded-lg border border-border space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Shipping Address</h3>
                <button
                  onClick={() => setStep("address")}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {address.name} · {address.phone}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.street}, {address.area}, {address.city} {address.postalCode}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Payment Method</h3>
                <button
                  onClick={() => setStep("payment")}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
              </p>
            </div>

            {/* Items */}
            <div className="p-4 rounded-lg border border-border space-y-3">
              <h3 className="text-sm font-medium">Items ({items.length})</h3>
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("payment")}
                className="h-11 px-6 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="flex-1 h-11 px-8 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Order Summary (Sticky) */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold">Order Summary</h3>
          <Separator />

          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between">
                <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(shippingCharge)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
