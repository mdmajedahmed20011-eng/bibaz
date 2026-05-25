"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart-store";
import { syncCart, getCart, updateFullCart } from "@/actions/cart.actions";

export function CartSyncManager({ userId }: { userId: string | undefined }) {
  const { items, setItems } = useCartStore();
  const isInitialized = useRef(false);
  const previousItemsStr = useRef("");

  useEffect(() => {
    if (!userId) return; // Only sync for logged in users

    const initCart = async () => {
      // 1. Sync any guest items in localStorage before login
      if (items.length > 0 && !isInitialized.current) {
        await syncCart(items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })));
      }

      // 2. Fetch the true source of truth from DB
      const res = await getCart();
      if (res.success && res.cart) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbItems = res.cart.items.map((ci: any) => ({
          variantId: ci.variantId,
          productId: ci.variant.product.id,
          productName: ci.variant.product.name,
          productSlug: ci.variant.product.slug,
          variantSku: ci.variant.sku || "",
          size: ci.variant.size,
          color: ci.variant.color,
          price: Number(ci.variant.price || 0),
          quantity: ci.quantity,
          image: ci.variant.images?.[0] || "",
          maxStock: ci.variant.stock,
        }));
        setItems(dbItems);
        previousItemsStr.current = JSON.stringify(dbItems);
      }
      isInitialized.current = true;
    };

    if (!isInitialized.current) {
      initCart();
    }
  }, [userId, setItems]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isInitialized.current || !userId) return;

    const currentItemsStr = JSON.stringify(items);
    if (currentItemsStr === previousItemsStr.current) return;

    // Changes detected! Sync to DB
    previousItemsStr.current = currentItemsStr;
    const timeout = setTimeout(() => {
      updateFullCart(items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })));
    }, 1000); // debounce 1s

    return () => clearTimeout(timeout);
  }, [items, userId]);

  return null;
}
