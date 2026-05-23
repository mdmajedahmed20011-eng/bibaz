/**
 * BIBAZ — Category Section
 * Grid of category cards with images and hover effects
 * SOP §২ — Homepage Section 3
 */

import Link from "next/link";

// Categories (will be dynamic from DB later)
const categories = [
  {
    name: "Borka",
    slug: "borka",
    image: "/categories/borka.jpg",
    description: "Elegant borka collection",
  },
  {
    name: "Saree",
    slug: "saree",
    image: "/categories/saree.jpg",
    description: "Premium saree designs",
  },
  {
    name: "Boutique",
    slug: "boutique",
    image: "/categories/boutique.jpg",
    description: "Exclusive boutique wear",
  },
  {
    name: "Three Piece",
    slug: "three-piece",
    image: "/categories/three-piece.jpg",
    description: "Complete three piece sets",
  },
];

export function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
        <p className="text-muted-foreground">
          Find your perfect style from our curated collections
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/collections/${category.slug}`}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-muted"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Placeholder background (will be replaced with actual images) */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-110 transition-transform duration-700 ease-out" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-6">
              <h3 className="text-white text-lg md:text-xl font-semibold text-center drop-shadow-md">
                {category.name}
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
