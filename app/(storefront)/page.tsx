/**
 * BIBAZ — Homepage
 * SOP §২ — Homepage Sections (Top to Bottom):
 * 1. Hero Banner
 * 2. Category Section
 * 3. New Arrival Collection
 * 4. Featured Collection
 * 5. All Collections Grid
 * 6. Brand Promise / Trust Badges
 *
 * Note: Using placeholder data until products are seeded in DB.
 * Server Actions will replace this in Phase 3.
 */

import { HeroSection } from "@/components/layout/hero-section";
import { CategorySection } from "@/components/layout/category-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { CollectionsGrid } from "@/components/home/collections-grid";
import { TrustBadges } from "@/components/home/trust-badges";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Section 1: Hero Banner */}
      <HeroSection />

      {/* Trust Badges — Delivery, COD, Quality */}
      <TrustBadges />

      {/* Section 2: Category Section */}
      <CategorySection />

      {/* Section 3: New Arrivals */}
      <NewArrivalsSection />

      {/* Section 4: Featured Collection */}
      <FeaturedSection />

      {/* Section 5: All Collections Grid */}
      <CollectionsGrid />

      {/* Section 6: Newsletter */}
      <NewsletterSection />
    </div>
  );
}
