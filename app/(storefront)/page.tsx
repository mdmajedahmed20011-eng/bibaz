/**
 * BIBAZ — Homepage
 * SOP §২ — Homepage Sections (Top to Bottom):
 * 1. Hero Banner
 * 2. Category Section
 * 3. New Arrival Collection
 * 4. Featured Collection
 * 5. All Collections Grid
 */

import { HeroSection } from "@/components/layout/hero-section";
import { CategorySection } from "@/components/layout/category-section";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Section 1: Hero Banner */}
            <HeroSection />

            {/* Section 2: Category Section */}
            <CategorySection />

            {/* Section 3: New Arrivals — will be added when products are seeded */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center space-y-2 mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
                    <p className="text-muted-foreground">
                        Discover our latest collection of premium women&apos;s fashion
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* ProductCard components will go here */}
                    <div className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                    <div className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                    <div className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                    <div className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                </div>
            </section>

            {/* Section 4: Featured Collection — placeholder */}
            <section className="bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-2 mb-10">
                        <h2 className="text-3xl font-bold tracking-tight">Featured Collection</h2>
                        <p className="text-muted-foreground">
                            Handpicked styles for the modern woman
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                        <div className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                        <div className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                    </div>
                </div>
            </section>
        </div>
    );
}
