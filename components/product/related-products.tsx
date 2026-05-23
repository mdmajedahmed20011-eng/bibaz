/**
 * BIBAZ — Related Products Section
 * "You may also like" — same category products
 * SOP §২ — Frontend Plan F3.12
 *
 * TODO: Replace with server action query (Phase 3)
 */

import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard, type ProductCardProps } from "./product-card";

// Placeholder related products
const relatedProducts: ProductCardProps[] = [
  {
    id: "rel-1",
    name: "Classic Black Borka — Everyday Elegance",
    slug: "classic-black-borka-everyday",
    price: 2200,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/related-1.jpg",
    category: "Borka",
  },
  {
    id: "rel-2",
    name: "Embroidered Borka — Floral Pattern",
    slug: "embroidered-borka-floral",
    price: 3100,
    compareAtPrice: 3500,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/related-2.jpg",
    category: "Borka",
  },
  {
    id: "rel-3",
    name: "Premium Silk Borka — Pearl White",
    slug: "premium-silk-borka-pearl-white",
    price: 3800,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/related-3.jpg",
    category: "Borka",
    isNew: true,
  },
  {
    id: "rel-4",
    name: "Casual Borka — Dusty Rose",
    slug: "casual-borka-dusty-rose",
    price: 1950,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/related-4.jpg",
    category: "Borka",
  },
];

interface RelatedProductsProps {
  categorySlug: string;
}

export function RelatedProducts({ categorySlug }: RelatedProductsProps) {
  // TODO: Fetch related products from DB based on categorySlug
  return (
    <section className="mt-16 md:mt-20">
      <SectionHeading
        title="You May Also Like"
        subtitle="More from this collection"
        viewAllHref={`/collections/${categorySlug}`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
