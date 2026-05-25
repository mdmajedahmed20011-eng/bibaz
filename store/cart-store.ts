/**
 * BIBAZ — Cart Store (Zustand)
 * SOP §৬C — Shopping Cart State Management
 *
 * Guest: localStorage-based
 * Logged-in: Synced to database
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItemData {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantSku: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

interface CartState {
  items: CartItemData[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItemData) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;

  // Direct mutators for sync
  setItems: (items: CartItemData[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.variantId === item.variantId);

          if (existingIndex > -1) {
            // Update quantity (max = stock)
            const updated = [...state.items];
            const existing = updated[existingIndex];
            if (existing) {
              const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
              updated[existingIndex] = { ...existing, quantity: newQty };
            }
            return { items: updated };
          }

          // Add new item
          return { items: [...state.items, item] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      setItems: (items) => set({ items }),
    }),
    {
      name: "bibaz-cart", // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
