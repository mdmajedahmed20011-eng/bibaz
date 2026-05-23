/**
 * BIBAZ — UI Store (Zustand)
 * Global UI state management
 */

import { create } from "zustand";

interface UIState {
    mobileMenuOpen: boolean;
    searchOpen: boolean;
    filterDrawerOpen: boolean;
    activeModal: string | null;

    // Actions
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    toggleSearch: () => void;
    closeSearch: () => void;
    toggleFilterDrawer: () => void;
    closeFilterDrawer: () => void;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
    mobileMenuOpen: false,
    searchOpen: false,
    filterDrawerOpen: false,
    activeModal: null,

    toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    closeMobileMenu: () => set({ mobileMenuOpen: false }),

    toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
    closeSearch: () => set({ searchOpen: false }),

    toggleFilterDrawer: () =>
        set((state) => ({ filterDrawerOpen: !state.filterDrawerOpen })),
    closeFilterDrawer: () => set({ filterDrawerOpen: false }),

    openModal: (modalId) => set({ activeModal: modalId }),
    closeModal: () => set({ activeModal: null }),
}));
