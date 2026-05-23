/**
 * BIBAZ — Checkout Form Component
 * Premium Single-Page 2-Column Checkout Dashboard.
 * Left Side (60%): Contact & Delivery Information + Payment Options.
 * Right Side (40%): Sticky compact order summary with items and checkout action.
 * Guest-first & fully responsive.
 * SOP §২ — Frontend Plan F4.7-F4.13
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, calculateDeliveryCharge } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

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

  // Validate fields in real-time
  const validateAddress = (): boolean => {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};

    if (!address.name.trim()) newErrors.name = "Full name is required";
    
    if (!address.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+880|0)1[3-9]\d{8}$/.test(address.phone.trim())) {
      newErrors.phone = "Enter a valid Bangladesh phone number";
    }
    
    if (!address.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    
    if (!address.street.trim()) newErrors.street = "Street address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.area.trim()) newErrors.area = "Area is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) return;

    setIsSubmitting(true);
    // Simulating order placement
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setOrderPlaced(true);
    clearCart();
    setIsSubmitting(false);
  };

  // Empty cart redirect
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center max-w-md mx-auto">
        <div className="relative p-6 rounded-full bg-[#f8f5f0] text-muted-foreground/60">
          <ShoppingBag className="h-12 w-12" strokeWidth={1} />
        </div>
        <div>
          <h2 className="text-xl font-heading font-medium text-foreground">Your bag is empty</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Please add items to your shopping bag before attempting to checkout.
          </p>
        </div>
        <Link
          href="/collections/new-arrivals"
          className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-foreground/90 transition-all duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 space-y-6 border border-border/40 bg-[#f8f5f0]/30 shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
        <div className="h-14 w-14 mx-auto rounded-full bg-foreground text-background flex items-center justify-center shadow-sm">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-semibold text-foreground">Order Placed Successfully</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider max-w-sm mx-auto leading-relaxed">
            Thank you for shopping with BIBAZ. Your order has been placed and is currently being processed.
          </p>
        </div>
        
        <Separator className="opacity-50 max-w-md mx-auto" />

        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Order Identifier</p>
          <p className="text-sm font-mono font-bold text-foreground bg-white border border-border/40 inline-block px-4 py-1.5 shadow-sm">
            ORD-2026-89421
          </p>
        </div>
        
        <div className="pt-6 max-w-md mx-auto space-y-2.5">
          <Link
            href="/track-order"
            className="flex items-center justify-center w-full h-12 bg-foreground text-background text-xs font-bold uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all duration-300"
          >
            Track Your Order
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center w-full h-11 border border-border/80 bg-transparent text-muted-foreground hover:text-foreground hover:bg-neutral-50 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto items-start">
      
      {/* Left Column: Form Details (7 cols) */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Section 1: Delivery Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground text-background text-[10px] font-bold font-mono">1</span>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Delivery Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 font-medium text-foreground"
                placeholder="First & Last Name"
              />
              {errors.name && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 font-medium text-foreground"
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.phone}</p>}
            </div>

            {/* Email Address */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={address.email}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 font-medium text-foreground"
                placeholder="customer@email.com"
              />
              {errors.email && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.email}</p>}
            </div>

            {/* Street Address */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="street" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
                Street Address *
              </label>
              <input
                id="street"
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 font-medium text-foreground"
                placeholder="Flat / House, Street / Road, Block"
              />
              {errors.street && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.street}</p>}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label htmlFor="city" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
                City *
              </label>
              <input
                id="city"
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 font-medium text-foreground"
                placeholder="Dhaka, Chattogram, etc."
              />
              {errors.city && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.city}</p>}
            </div>

            {/* Area */}
            <div className="space-y-1.5">
              <label htmlFor="area" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
                Area / PS *
              </label>
              <input
                id="area"
                type="text"
                value={address.area}
                onChange={(e) => setAddress({ ...address, area: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 font-medium text-foreground"
                placeholder="Gulshan, Banani, Mirpur, etc."
              />
              {errors.area && <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1">{errors.area}</p>}
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="postalCode" className="text-[10px] uppercase tracking-wider text-foreground font-semibold">
                Postal Code / ZIP (Optional)
              </label>
              <input
                id="postalCode"
                type="text"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-transparent text-sm transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground bg-[#f8f5f0]/10 hover:bg-[#f8f5f0]/30 rounded-none placeholder:text-muted-foreground/30 font-medium text-foreground"
                placeholder="1212"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Payment Method */}
        <div className="space-y-6 pt-8 border-t border-border/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground text-background text-[10px] font-bold font-mono">2</span>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Payment Method</h2>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {/* COD */}
            <label
              className={`flex items-start gap-4 p-5 border transition-all cursor-pointer rounded-none ${
                paymentMethod === "COD"
                  ? "border-foreground bg-[#f8f5f0]/40"
                  : "border-border/60 hover:bg-neutral-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-0.5 h-4 w-4 text-foreground focus:ring-foreground accent-foreground cursor-pointer"
              />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Cash on Delivery</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Complete your order and pay when the delivery professional arrives at your door.
                </p>
              </div>
            </label>

            {/* bKash (Coming Soon) */}
            <label className="flex items-start gap-4 p-5 border border-border/30 opacity-40 cursor-not-allowed rounded-none">
              <input type="radio" name="payment" value="BKASH" disabled className="mt-0.5 h-4 w-4" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile Wallet Payment</p>
                  <span className="text-[9px] bg-foreground/10 text-foreground px-2 py-0.5 font-bold uppercase tracking-widest leading-none">Soon</span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Pay securely using bKash, Nagad, or Rocket.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky compact order summary & Checkout CTA (5 cols) */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 bg-[#f8f5f0]/40 border border-border/40 p-8 space-y-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Order Summary
            </h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <Separator className="opacity-50" />

          {/* Items Listing Compact */}
          <div className="divide-y divide-border/20 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4 py-4.5 first:pt-0 last:pb-0">
                <div className="relative h-16 w-12 shrink-0 bg-white border border-border/30 aspect-[3/4] rounded-none overflow-hidden animate-fade-in">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      sizes="48px"
                      className="object-cover animate-fade-in"
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-xs font-heading font-semibold text-foreground line-clamp-1 leading-tight">
                    {item.productName}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] uppercase tracking-wider bg-white/70 text-muted-foreground px-1.5 py-0.5 border border-border/20 font-semibold">
                      Size {item.size}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                      × {item.quantity}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator className="opacity-50" />

          {/* Money Totals */}
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground uppercase tracking-wider">Subtotal</span>
              <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground uppercase tracking-wider">Delivery Charge</span>
              <span className="font-semibold text-foreground">
                {address.city ? formatPrice(shippingCharge) : "Enter city to calculate"}
              </span>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Grand total price */}
          <div className="flex justify-between text-foreground">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Grand Total</span>
            <span className="text-base font-bold tracking-tight">{formatPrice(total)}</span>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center w-full h-13 bg-foreground text-background font-bold text-xs uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all duration-300 disabled:opacity-40 cursor-pointer shadow-sm"
          >
            {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
          </button>

          <p className="text-[9px] text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
            By confirming you agree to our terms & refund policies. Safe, encrypted guest checkout.
          </p>
        </div>
      </div>
      
    </form>
  );
}
