/**
 * BIBAZ — Featured Collection Section
 * Curated/featured products with editorial-style layout
 * SOP §২ — Homepage Section 5
 *
 * TODO: Replace placeholder data with server action (Phase 3)
 */

import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard, type ProductCardProps } from "@/components/product/product-card";

// Placeholder featured products
const featuredProducts: ProductCardProps[] = [
  {
    id: "f1",
    name: "Luxury Handwoven Jamdani Saree",
    slug: "luxury-handwoven-jamdani-saree",
    price: 8500,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/featured-1.jpg",
    category: "Saree",
  },
  {
    id: "f2",
    name: "Premium Abaya — Midnight Black",
    slug: "premium-abaya-midnight-black",
    price: 4200,
    compareAtPrice: 5000,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/featured-2.jpg",
    category: "Borka",
  },
  {
    id: "f3",
    name: "Designer Boutique — Eid Special",
    slug: "designer-boutique-eid-special",
    price: 5500,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/featured-3.jpg",
    category: "Boutique",
  },
  {
    id: "f4",
    name: "Exclusive Three Piece — Wedding Collection",
    slug: "exclusive-three-piece-wedding",
    price: 6800,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/featured-4.jpg",
    category: "Three Piece",
  },
];

export function FeaturedSection() {
  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Collection"
          subtitle="Handpicked styles for the modern woman"
          viewAllHref="/collections/featured"
        />

        {/* Editorial-style layout: 2 large + 2 small on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* First item — large on desktop */}
          <div className="md:col-span-2 md:row-span-2">
            <Link
              href={`/products/${featuredProducts[0]?.slug}`}
              className="group block relative aspect-[3/4] md:aspect-auto md:h-full overflow-hidden rounded-xl bg-muted"
              aria-label={`View ${featuredProducts[0]?.name}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <p className="text-[11px] uppercase tracking-wider text-white/70 mb-1">
                  {featuredProducts[0]?.category}
                </p>
                <h3 className="text-base md:text-lg font-semibold text-white leading-snug">
                  {featuredProducts[0]?.name}
                </h3>
                <p className="text-sm font-medium text-white/90 mt-1">
                  ৳{featuredProducts[0]?.price.toLocaleString("en-BD")}
                </p>
              </div>
            </Link>
          </div>

          {/* Remaining items — standard cards */}
          {featuredProducts.slice(1).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
