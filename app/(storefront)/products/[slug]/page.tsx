/**
 * BIBAZ — Product Detail Page (Premium v2.0 — Aarong Inspired)
 * Clean, immersive, accordion sections, no product code
 * 55/45 split, real images, sticky info
 */

import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductImages } from "@/components/product/product-images";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";
import { ALL_PRODUCTS } from "@/lib/demo-data";

// Get product data by slug (will be DB query in Phase 3)
function getProductBySlug(slug: string) {
  const product = ALL_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;

  // Build full product detail from demo data
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: getDescription(product.category ?? ""),
    basePrice: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    category: { name: product.category ?? "Fashion", slug: getCategorySlug(product.category ?? "") },
    images: [product.image, product.image, product.image],
    variants: getVariants(product),
    features: getFeatures(product.category ?? ""),
    deliveryInfo: "Dhaka: ৳80 (2-3 days) | Outside Dhaka: ৳150 (3-5 days)",
  };
}

function getCategorySlug(category: string): string {
  if (category.includes("Borka") || category.includes("Abaya")) return "borka";
  if (category.includes("Saree")) return "saree";
  if (category.includes("Boutique")) return "boutique";
  if (category.includes("Three")) return "three-piece";
  return "new-arrivals";
}

function getDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "Saree": "A captivating saree crafted from premium fabric with intricate detailing. The beautiful color palette and elegant drape make it perfect for festive occasions and celebrations. Lightweight and comfortable for all-day wear.",
    "Three Piece": "A luxurious three-piece suit featuring intricate embroidery and premium fabric. The coordinated set includes a kurta, bottom, and dupatta — perfect for Eid celebrations and special occasions.",
    "Boutique": "An exclusive designer piece from our boutique collection. Crafted with attention to detail, featuring premium embroidery and sophisticated silhouette that makes a statement.",
    "Borka & Abaya": "A graceful abaya crafted from premium fabric with elegant detailing. The fluid silhouette ensures comfortable modest wear with a luxurious feel, perfect for everyday elegance and special occasions.",
  };
  return descriptions[category] ?? descriptions["Boutique"]!;
}

function getVariants(product: { id: string; price: number; category?: string }) {
  const isFreeSize = product.category === "Saree";
  if (isFreeSize) {
    return [
      { id: `${product.id}-v1`, size: "Free Size", color: "As Shown", price: product.price, stock: 8, sku: "SKU-001" },
    ];
  }
  return [
    { id: `${product.id}-v1`, size: "S", color: "As Shown", price: product.price, stock: 5, sku: "SKU-001" },
    { id: `${product.id}-v2`, size: "M", color: "As Shown", price: product.price, stock: 8, sku: "SKU-002" },
    { id: `${product.id}-v3`, size: "L", color: "As Shown", price: product.price, stock: 6, sku: "SKU-003" },
    { id: `${product.id}-v4`, size: "XL", color: "As Shown", price: product.price, stock: 3, sku: "SKU-004" },
  ];
}

function getFeatures(category: string): string[] {
  const features: Record<string, string[]> = {
    "Saree": ["Premium quality fabric", "Beautiful color combination", "Lightweight & comfortable", "Easy to drape", "Blouse piece included"],
    "Three Piece": ["Premium embroidered fabric", "Includes kurta, bottom & dupatta", "Comfortable fit", "Machine washable (gentle cycle)", "Available in multiple sizes"],
    "Boutique": ["Exclusive designer piece", "Premium embroidery work", "Comfortable fit for all-day wear", "High-quality fabric", "Elegant silhouette"],
    "Borka & Abaya": ["Premium quality fabric", "Elegant embroidery/detailing", "Comfortable modest wear", "Machine washable (gentle cycle)", "Fluid & graceful silhouette"],
  };
  return features[category] ?? features["Boutique"]!;
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.images[0] ?? ""],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Fallback for products not in demo data
  const displayProduct = product ?? {
    id: "fallback",
    name: "Premium Fashion Item",
    slug,
    description: "A beautiful premium fashion item from BIBAZ collection. Crafted with quality fabrics and elegant design.",
    basePrice: 2500,
    compareAtPrice: 3000,
    category: { name: "Fashion", slug: "new-arrivals" },
    images: ["/images/products/borka/borka 1.jpg", "/images/products/borka/borka 2.jpg"],
    variants: [
      { id: "f-v1", size: "S", color: "As Shown", price: 2500, stock: 5, sku: "SKU-F1" },
      { id: "f-v2", size: "M", color: "As Shown", price: 2500, stock: 8, sku: "SKU-F2" },
      { id: "f-v3", size: "L", color: "As Shown", price: 2500, stock: 6, sku: "SKU-F3" },
      { id: "f-v4", size: "XL", color: "As Shown", price: 2500, stock: 3, sku: "SKU-F4" },
    ],
    features: ["Premium quality fabric", "Elegant design", "Comfortable fit", "Machine washable"],
    deliveryInfo: "Dhaka: ৳80 (2-3 days) | Outside Dhaka: ৳150 (3-5 days)",
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: displayProduct.category.name, href: `/collections/${displayProduct.category.slug}` },
          { label: displayProduct.name },
        ]}
      />

      {/* Product Detail — 55/45 Split */}
      <div className="mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left: Image Gallery — 55% (7 cols) */}
        <div className="lg:col-span-7">
          <ProductImages images={displayProduct.images} productName={displayProduct.name} />
        </div>

        {/* Right: Product Info — 45% (5 cols), sticky */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <ProductInfo product={displayProduct} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts categorySlug={displayProduct.category.slug} />
    </div>
  );
}
