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
  searchParams: Promise<{ size?: string | string[]; price?: string; sort?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug];
  if (!category) return { title: "Collection Not Found" };
  return {
    title: `${category.name} Collection`,
    description: category.description,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  // Await promises for Next.js 16 compliance
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const category = categories[slug];

  if (!category) {
    notFound();
  }

  // Retrieve active filters
  const size = resolvedSearchParams.size;
  const price = resolvedSearchParams.price;
  const sort = resolvedSearchParams.sort;

  // Get demo product list for category
  let products = getProductsByCategory(slug);

  // 1. Server-Side Size Filtering
  const sizeArray = size ? (Array.isArray(size) ? size : [size]) : [];
  if (sizeArray.length > 0) {
    products = products.filter((product) => {
      // Free size matches only Sarees
      if (sizeArray.includes("Free Size") && product.category === "Saree") {
        return true;
      }
      // Standard sizes (S, M, L, XL) match non-saree apparel
      const standardSizes = ["S", "M", "L", "XL"];
      const hasStandardRequested = sizeArray.some((s) => standardSizes.includes(s));
      if (hasStandardRequested && product.category !== "Saree") {
        return true;
      }
      return false;
    });
  }

  // 2. Server-Side Price Filtering
  if (price && typeof price === "string") {
    const parts = price.split("-");
    const minVal = Number(parts[0]);
    const maxVal = Number(parts[1]);
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      products = products.filter((product) => product.price >= minVal && product.price <= maxVal);
    }
  }

  // 3. Server-Side Sorting
  if (sort) {
    if (sort === "price-low-high") {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high-low") {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      products = [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
  }

  return (
    <div className="container mx-auto px-6 md:px-8 py-6 md:py-10 max-w-[1280px]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Collections", href: "/collections" },
          { label: category.name },
        ]}
      />

      {/* Page Header — editorial typography */}
      <div className="mt-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">
          {category.name}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Premium Horizontal Dropdown Filter Bar */}
      <div className="mb-8">
        <CollectionFilters />
      </div>

      {/* Catalog Top Info Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {products.length} {products.length === 1 ? "Product" : "Products"} Found
        </p>
        <div className="flex items-center gap-4">
          <MobileFilterDrawer />
          <SortDropdown />
        </div>
      </div>

      {/* Product Catalog Grid — 4 columns for luxury breathability */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Elegant Empty State */}
      {products.length === 0 && (
        <div className="text-center py-24 border border-dashed border-border/80 rounded-lg max-w-md mx-auto space-y-3 mt-12 bg-neutral-50/50">
          <p className="text-sm font-semibold text-foreground">No matching products found</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Try adjusting your sizes or price ranges to discover other premium fashion edits.
          </p>
        </div>
      )}
    </div>
  );
}
