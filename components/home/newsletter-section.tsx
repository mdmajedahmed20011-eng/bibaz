/**
 * BIBAZ — Newsletter Section
 * Email subscription for promotions
 * Conversion booster — placed before footer
 */

"use client";

import { useState } from "react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    // TODO: Subscribe to newsletter (Phase 3)
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Subscribed!", {
      description: "You'll receive updates on new arrivals and offers.",
    });
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Stay in Style</h2>
        <p className="text-background/70 mt-2 text-sm md:text-base max-w-md mx-auto">
          Subscribe to get updates on new arrivals, exclusive offers, and style tips.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 h-11 px-4 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-background/30"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 px-6 rounded-lg bg-background text-foreground font-medium text-sm hover:bg-background/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        <p className="text-xs text-background/50 mt-3">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}
