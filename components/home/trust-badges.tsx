"use client";

/**
 * BIBAZ — Trust Badges (Premium v3.0)
 * Animated, mobile-optimized trust strip with staggered reveal
 */

import { useEffect, useRef, useState } from "react";
import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Dhaka ৳80 | Outside ৳150",
    gradient: "from-amber-50 to-orange-50",
  },
  {
    icon: CreditCard,
    title: "Cash on Delivery",
    description: "Pay when you receive",
    gradient: "from-emerald-50 to-teal-50",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Handpicked fabrics",
    gradient: "from-blue-50 to-indigo-50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day return policy",
    gradient: "from-pink-50 to-rose-50",
  },
];

export function TrustBadges() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface-warm border-y border-border/40 py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, i) => (
            <div
              key={badge.title}
              className={`flex flex-col items-center text-center gap-3 p-4 md:p-5 rounded-lg bg-gradient-to-br ${badge.gradient} border border-white/60 shadow-sm transition-all duration-500 hover:shadow-md hover:-translate-y-0.5 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: isVisible ? `${i * 100}ms` : "0ms",
              }}
            >
              <div className="flex items-center justify-center size-11 md:size-12 rounded-full bg-white text-foreground/70 shadow-sm transition-all duration-500 hover:text-accent hover:scale-110">
                <badge.icon className="h-5 w-5 md:h-5.5 md:w-5.5" strokeWidth={1.5} />
              </div>

              <div className="space-y-0.5">
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.06em] text-foreground">
                  {badge.title}
                </p>
                <p className="text-[10px] md:text-[11px] text-muted-foreground leading-relaxed">
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
