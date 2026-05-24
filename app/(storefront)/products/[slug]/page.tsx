/**
 * BIBAZ — Product Detail Page (DATABASE-driven)
 * Fetches product, variants, images from real database
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductImages } from "@/components/product/product-images";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";
import { getProductBySlug } from "@/actions/product.actions";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function getFeatures(categoryName: string): string[] {
  const features: Record<string, string[]> = {
    Saree: [
      "Premium quality fabric",
      "Beautiful color combination",
      "Lightweight & comfortable",
      "Easy to drape",
      "Blouse piece included",
    ],
    "Three Piece": [
      "Premium embroidered fabric",
      "Includes kurta, bottom & dupatta",
      "Comfortable fit",
      "Machine washable (gentle cycle)",
      "Available in multiple sizes",
    ],
    Boutique: [
      "Exclusive designer piece",
      "Premium embroidery work",
      "Comfortable fit for all-day wear",
      "High-quality fabric",
      "Elegant silhouette",
    ],
    "Borka & Abaya": [
      "Premium quality fabric",
      "Elegant embroidery/detailing",
      "Comfortable modest wear",
      "Machine washable (gentle cycle)",
      "Fluid & graceful silhouette",
    ],
  };
  return features[categoryName] ?? features["Boutique"]!;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.product) {
    return { title: "Product Not Found" };
  }

  const product = result.product;
  return {
    title: product.seoTitle || product.name,
    description: (product.seoDesc || product.description).slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.product) {
    notFound();
  }

  const product = result.product;

  // Extract images from variants (first variant's images, or fallback)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstVariant: any = product.variants[0];
  const variantImages = firstVariant?.images;
  const images: string[] =
    Array.isArray(variantImages) && variantImages.length > 0
      ? (variantImages as string[])
      : ["/images/products/placeholder.jpg"];

  // Compute compareAtPrice from database or calculate dynamic fallback
  const prices = product.variants.map((v) => Number(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : Number(product.basePrice);
  const compareAtPrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : Math.round(minPrice * 1.2); // 20% markup as "compare at" fallback

  // Map DB variants to ProductInfo expected format
  const mappedVariants = product.variants.map((v) => ({
    id: v.id,
    size: v.size || "Free Size",
    color: v.color || "As Shown",
    price: Number(v.price),
    stock: v.stock,
    sku: v.sku,
  }));

  const displayProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    basePrice: minPrice,
    compareAtPrice,
    category: {
      name: product.category?.name || "Uncategorized",
      slug: product.category?.slug || "uncategorized",
    },
    images,
    variants: mappedVariants,
    features: getFeatures(product.category?.name || "Uncategorized"),
    deliveryInfo: "Dhaka: ৳80 (2-3 days) | Outside Dhaka: ৳150 (3-5 days)",
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: displayProduct.category.name,
            href: `/collections/${displayProduct.category.slug}`,
          },
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
