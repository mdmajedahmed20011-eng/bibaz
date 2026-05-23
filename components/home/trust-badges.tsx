/**
 * BIBAZ — Trust Badges Section
 * Shows delivery, COD, quality guarantees
 * Builds customer confidence
 */

import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Dhaka ৳80 | Outside ৳150",
  },
  {
    icon: CreditCard,
    title: "Cash on Delivery",
    description: "Pay when you receive",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Handpicked fabrics",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <badge.icon className="h-5 w-5 shrink-0 text-foreground/70" />
              <div>
                <p className="text-xs md:text-sm font-medium text-foreground">{badge.title}</p>
                <p className="text-[11px] md:text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
