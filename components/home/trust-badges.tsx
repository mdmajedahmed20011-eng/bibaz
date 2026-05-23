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
    <section className="bg-surface-warm border-y border-border/40 py-10 md:py-12">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 divide-y lg:divide-y-0 lg:divide-x divide-border/30 reveal">
          {badges.map((badge, i) => (
            <div
              key={badge.title}
              className={`flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 px-4 group transition-all duration-300 ${
                i > 0 && i % 2 === 0 ? "pt-6 sm:pt-0" : ""
              } ${i === 1 ? "pt-0" : ""} lg:pt-0`}
            >
              <div className="flex items-center justify-center size-10 rounded-full bg-white text-foreground/70 group-hover:text-accent group-hover:bg-foreground transition-all duration-500 shadow-sm shrink-0">
                <badge.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground tracking-wide group-hover:text-accent transition-colors duration-300">
                  {badge.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
