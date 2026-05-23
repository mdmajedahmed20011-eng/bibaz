/**
 * BIBAZ — Cart Button with Badge
 * Shows cart icon with item count badge
 */

"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";

export function CartButton() {
    const itemCount = useCartStore((state) => state.getItemCount());

    return (
        <Link
            href="/cart"
            className="relative flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={`Shopping cart, ${itemCount} items`}
        >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
                <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                    {itemCount > 99 ? "99+" : itemCount}
                </Badge>
            )}
        </Link>
    );
}
