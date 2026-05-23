/**
 * BIBAZ — Collection/Category Page
 * Shows products filtered by category with sidebar filters
 * SOP §২ — Frontend Plan PAGE 2
 *
 * Route: /collections/[slug]
 * Features: Filters, Sort, Pagination, Responsive Grid
 *
 * TODO: Replace placeholder data with server action (Phase 3)
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductCard, type ProductCardProps } from "@/components/product/product-card";
import { CollectionFilters } from "@/components/product/collection-filters";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { MobileFilterDrawer } from "@/components/product/mobile-filter-drawer";

// Placeholder category data
const categories: Record<string, { name: string; description: string }> = {
  borka: {
    name: "Borka",
    description: "Elegant borka collection for everyday and special occasions",
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

// Placeholder products for collection pages
const placeholderProducts: ProductCardProps[] = Array.from({ length: 12 }, (_, i) => ({
  id: `col-${i + 1}`,
  name: `Premium Fashion Item ${i + 1}`,
  slug: `premium-fashion-item-${i + 1}`,
  price: 1500 + Math.floor(Math.random() * 5000),
  compareAtPrice: i % 3 === 0 ? 2000 + Math.floor(Math.random() * 5000) : null,
  image: `https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/product-${(i % 8) + 1}.jpg`,
  category: "Collection",
  isNew: i < 3,
  isSoldOut: i === 7,
}));

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug];

  if (!category) {
    return { title: "Collection Not Found" };
  }

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

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Collections", href: "/collections" }, { label: category.name }]}
      />

      {/* Page Header */}
      <div className="mt-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{category.name}</h1>
        <p className="text-muted-foreground mt-1">{category.description}</p>
      </div>

      {/* Content: Filters + Grid */}
      <div className="flex gap-8">
        {/* Sidebar Filters — Desktop only */}
        <aside className="hidden lg:block w-60 shrink-0">
          <CollectionFilters />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar: Count + Sort + Mobile Filter */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {placeholderProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              <MobileFilterDrawer />
              <SortDropdown />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {placeholderProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="mt-10 flex justify-center">
            <nav aria-label="Pagination" className="flex items-center gap-1">
              <span className="flex items-center justify-center h-9 w-9 rounded-md bg-foreground text-background text-sm font-medium">
                1
              </span>
              <button className="flex items-center justify-center h-9 w-9 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors">
                2
              </button>
              <button className="flex items-center justify-center h-9 w-9 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors">
                3
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
