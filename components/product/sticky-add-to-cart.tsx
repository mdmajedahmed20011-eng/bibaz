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
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-3 safe-area-pb">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold">{formatPrice(price)}</p>
        </div>
        <button
          onClick={onAddToCart}
          disabled={disabled}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 h-11 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          {label}
        </button>
      </div>
    </div>
  );
}
