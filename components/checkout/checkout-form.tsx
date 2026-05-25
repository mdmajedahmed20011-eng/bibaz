"use client";

/* eslint-disable */
/**
 * BIBAZ — Checkout Form Component (Premium v3.0)
 * Ultra-Premium, Interactive Single-Page 2-Column Checkout Dashboard.
 * Specialized for the Bangladeshi Market:
 * - Inside/Outside Dhaka selection dropdown
 * - Phone number validation helper with Bengali trust text
 * - Beautiful custom payment method selector cards with bKash/Nagad visuals
 * - Dynamic coupon recommendation click-to-apply buttons
 * - High-trust security badges and micro-interactions
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, calculateDeliveryCharge } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import {
  ShoppingBag,
  Tag,
  CheckCircle2,
  XCircle,
  X,
  Ticket,
  Truck,
  ShieldCheck,
  CreditCard,
  Lock,
  PhoneCall,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { createOrder } from "@/actions/order.actions";
import { validateCartItems } from "@/actions/validate-cart.actions";
import { validateCoupon } from "@/actions/coupon.actions";

interface AddressData {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  area: string;
  postalCode: string;
}

interface AppliedCoupon {
  code: string;
  type: string;
  value: number;
  label: string;
  discount: number;
}

export function CheckoutForm() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [address, setAddress] = useState<AddressData>({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "Dhaka", // Default to Dhaka for standard pricing
    area: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("ORD-2026-00001");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bibaz_applied_coupon");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setAppliedCoupon(parsed);
        }, 0);
      } catch {
        console.error("Error loading coupon from storage");
      }
    }
  }, []);

  const subtotal = getSubtotal();
  // shipping charge directly updates based on city dropdown selection
  const shippingCharge = calculateDeliveryCharge(address.city);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + shippingCharge - discountAmount);

  // Apply Coupon Handler
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError("");
    setCouponSuccess("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    const res = await validateCoupon(code, subtotal);

    if (!res.success || !res.coupon) {
      setCouponError(res.error || "Invalid coupon code. Please try again.");
      setIsApplyingCoupon(false);
      return;
    }

    const couponData = {
      code,
      type: res.coupon.type,
      value: res.coupon.value,
      label: res.coupon.freeShipping ? "Free Shipping" : "Discount Applied",
      discount: res.coupon.discount,
    };

    setAppliedCoupon(couponData);
    localStorage.setItem("bibaz_applied_coupon", JSON.stringify(couponData));
    setCouponSuccess(`"${code}" applied successfully!`);
    setCouponInput("");
    setIsApplyingCoupon(false);
  };

  // Remove Coupon Handler
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("bibaz_applied_coupon");
    setCouponError("");
    setCouponSuccess("");
    setCouponInput("");
  };

  // Validate fields
  const validateAddress = (): boolean => {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};
    if (!address.name.trim()) newErrors.name = "Full name is required";
    if (!address.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+880|0)1[3-9]\d{8}$/.test(address.phone.trim())) {
      newErrors.phone = "Enter a valid Bangladesh phone number (e.g. 017XXXXXXXX)";
    }
    if (!address.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!address.street.trim()) newErrors.street = "Street address / Delivery point is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.area.trim()) newErrors.area = "Area / Police Station is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) return;
    setIsSubmitting(true);

    // Validate cart items against DB before order to prevent inventory conflicts
    const variantIds = items.map((i) => i.variantId);
    const validation = await validateCartItems(variantIds);

    if (validation.invalidIds && validation.invalidIds.length > 0) {
      for (const invalidId of validation.invalidIds) {
        useCartStore.getState().removeItem(invalidId);
      }
      alert(
        "Some items in your cart are no longer available and have been removed. Please review your order."
      );
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      address,
      paymentMethod,
      items,
      subtotal,
      shippingCharge,
      discount: discountAmount,
      total,
      couponCode: appliedCoupon?.code,
    };

    const res = await createOrder(orderData);

    if (res.success && res.orderNumber) {
      setPlacedOrderNumber(res.orderNumber);
      setOrderPlaced(true);
      clearCart();
      localStorage.removeItem("bibaz_applied_coupon");
    } else {
      alert(res.error || "Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  // Empty cart state
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center max-w-md mx-auto animate-scale-in">
        <div className="relative p-6 rounded-full bg-[#f8f5f0] text-muted-foreground/60 shadow-sm animate-float">
          <ShoppingBag className="h-12 w-12 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Your bag is empty</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
            Please add luxury items to your shopping bag before attempting to checkout.
          </p>
        </div>
        <Link
          href="/collections/new-arrivals"
          className="inline-flex items-center justify-center h-12 px-8 bg-foreground hover:bg-neutral-800 text-background text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm active:scale-95 shadow-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Order Success Screen (Premium invoice-like card layout)
  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-6 space-y-7 border border-[#c9a96e]/30 bg-gradient-to-br from-white to-[#fdfcfa] shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-lg animate-scale-in">
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-inner">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Order Confirmed!
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest max-w-md mx-auto leading-relaxed font-semibold">
            Thank you for choosing BIBAZ. Our customer support team will call you shortly to confirm
            your delivery slots.
          </p>
        </div>

        <div className="p-5 bg-[#f8f5f0]/60 border border-border/40 rounded-lg max-w-md mx-auto space-y-4 shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground uppercase tracking-wider font-semibold">
              Order Identifier:
            </span>
            <span className="font-mono font-bold text-foreground bg-white border border-border/40 px-3 py-1 shadow-sm rounded-sm">
              {placedOrderNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground uppercase tracking-wider font-semibold">
              Payment Option:
            </span>
            <span className="font-bold text-foreground uppercase tracking-wider">
              {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground uppercase tracking-wider font-semibold">
              Total Amount:
            </span>
            <span className="font-bold text-foreground text-sm">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="pt-4 max-w-md mx-auto space-y-3">
          <Link
            href="/track-order"
            className="flex items-center justify-center w-full h-12 bg-foreground text-background text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 rounded-sm active:scale-95 shadow-md"
          >
            Track Order Status
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center w-full h-11 border border-border/80 bg-white text-muted-foreground hover:text-foreground hover:bg-neutral-50 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handlePlaceOrder}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto items-start animate-scale-in"
    >
      {/* ── Left Column: Form Details (7 cols) ── */}
      <div className="lg:col-span-7 space-y-8">
        {/* Header indicator */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Secure checkout dashboard
          </h2>
          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider font-bold">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            256-bit encryption
          </div>
        </div>

        {/* Section 1: Delivery Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center size-7 rounded-full bg-foreground text-background text-xs font-bold font-mono shadow-sm">
              1
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Delivery Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-[10px] uppercase tracking-wider text-foreground font-semibold flex items-center gap-1"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-white text-sm transition-all focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent rounded-sm placeholder:text-muted-foreground/30 font-medium text-foreground hover:border-accent/40"
                placeholder="Receiver's Full Name"
              />
              {errors.name && (
                <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-[10px] uppercase tracking-wider text-foreground font-semibold flex items-center gap-1"
              >
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-white text-sm transition-all focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent rounded-sm placeholder:text-muted-foreground/30 font-medium text-foreground hover:border-accent/40"
                placeholder="01XXXXXXXXX"
              />
              {errors.phone ? (
                <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> {errors.phone}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 mt-1 text-emerald-600 bg-emerald-50/50 border border-emerald-100/50 p-2 rounded-sm">
                  <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                  <p className="text-[9px] font-semibold uppercase tracking-wider leading-relaxed">
                    অর্ডার কনফার্ম করতে এই নাম্বারে ফোন করা হবে।
                  </p>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="md:col-span-2 space-y-1.5">
              <label
                htmlFor="email"
                className="text-[10px] uppercase tracking-wider text-foreground font-semibold"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={address.email}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-white text-sm transition-all focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent rounded-sm placeholder:text-muted-foreground/30 font-medium text-foreground hover:border-accent/40"
                placeholder="customer@email.com"
              />
              {errors.email && (
                <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* City (Dropdown selection specialized for BD Shipping) */}
            <div className="space-y-1.5">
              <label
                htmlFor="city"
                className="text-[10px] uppercase tracking-wider text-foreground font-semibold flex items-center gap-1"
              >
                City / Region *
              </label>
              <select
                id="city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-white text-sm transition-all focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent rounded-sm font-semibold text-foreground hover:border-accent/40 cursor-pointer"
              >
                <option value="Dhaka">Dhaka (Inside Dhaka) — ৳80</option>
                <option value="Outside Dhaka">Outside Dhaka — ৳150</option>
              </select>
              {errors.city && (
                <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> {errors.city}
                </p>
              )}
            </div>

            {/* Area */}
            <div className="space-y-1.5">
              <label
                htmlFor="area"
                className="text-[10px] uppercase tracking-wider text-foreground font-semibold flex items-center gap-1"
              >
                Area / Police Station *
              </label>
              <input
                id="area"
                type="text"
                value={address.area}
                onChange={(e) => setAddress({ ...address, area: e.target.value })}
                className="w-full h-11 px-4 border border-border/60 bg-white text-sm transition-all focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent rounded-sm placeholder:text-muted-foreground/30 font-medium text-foreground hover:border-accent/40"
                placeholder="e.g. Gulshan, Mirpur, Savar, etc."
              />
              {errors.area && (
                <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> {errors.area}
                </p>
              )}
            </div>

            {/* Street Address */}
            <div className="md:col-span-2 space-y-1.5">
              <label
                htmlFor="street"
                className="text-[10px] uppercase tracking-wider text-foreground font-semibold flex items-center gap-1"
              >
                Full Address (Road, House, Block/Village) *
              </label>
              <textarea
                id="street"
                rows={2}
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full p-4 border border-border/60 bg-white text-sm transition-all focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent rounded-sm placeholder:text-muted-foreground/30 font-medium text-foreground hover:border-accent/40 resize-none"
                placeholder="House #12, Road #4, Sector #3, Uttara"
              />
              {errors.street && (
                <p className="text-[10px] text-sale font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> {errors.street}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Payment Method */}
        <div className="space-y-6 pt-8 border-t border-border/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center size-7 rounded-full bg-foreground text-background text-xs font-bold font-mono shadow-sm">
              2
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Payment Method
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod("COD")}
              className={`flex flex-col p-5 border transition-all cursor-pointer rounded-lg relative overflow-hidden select-none ${
                paymentMethod === "COD"
                  ? "border-accent bg-[#fcf9f2] ring-1 ring-accent"
                  : "border-border/60 hover:bg-[#fcfcfc] hover:border-accent/40"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Truck className="h-4.5 w-4.5" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Cash on Delivery
                  </span>
                </div>
                <div
                  className={`size-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === "COD"
                      ? "border-accent bg-accent"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {paymentMethod === "COD" && <div className="size-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                Pay in cash when our delivery professional reaches your address. Fully secure.
              </p>
            </div>

            {/* bKash / Nagad Wallet */}
            <div className="flex flex-col p-5 border border-border/30 bg-neutral-50/50 opacity-60 cursor-not-allowed rounded-lg relative overflow-hidden select-none">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                    <CreditCard className="h-4.5 w-4.5" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    bKash / Nagad / Card
                  </span>
                </div>
                <span className="text-[8px] bg-foreground/5 text-foreground/50 px-2 py-0.5 font-bold uppercase tracking-widest rounded-sm border border-border/20">
                  Soon
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                Secure online payment gateway with bKash, Nagad, and local cards will be launched
                shortly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Column: Sticky Order Summary (5 cols) ── */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 bg-[#fbf9f5] border border-[#c9a96e]/20 p-6 md:p-8 rounded-lg shadow-sm space-y-6">
          <div className="flex items-baseline justify-between border-b border-border/30 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Order Summary
            </h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold bg-white px-2.5 py-1 border border-border/20 rounded-full shadow-2xs">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {/* Items Listing Compact */}
          <div className="divide-y divide-border/20 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                <div className="relative h-14 w-11 shrink-0 bg-white border border-border/40 overflow-hidden rounded-xs shadow-3xs">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-xs font-heading font-semibold text-foreground line-clamp-1 leading-tight">
                    {item.productName}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] uppercase tracking-wider bg-white text-muted-foreground px-1.5 py-0.5 border border-border/20 font-semibold rounded-xs shadow-3xs">
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

          {/* Coupon Code Section */}
          <div className="space-y-3 py-1">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
                Apply Promo / Coupon Code
              </span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between gap-3 p-3 bg-accent/5 border border-accent/25 rounded-md animate-scale-in">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-accent animate-pulse" />
                  <div>
                    <p className="text-[11px] font-bold text-accent uppercase tracking-wider font-mono">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                      {appliedCoupon.label}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground hover:text-sale transition-colors font-bold cursor-pointer bg-white px-2 py-1 border border-border/30 shadow-3xs hover:border-sale/30 rounded-xs"
                >
                  <X className="h-3 w-3 text-sale" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError("");
                        setCouponSuccess("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      className="w-full h-10 pl-9 pr-3 border border-border/50 bg-white text-[11px] transition-all focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-muted-foreground/30 font-mono font-bold uppercase tracking-widest text-foreground rounded-sm"
                      placeholder="ENTER PROMO CODE"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplyingCoupon}
                    className="h-10 px-4 bg-foreground hover:bg-neutral-800 text-background text-[10px] font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap rounded-sm shadow-sm"
                  >
                    {isApplyingCoupon ? "..." : "Apply"}
                  </button>
                </div>

                {/* Recommend Click-to-Apply Coupons for high conversion */}
                <div className="space-y-1.5">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Available Offers (Tap to apply):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("BIBAZ10")}
                      className="text-[9px] font-mono font-bold px-2.5 py-1 bg-white border border-dashed border-accent text-accent hover:bg-accent/5 rounded-xs transition-all shadow-3xs cursor-pointer active:scale-95"
                    >
                      BIBAZ10 (10% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("EID2026")}
                      className="text-[9px] font-mono font-bold px-2.5 py-1 bg-white border border-dashed border-accent text-accent hover:bg-accent/5 rounded-xs transition-all shadow-3xs cursor-pointer active:scale-95"
                    >
                      EID2026 (Flat ৳200)
                    </button>
                  </div>
                </div>

                {couponError && (
                  <div className="flex items-center gap-1.5 text-sale animate-[fadeIn_0.2s_ease-out]">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    <p className="text-[9px] font-bold uppercase tracking-wider">{couponError}</p>
                  </div>
                )}

                {couponSuccess && (
                  <div className="flex items-center gap-1.5 text-accent animate-[fadeIn_0.2s_ease-out]">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <p className="text-[9px] font-bold uppercase tracking-wider">{couponSuccess}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator className="opacity-50" />

          {/* Money Totals */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span className="uppercase tracking-wider">Subtotal</span>
              <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="uppercase tracking-wider">Delivery Charge</span>
              <span className="font-semibold text-foreground">{formatPrice(shippingCharge)}</span>
            </div>

            {appliedCoupon && discountAmount > 0 && (
              <div className="flex justify-between text-accent animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-1.5">
                  <Ticket className="h-3 w-3" />
                  <span className="uppercase tracking-wider font-bold">
                    Discount ({appliedCoupon.code})
                  </span>
                </div>
                <span className="font-bold">-{formatPrice(discountAmount)}</span>
              </div>
            )}
          </div>

          <Separator className="opacity-50" />

          {/* Grand Total */}
          <div className="flex justify-between text-foreground">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Grand Total</span>
            <div className="text-right">
              <span className="text-lg font-bold tracking-tight text-foreground">
                {formatPrice(total)}
              </span>
              {appliedCoupon && discountAmount > 0 && (
                <p className="text-[9px] text-accent uppercase tracking-wider font-bold mt-0.5">
                  You save {formatPrice(discountAmount)}!
                </p>
              )}
            </div>
          </div>

          {/* Confirm Checkout Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center w-full h-13 bg-foreground hover:bg-neutral-800 text-background font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-40 cursor-pointer shadow-md rounded-sm active:scale-98 animate-pulse-glow"
          >
            {isSubmitting ? "Processing Luxury Order..." : "Confirm & Place Order"}
          </button>

          {/* Trust assurances for Bangladeshi consumers */}
          <div className="pt-2 grid grid-cols-2 gap-3 border-t border-border/20">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-semibold leading-normal">
                100% Genuine Fabrics
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-accent shrink-0" />
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-semibold leading-normal">
                No Prepayment Needed
              </span>
            </div>
          </div>

          <p className="text-[8px] text-muted-foreground text-center uppercase tracking-widest leading-relaxed mt-2.5">
            By confirming you agree to our terms & refund policies. Safe guest checkout.
          </p>
        </div>
      </div>
    </form>
  );
}
