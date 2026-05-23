/**
 * BIBAZ — New Arrivals Section
 * Shows latest products (sorted by created_at DESC)
 * SOP §২ — Homepage Section 4
 *
 * TODO: Replace placeholder data with server action (Phase 3)
 */

import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard, type ProductCardProps } from "@/components/product/product-card";

// Placeholder products — will be replaced with DB query in Phase 3
const placeholderProducts: ProductCardProps[] = [
  {
    id: "1",
    name: "Elegant Black Borka with Gold Embroidery",
    slug: "elegant-black-borka-gold-embroidery",
    price: 2850,
    compareAtPrice: 3200,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-1.jpg",
    category: "Borka",
    isNew: true,
  },
  {
    id: "2",
    name: "Premium Silk Saree — Royal Blue",
    slug: "premium-silk-saree-royal-blue",
    price: 4500,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-2.jpg",
    category: "Saree",
    isNew: true,
  },
  {
    id: "3",
    name: "Designer Boutique Three Piece — Floral",
    slug: "designer-boutique-three-piece-floral",
    price: 3200,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-3.jpg",
    category: "Boutique",
    isNew: true,
  },
  {
    id: "4",
    name: "Casual Everyday Borka — Navy",
    slug: "casual-everyday-borka-navy",
    price: 1950,
    compareAtPrice: 2400,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-4.jpg",
    category: "Borka",
    isNew: true,
  },
  {
    id: "5",
    name: "Banarasi Silk Saree — Maroon",
    slug: "banarasi-silk-saree-maroon",
    price: 5800,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-5.jpg",
    category: "Saree",
  },
  {
    id: "6",
    name: "Embroidered Three Piece — Pastel Pink",
    slug: "embroidered-three-piece-pastel-pink",
    price: 2750,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-6.jpg",
    category: "Three Piece",
  },
  {
    id: "7",
    name: "Party Wear Borka — Champagne Gold",
    slug: "party-wear-borka-champagne-gold",
    price: 3950,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-7.jpg",
    category: "Borka",
  },
  {
    id: "8",
    name: "Cotton Boutique Set — Summer Collection",
    slug: "cotton-boutique-set-summer",
    price: 1850,
    compareAtPrice: 2200,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/placeholder-8.jpg",
    category: "Boutique",
  },
];

export function NewArrivalsSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <SectionHeading
        title="New Arrivals"
        subtitle="Discover our latest collection of premium women's fashion"
        viewAllHref="/collections/new-arrivals"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {placeholderProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
