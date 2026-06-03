"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useQuickViewStore } from "@/store/quick-view-store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const openCart = useQuickViewStore((state) => state.openCart);

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Account", href: "/account", icon: User },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the fixed nav */}
      <div className="h-16 md:hidden" />

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-200 bg-white/90 px-2 pb-safe backdrop-blur-lg md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-full w-full flex-col items-center justify-center gap-1 ${
                isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${
                  isActive ? "scale-110 stroke-[2.5px]" : "stroke-[2px]"
                }`}
              />
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Cart Button (opens drawer instead of linking) */}
        <button
          onClick={openCart}
          className="relative flex h-full w-full flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-700 active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 stroke-[2px]" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[9px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </nav>
    </>
  );
}
