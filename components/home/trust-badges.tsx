/**
 * BIBAZ — Trust Badges (Premium v2.0)
 * Subtle, minimal trust strip
 * Design Guide: Light background, clean icons, generous spacing
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
    <section className="py-8 md:py-10 border-b border-border/50">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center gap-2">
              <badge.icon className="h-5 w-5 text-foreground/60" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-medium text-foreground tracking-wide">{badge.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
