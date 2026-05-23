/**
 * BIBAZ — Cart Drawer (Slide-out)
 * Luxury shopping bag experience with premium spacing and glassmorphism.
 * SOP §২ — Frontend Plan F4.1
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] flex flex-col bg-background/95 backdrop-blur-md border-l border-border/40 p-6 md:p-8 shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
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

            {/* Cart Summary */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">Subtotal</span>
                <span className="font-semibold text-base text-foreground">{formatPrice(subtotal)}</span>
              </div>
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
