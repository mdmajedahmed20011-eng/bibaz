/**
 * BIBAZ — Collection Page (Premium v2.0)
 * Clean grid, functional filters, real data
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/product/product-card";
import { CollectionFilters } from "@/components/product/collection-filters";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { MobileFilterDrawer } from "@/components/product/mobile-filter-drawer";
import { getProductsByCategory } from "@/lib/demo-data";

const categories: Record<string, { name: string; description: string }> = {
  borka: {
    name: "Borka & Abaya",
    description: "Elegant borka and abaya collection for everyday and special occasions",
  },
  saree: {
    name: "Saree",
    description: "Premium silk, cotton, and designer sarees",
  },
  boutique: {
    name: "Boutique",
    description: "Exclusive designer boutique wear",
  },
  "three-piece": {
    name: "Three Piece",
    description: "Complete coordinated three piece sets",
  },
  "new-arrivals": {
    name: "New Arrivals",
    description: "Latest additions to our collection",
  },
  featured: {
    name: "Featured",
    description: "Handpicked styles curated for you",
  },
  sale: {
    name: "Sale",
    description: "Special offers and discounted items",
  },
};

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug];
  if (!category) return { title: "Collection Not Found" };
  return {
    title: `${category.name} Collection`,
    description: category.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const category = categories[slug];

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(slug);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Collections", href: "/collections" },
          { label: category.name },
        ]}
      />

      {/* Page Header */}
      <div className="mt-6 mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {category.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {category.description}
        </p>
      </div>

      {/* Content */}
      <div className="flex gap-8 lg:gap-10">
        {/* Sidebar Filters — Desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <CollectionFilters />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              {products.length} Products
            </p>
            <div className="flex items-center gap-2">
              <MobileFilterDrawer />
              <SortDropdown />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No products found in this collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
