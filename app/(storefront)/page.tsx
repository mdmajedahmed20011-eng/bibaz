/**
 * BIBAZ — Homepage (Premium v2.0)
 * Cinematic, editorial, luxury brand experience
 * Design Guide: 05_premium_ui_design_guide.md
 *
 * Flow: Hero → Trust → Categories → New Arrivals → Editorial → Featured → Newsletter
 */

import { HeroSection } from "@/components/layout/hero-section";
import { CategorySection } from "@/components/layout/category-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { CollectionsGrid } from "@/components/home/collections-grid";
import { TrustBadges } from "@/components/home/trust-badges";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { EditorialBanner } from "@/components/home/editorial-banner";
import { BrandStory } from "@/components/home/brand-story";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero — Cinematic, 85vh */}
      <HeroSection />

      {/* 2. Trust Strip — Subtle */}
      <TrustBadges />

      {/* 3. Categories — Asymmetric editorial grid */}
      <CategorySection />

      {/* 4. New Arrivals — Product grid */}
      <NewArrivalsSection />

      {/* 5. Editorial Banner — Full-width lifestyle */}
      <EditorialBanner />

      {/* 6. Featured Collection — Asymmetric */}
      <FeaturedSection />

      {/* 7. Collections Grid */}
      <CollectionsGrid />

      {/* 8. Brand Story — Editorial storytelling */}
      <BrandStory />

      {/* 9. Newsletter — Dark, elegant */}
      <NewsletterSection />
    </div>
  );
}
