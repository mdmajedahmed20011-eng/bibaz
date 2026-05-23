/**
 * BIBAZ — Storefront Layout
 * Wraps all public-facing pages with Header + Footer + Cart Drawer
 */

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { QuickViewModal } from "@/components/product/quick-view-modal";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <ScrollReveal />
    </>
  );
}
