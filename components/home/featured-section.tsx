/**
 * BIBAZ — Featured Collection Section
 * Curated products with editorial-style layout
 * SOP §২ — Homepage Section 5
 */

import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/product/product-card";
import { ALL_PRODUCTS } from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";

export function FeaturedSection() {
  // Pick premium products for featured section
  const featuredProducts = ALL_PRODUCTS.filter(
    (p) => p.compareAtPrice && p.compareAtPrice >= 3000
  ).slice(0, 4);

  const heroProduct = featuredProducts[0];

  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Collection"
          subtitle="Handpicked styles for the modern woman"
          viewAllHref="/collections/featured"
        />

        {/* Editorial-style layout: 1 large + 3 small on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* First item — large on desktop */}
          {heroProduct && (
            <div className="col-span-2 row-span-2">
              <Link
                href={`/products/${heroProduct.slug}`}
                className="group block relative h-full min-h-[300px] md:min-h-[500px] overflow-hidden rounded-xl bg-muted"
                aria-label={`View ${heroProduct.name}`}
              >
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <p className="text-[11px] uppercase tracking-wider text-white/70 mb-1">
                    {heroProduct.category}
                  </p>
                  <h3 className="text-base md:text-lg font-semibold text-white leading-snug">
                    {heroProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-medium text-white">
                      {formatPrice(heroProduct.price)}
                    </span>
                    {heroProduct.compareAtPrice && (
                      <span className="text-xs text-white/60 line-through">
                        {formatPrice(heroProduct.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Remaining items — standard cards */}
          {featuredProducts.slice(1).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
