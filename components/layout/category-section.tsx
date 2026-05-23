/**
 * BIBAZ — Category Section
 * Grid of category cards with real product images
 * SOP §২ — Homepage Section 3
 */

import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/demo-data";

export function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shop by Category</h2>
        <p className="text-muted-foreground">
          Find your perfect style from our curated collections
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {CATEGORIES.map((category, index) => (
          <Link
            key={category.slug}
            href={`/collections/${category.slug}`}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-muted"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Real product image as category background */}
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-6">
              <h3 className="text-white text-lg md:text-xl font-semibold text-center drop-shadow-md">
                {category.name}
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {category.productCount} Products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
