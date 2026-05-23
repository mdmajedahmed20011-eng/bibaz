/**
 * BIBAZ — New Arrivals Section
 * Shows latest products with real data
 * SOP §২ — Homepage Section 4
 */

import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/product/product-card";
import { ALL_PRODUCTS } from "@/lib/demo-data";

export function NewArrivalsSection() {
  // Show first 8 products (mix of all categories)
  const products = ALL_PRODUCTS.slice(0, 8);

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <SectionHeading
        title="New Arrivals"
        subtitle="Discover our latest collection of premium women's fashion"
        viewAllHref="/collections/new-arrivals"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
