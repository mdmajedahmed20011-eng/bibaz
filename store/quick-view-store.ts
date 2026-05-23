/**
 * BIBAZ — Quick View Store (Zustand)
 * Manages the global state of the Quick View modal
 */

import { create } from "zustand";

export interface QuickViewProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category?: string;
  isNew?: boolean;
  isSoldOut?: boolean;
}

interface QuickViewState {
  isOpen: boolean;
  product: QuickViewProduct | null;
  openQuickView: (product: QuickViewProduct) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
  isOpen: false,
  product: null,
  openQuickView: (product) => set({ isOpen: true, product }),
  closeQuickView: () => set({ isOpen: false, product: null }),
}));
