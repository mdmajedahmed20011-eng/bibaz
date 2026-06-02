"use client";

/**
 * BIBAZ — Trust Badges (Premium Redesign v3.1)
 * Optimized, mobile-responsive trust strip matching luxury brand identity
 * Features: warm sand ivory borders, gold-monochrome iconography, and micro-hover lifts
 */

import { useEffect, useRef, useState } from "react";
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface-warm border-y border-accent/15 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, i) => (
            <div
              key={badge.title}
              className={`group flex flex-col items-center text-center gap-4 p-5 md:p-6 rounded-sm bg-white border border-accent/10 shadow-[0_4px_20px_rgba(201,169,110,0.02)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(201,169,110,0.08)] hover:border-accent/40 hover:-translate-y-1 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-6 scale-[0.98]"
              }`}
              style={{
                transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
              }}
            >
              {/* Circular Gold Icon Wrapper */}
              <div className="flex items-center justify-center size-12 md:size-13 rounded-full bg-accent-light text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-white shadow-sm scale-100 group-hover:scale-105">
                <badge.icon className="h-5.5 w-5.5 md:h-6 md:w-6 stroke-[1.25]" />
              </div>

              <div className="space-y-1">
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-foreground font-sans">
                  {badge.title}
                </p>
                <p className="text-[10px] md:text-[11px] text-muted-foreground leading-relaxed font-sans font-medium">
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
