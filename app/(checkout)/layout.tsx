/**
 * BIBAZ — Checkout Layout
 * Isolated layout (no full header/footer — focused checkout flow)
 * SOP §২ — Frontend Plan PAGE 5
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <Link href="/" className="text-xl font-bold tracking-tight">
            BIBAZ
          </Link>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Minimal Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} BIBAZ. Secure checkout.{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms
            </Link>{" "}
            ·{" "}
            <Link href="/refund-policy" className="underline hover:text-foreground">
              Refund Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
