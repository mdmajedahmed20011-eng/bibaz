/**
 * BIBAZ — Product Detail Page
 * Full product view with images, variants, add to cart
 * SOP §২ — Frontend Plan PAGE 3
 *
 * Route: /products/[slug]
 * Features: Image Gallery, Variant Selector, Add to Cart, Reviews, Related
 *
 * TODO: Replace placeholder data with server action (Phase 3)
 */

import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductImages } from "@/components/product/product-images";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";

// Placeholder product data
const placeholderProduct = {
  id: "prod-1",
  name: "Elegant Black Borka with Gold Embroidery",
  slug: "elegant-black-borka-gold-embroidery",
  description:
    "A stunning black borka featuring intricate gold embroidery work. Made from premium quality georgette fabric, this borka is perfect for both everyday wear and special occasions. The delicate gold thread work adds a touch of elegance to the classic black silhouette.",
  basePrice: 2850,
  compareAtPrice: 3200,
  category: { name: "Borka", slug: "borka" },
  images: [
    "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/product-detail-1.jpg",
    "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/product-detail-2.jpg",
    "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/product-detail-3.jpg",
    "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/product-detail-4.jpg",
  ],
  variants: [
    { id: "v1", size: "S", color: "Black", price: 2850, stock: 5, sku: "BRK-001-BLK-S" },
    { id: "v2", size: "M", color: "Black", price: 2850, stock: 8, sku: "BRK-001-BLK-M" },
    { id: "v3", size: "L", color: "Black", price: 2850, stock: 3, sku: "BRK-001-BLK-L" },
    { id: "v4", size: "XL", color: "Black", price: 2950, stock: 0, sku: "BRK-001-BLK-XL" },
    { id: "v5", size: "M", color: "Navy", price: 2850, stock: 6, sku: "BRK-001-NVY-M" },
    { id: "v6", size: "L", color: "Navy", price: 2850, stock: 4, sku: "BRK-001-NVY-L" },
  ],
  features: [
    "Premium georgette fabric",
    "Intricate gold embroidery",
    "Comfortable fit for all-day wear",
    "Machine washable (gentle cycle)",
    "Available in multiple sizes",
  ],
  deliveryInfo: "Dhaka: ৳80 (2-3 days) | Outside Dhaka: ৳150 (3-5 days)",
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug } = await params;

  // TODO: Fetch product from DB using `slug`
  return {
    title: placeholderProduct.name,
    description: placeholderProduct.description.slice(0, 160),
    openGraph: {
      title: placeholderProduct.name,
      description: placeholderProduct.description.slice(0, 160),
      images: [placeholderProduct.images[0] ?? ""],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug } = await params;

  // TODO: Fetch product from DB using `slug`
  const product = placeholderProduct;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: product.category.name, href: `/collections/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      {/* Product Detail — 2 Column Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <ProductImages images={product.images} productName={product.name} />

        {/* Right: Product Info */}
        <ProductInfo product={product} />
      </div>

      {/* Related Products */}
      <RelatedProducts categorySlug={product.category.slug} />
    </div>
  );
}
