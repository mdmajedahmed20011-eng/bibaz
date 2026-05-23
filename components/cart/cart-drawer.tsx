/**
 * BIBAZ — Cart Drawer (Slide-out)
 * Luxury shopping bag experience with premium spacing and glassmorphism.
 * SOP §২ — Frontend Plan F4.1
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Ticket,
  Tag,
  XCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { COUPON_CODES } from "@/lib/constants";

interface AppliedCoupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  label: string;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Sync coupon state with localStorage on open/close
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("bibaz_applied_coupon");
      setTimeout(() => {
        if (saved) {
          try {
            setAppliedCoupon(JSON.parse(saved));
          } catch {
            console.error("Error parsing saved coupon");
          }
        } else {
          setAppliedCoupon(null);
        }
        setCouponInput("");
        setCouponError("");
        setCouponSuccess("");
      }, 0);
    }
  }, [isOpen]);

  const subtotal = getSubtotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount amount
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, subtotal)
    : 0;

  const total = subtotal - discountAmount;

  // Apply Coupon Handler
  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError("");
    setCouponSuccess("");

    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const found = COUPON_CODES[code as keyof typeof COUPON_CODES];
    if (!found) {
      setCouponError("Invalid coupon code.");
      setIsApplyingCoupon(false);
      return;
    }

    const couponData = { code, ...found };
    setAppliedCoupon(couponData);
    localStorage.setItem("bibaz_applied_coupon", JSON.stringify(couponData));
    setCouponSuccess(`"${code}" applied!`);
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] flex flex-col bg-white border-l border-border/40 p-6 md:p-8 shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
        style={{ backgroundColor: "#fdfcfa" }}
      >
        <SheetHeader className="space-y-1">
          <div className="flex items-baseline justify-between">
            <SheetTitle className="text-lg font-heading font-semibold uppercase tracking-wider text-foreground">
              Shopping Bag
            </SheetTitle>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {itemCount} {itemCount === 1 ? "Item" : "Items"} Selected
          </p>
        </SheetHeader>

        <Separator className="my-4 opacity-50" />

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-10">
            <div className="relative p-6 rounded-full bg-[#f8f5f0] text-muted-foreground/60">
              <ShoppingBag className="h-10 w-10" strokeWidth={1} />
            </div>
            <div>
              <p className="font-heading text-lg font-medium text-foreground">Your bag is empty</p>
              <p className="text-xs text-muted-foreground mt-2 max-w-[240px] mx-auto leading-relaxed">
                Add beautiful garments from our collections to begin your style journey.
              </p>
            </div>
            <button
              onClick={closeCart}
              className="inline-flex items-center justify-center h-11 px-8 border border-foreground bg-transparent text-foreground text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-6 scrollbar-thin">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 group">
                  {/* Item Image */}
                  <div className="relative h-24 w-18 shrink-0 overflow-hidden bg-[#faf9f6] border border-border/40 aspect-[3/4] rounded-none">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productSlug}`}
                          onClick={closeCart}
                          className="text-sm font-medium leading-tight text-foreground hover:text-accent line-clamp-2 transition-colors"
                        >
                          {item.productName}
                        </Link>
                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1 text-muted-foreground hover:text-sale transition-colors cursor-pointer shrink-0"
                          aria-label={`Remove ${item.productName} from cart`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] uppercase tracking-wider bg-[#f8f5f0] text-muted-foreground px-2 py-0.5 font-medium">
                          Size {item.size}
                        </span>
                        {item.color && (
                          <span className="text-[10px] uppercase tracking-wider bg-[#f8f5f0] text-muted-foreground px-2 py-0.5 font-medium">
                            {item.color}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border/60">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="h-8 w-8 flex items-center justify-center text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4 opacity-50" />

            {/* Coupon / Promo Code entry inside Shopping Bag Drawer */}
            <div className="space-y-3.5 py-1">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
                  Promo / Coupon Code
                </span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-3 p-3 border border-accent/30 bg-accent/5 rounded-sm">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-3.5 w-3.5 text-accent" />
                    <div>
                      <p className="text-[11px] font-bold text-accent uppercase tracking-wider leading-none">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none mt-1">
                        {appliedCoupon.label}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground hover:text-sale transition-colors font-bold cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
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
                        className="w-full h-9 pl-9 pr-3 border border-border/50 bg-white text-[11px] transition-all focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground placeholder:text-muted-foreground/30 font-mono font-bold uppercase tracking-widest text-foreground"
                        placeholder="ENTER CODE"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="h-9 px-4 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-foreground/85 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap rounded-none shrink-0"
                    >
                      {isApplyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>

                  {/* Error / Success messages */}
                  {couponError && (
                    <div className="flex items-center gap-1.5 text-sale animate-[fadeIn_0.2s_ease-out]">
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      <p className="text-[9px] font-bold uppercase tracking-wider">{couponError}</p>
                    </div>
                  )}

                  {couponSuccess && (
                    <div className="flex items-center gap-1.5 text-accent animate-[fadeIn_0.2s_ease-out]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <p className="text-[9px] font-bold uppercase tracking-wider">
                        {couponSuccess}
                      </p>
                    </div>
                  )}

                  {/* Hint */}
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest">
                    Try: <span className="font-mono font-bold text-foreground/40">BIBAZ10</span>,{" "}
                    <span className="font-mono font-bold text-foreground/40">EID2026</span>
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-4 opacity-50" />

            {/* Cart Summary */}
            <div className="pt-2 space-y-4">
              {appliedCoupon && discountAmount > 0 ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-semibold">
                      Subtotal
                    </span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-accent animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex items-center gap-1.5">
                      <Ticket className="h-3.5 w-3.5" />
                      <span className="uppercase tracking-widest text-[10px] font-bold">
                        Coupon ({appliedCoupon.code})
                      </span>
                    </div>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-border/40">
                    <span className="text-foreground uppercase tracking-widest text-[10px] font-bold">
                      Total
                    </span>
                    <span className="font-semibold text-base text-foreground">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
                    Subtotal
                  </span>
                  <span className="font-semibold text-base text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-relaxed">
                Taxes & shipping calculated at checkout. Free shipping on orders over ৳10,000.
              </p>

              <div className="space-y-2 mt-4">
                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full h-12 bg-foreground text-background font-bold text-xs uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all duration-300"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="flex items-center justify-center w-full h-11 border border-border/80 bg-transparent text-muted-foreground hover:text-foreground hover:bg-neutral-50 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
                >
                  Close Bag
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
