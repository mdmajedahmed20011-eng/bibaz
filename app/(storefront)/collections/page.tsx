/**
 * BIBAZ — All Collections Page
 * Shows all available collections
 * Route: /collections
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "All Collections",
  description: "Browse all BIBAZ collections — Borka, Saree, Boutique, Three Piece and more.",
};

const collections = [
  {
    name: "Borka Collection",
    slug: "borka",
    description: "Elegant everyday & party wear borka designs",
    productCount: 45,
  },
  {
    name: "Saree Collection",
    slug: "saree",
    description: "Premium silk, cotton, and designer sarees",
    productCount: 32,
  },
  {
    name: "Boutique Collection",
    slug: "boutique",
    description: "Exclusive designer boutique wear",
    productCount: 28,
  },
  {
    name: "Three Piece Sets",
    slug: "three-piece",
    description: "Complete coordinated three piece sets",
    productCount: 20,
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Latest additions this week",
    productCount: 15,
  },
  {
    name: "Sale",
    slug: "sale",
    description: "Up to 40% off selected items",
    productCount: 18,
  },
];

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Breadcrumb items={[{ label: "Collections" }]} />

      <div className="mt-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">All Collections</h1>
        <p className="text-muted-foreground mt-2">
          Browse our complete range of premium women&apos;s fashion
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group block p-6 rounded-xl border border-border hover:border-foreground/20 hover:shadow-sm transition-all"
          >
            {/* Placeholder image area */}
            <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-muted to-muted/50 mb-4 group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-3xl font-bold text-muted-foreground/20">
                  {collection.name.charAt(0)}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-semibold group-hover:text-foreground/80 transition-colors">
              {collection.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
            <p className="text-xs text-muted-foreground mt-2">{collection.productCount} products</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
