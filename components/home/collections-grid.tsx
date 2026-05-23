/**
 * BIBAZ — All Collections Grid
 * Shows all available collections with images
 * SOP §২ — Homepage Section 6
 *
 * TODO: Replace with dynamic data from DB (Phase 3)
 */

import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

const collections = [
  {
    name: "Borka Collection",
    slug: "borka",
    description: "Elegant everyday & party wear",
    productCount: 45,
    image: "/collections/borka.jpg",
  },
  {
    name: "Saree Collection",
    slug: "saree",
    description: "Premium silk & cotton sarees",
    productCount: 32,
    image: "/collections/saree.jpg",
  },
  {
    name: "Boutique Collection",
    slug: "boutique",
    description: "Exclusive designer pieces",
    productCount: 28,
    image: "/collections/boutique.jpg",
  },
  {
    name: "Three Piece Sets",
    slug: "three-piece",
    description: "Complete coordinated sets",
    productCount: 20,
    image: "/collections/three-piece.jpg",
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Latest additions this week",
    productCount: 15,
    image: "/collections/new-arrivals.jpg",
  },
  {
    name: "Sale",
    slug: "sale",
    description: "Up to 40% off selected items",
    productCount: 18,
    image: "/collections/sale.jpg",
  },
];

export function CollectionsGrid() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <SectionHeading
        title="Shop All Collections"
        subtitle="Browse our complete range of premium fashion"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
          >
            {/* Placeholder background */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 group-hover:scale-105 transition-transform duration-500 ease-out" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <h3 className="text-sm md:text-base font-semibold text-foreground">
                {collection.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                {collection.description}
              </p>
              <span className="text-[11px] text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {collection.productCount} Products →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
