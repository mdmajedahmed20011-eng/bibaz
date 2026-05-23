/**
 * BIBAZ — Sticky Add to Cart Bar (Mobile)
 * Fixed bottom bar on mobile for quick add to cart
 * SOP §২ — Frontend Plan: "Mobile: Sticky Add to Cart bar at bottom"
 */

"use client";

import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StickyAddToCartProps {
  price: number;
  onAddToCart: () => void;
  disabled: boolean;
  label: string;
}

export function StickyAddToCart({ price, onAddToCart, disabled, label }: StickyAddToCartProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border/40 bg-background/80 backdrop-blur-lg px-5 py-3.5 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] transition-transform duration-300">
      <div className="flex items-center justify-between gap-5 max-w-lg mx-auto">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Total Price</span>
          <span className="text-base font-semibold text-foreground tracking-tight">{formatPrice(price)}</span>
        </div>
        <button
          onClick={onAddToCart}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-foreground text-background text-xs font-bold uppercase tracking-[0.15em] transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4" />
          {label}
        </button>
      </div>
    </div>
  );
}
