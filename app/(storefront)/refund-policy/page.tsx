/**
 * BIBAZ — Refund & Return Policy Page
 * SOP §২ — Frontend Plan F6.4
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description: "BIBAZ refund and return policy.",
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Refund & Return Policy</h1>

        <p className="text-sm text-muted-foreground mb-8">Last updated: May 2026</p>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Return Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We accept returns within 7 days of delivery. Items must be unused, unwashed, and in
              their original packaging with all tags attached.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Conditions for Return</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                Item must be in original, unworn condition
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                All original tags and packaging must be intact
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                Return request must be made within 7 days of delivery
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                Proof of purchase (order number) is required
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Non-Returnable Items</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                Items purchased during sale/clearance
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                Customized or altered items
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                Items with removed tags or damaged packaging
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Refund Process</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once we receive and inspect your returned item, we will process your refund within 3-5
              business days. Refunds will be issued to the original payment method. For COD orders,
              refunds will be sent via bKash/Nagad to your registered phone number.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Exchange</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We offer exchanges for different sizes or colors of the same product, subject to
              availability. Exchange requests follow the same 7-day window and conditions as
              returns.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">How to Request a Return</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Contact us at +880 1860-744181 or email habiba13.hafiz@gmail.com with your order
              number and reason for return. Our team will guide you through the process.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
