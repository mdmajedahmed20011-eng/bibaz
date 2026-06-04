/* eslint-disable */
"use client";

/**
 * BIBAZ — Home UI Orchestrator (Refactored v4.0)
 * Lightweight orchestrator using next/dynamic for below-fold lazy loading.
 * Hero is eager-loaded (above-fold), all other sections are code-split.
 */

import dynamic from "next/dynamic";
import { HeroSlider, type HeroSlide } from "@/components/home/hero-slider";
import { TrustBadges } from "@/components/home/trust-badges";
import type { CategoryItem } from "@/components/home/category-grid";
import type { LookbookLook } from "@/components/home/lookbook-section";
import type { CollectionShowcaseItem } from "@/components/home/collections-showcase";
import type { ArrivalsProduct } from "@/components/home/new-arrivals-grid";
import type { Testimonial } from "@/components/home/testimonials-carousel";

/* ──────────────── Dynamic Imports with Loading Skeletons ──────────────── */

const CategoryGrid = dynamic(
  () => import("@/components/home/category-grid").then((mod) => mod.CategoryGrid),
  {
    loading: () => (
      <section className="py-16 md:py-24 bg-[#f8f5f0]">
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl">
          <div className="h-6 w-48 skeleton-shimmer mx-auto mb-12 rounded" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton-shimmer rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
);

const NewArrivalsGrid = dynamic(
  () => import("@/components/home/new-arrivals-grid").then((mod) => mod.NewArrivalsGrid),
  {
    loading: () => (
      <section className="py-16 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl">
          <div className="h-6 w-40 skeleton-shimmer mb-12 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-14">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] skeleton-shimmer mb-3 rounded-sm" />
                <div className="h-3 w-3/4 skeleton-shimmer rounded mb-2" />
                <div className="h-3 w-1/2 skeleton-shimmer rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
);

const LookbookSection = dynamic(
  () => import("@/components/home/lookbook-section").then((mod) => mod.LookbookSection),
  {
    loading: () => (
      <section className="py-16 md:py-24 bg-surface-warm">
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-16 items-center">
            <div className="col-span-5 space-y-4">
              <div className="h-8 w-48 skeleton-shimmer rounded" />
              <div className="h-12 w-full skeleton-shimmer rounded" />
              <div className="h-12 w-full skeleton-shimmer rounded" />
            </div>
            <div className="col-span-7 aspect-[3/4] skeleton-shimmer rounded-sm" />
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
);

const CollectionsShowcase = dynamic(
  () => import("@/components/home/collections-showcase").then((mod) => mod.CollectionsShowcase),
  {
    loading: () => (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl">
          <div className="h-6 w-48 skeleton-shimmer mx-auto mb-12 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] skeleton-shimmer rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
);

const TestimonialsCarousel = dynamic(
  () => import("@/components/home/testimonials-carousel").then((mod) => mod.TestimonialsCarousel),
  {
    loading: () => (
      <section className="py-16 md:py-24 bg-[#f8f5f0]">
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-5xl">
          <div className="h-6 w-40 skeleton-shimmer mx-auto mb-10 rounded" />
          <div className="h-48 skeleton-shimmer rounded-sm" />
        </div>
      </section>
    ),
    ssr: false,
  }
);

const EditorialSection = dynamic(
  () => import("@/components/home/editorial-section").then((mod) => mod.EditorialSection),
  {
    loading: () => (
      <section className="py-16 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-16 items-center">
            <div className="col-span-5 aspect-[3/4] skeleton-shimmer rounded-sm" />
            <div className="col-span-7 space-y-4">
              <div className="h-8 w-64 skeleton-shimmer rounded" />
              <div className="h-24 skeleton-shimmer rounded" />
              <div className="h-12 w-48 skeleton-shimmer rounded" />
            </div>
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
);

/* ──────────────── Static Data ──────────────── */

const heroSlides: HeroSlide[] = [
  {
    image: "/images/homebanner/Biba_NXT-D.jpg",
    title: "ATELIER OF MODEST GRACE",
    subtitle: "Discover our premium handcrafted Borka and Abaya designer series.",
    link: "/collections/borka",
    overline: "NEW SEASON",
    color: "from-black/60",
  },
  {
    image: "/images/homebanner/Flat-50-D.jpg",
    title: "VIBRANT SAREE SYMPHONY",
    subtitle: "Intricate paisley block prints and hand-woven premium cotton sarees.",
    link: "/collections/saree",
    overline: "DESIGNER EDIT",
    color: "from-[#2b2118]/60",
  },
  {
    image: "/images/homebanner/Flat-50_Girls-D.jpg",
    title: "CURATED ATELIER SUITS",
    subtitle: "Complete luxury coordinated three-piece boutique sets for Eid celebrations.",
    link: "/collections/three-piece",
    overline: "FESTIVE CELEBRATIONS",
    color: "from-[#1c2420]/60",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "The fabric quality and intricate embroidery on the Kurta set are simply outstanding. It draped elegantly and felt extremely premium. BIBAZ has completely elevated my festive wardrobe.",
    author: "Ananya Rahman",
    designation: "Verified Buyer — Dhaka",
    stars: 5,
  },
  {
    quote:
      "I am amazed by the butterfly abaya. The fluid silhouette, fine stitch work, and breathable fabric represent the highest level of craftsmanship. Highly recommend their luxury modest wear.",
    author: "Farhana Islam",
    designation: "Verified Buyer — Sylhet",
    stars: 5,
  },
  {
    quote:
      "Their single-page checkout is incredibly fast, and customer support guided me dynamically with sizing. The block print cotton saree is beautiful and so easy to drape. Exceeded my expectations!",
    author: "Nusrat Jahan",
    designation: "Verified Buyer — Chittagong",
    stars: 5,
  },
];

/* ──────────────── Main Component ──────────────── */

export function HomeUI({
  dbProducts,
  dbCategories,
}: {
  dbProducts: any[];
  dbCategories: any[];
}) {
  /* ── Map database categories to UI ── */
  const mappedCategories: CategoryItem[] = dbCategories.slice(0, 4).map((c, i) => {
    const fallbackImages = [
      "/images/products/boutique/bouthik 2.webp",
      "/images/products/saree/shari 3.webp",
      "/images/products/borka/borka 2.jpg",
      "/images/products/three-piece/tree prices 1.webp",
    ];
    return {
      name: c.name,
      slug: c.slug,
      productCount: c._count?.products || 0,
      image: c.image || fallbackImages[i % 4],
    };
  });

  /* ── Map database products to UI ── */
  const mappedProducts: ArrivalsProduct[] = dbProducts.slice(0, 8).map((p) => {
    const variantPrice = p.variants?.[0]?.price ? Number(p.variants[0].price) : Number(p.basePrice);
    const variantImages = p.variants?.[0]?.images;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: variantPrice,
      compareAtPrice: Math.round(variantPrice * 1.2),
      image:
        Array.isArray(variantImages) && variantImages.length > 0
          ? variantImages[0]
          : "/images/products/placeholder.jpg",
      category: p.category?.name || "Uncategorized",
      isNew: true,
    };
  });

  /* ── Lookbook looks ── */
  const lookbookLooks: LookbookLook[] =
    dbProducts.length >= 3
      ? dbProducts.slice(0, 3).map((p, i) => {
          const variantPrice = p.variants?.[0]?.price
            ? Number(p.variants[0].price)
            : Number(p.basePrice);
          const variantImages = p.variants?.[0]?.images;
          const tags = ["EVERYDAY LUXE", "HERITAGE PRINT", "FESTIVE EID"];
          return {
            id: p.id,
            image:
              Array.isArray(variantImages) && variantImages.length > 0
                ? variantImages[0]
                : "/images/products/placeholder.jpg",
            title: p.category?.name || "Exclusive",
            subtitle: p.name,
            slug: p.slug,
            price: variantPrice,
            tag: tags[i % 3] as string,
          };
        })
      : [
          {
            id: "look1",
            image: "/images/products/borka/borka 2.jpg",
            title: "Borka & Abaya",
            subtitle: "Premium Winter Jacket",
            slug: "premium-winter-jacket",
            price: 5000,
            tag: "EVERYDAY LUXE",
          },
          {
            id: "look2",
            image: "/images/products/boutique/bouthik 2.webp",
            title: "Boutique",
            subtitle: "Black & White Zebra",
            slug: "black-white-zebra",
            price: 4500,
            tag: "HERITAGE PRINT",
          },
          {
            id: "look3",
            image: "/images/products/borka/borka 4.jpg",
            title: "Borka & Abaya",
            subtitle: "Black & White Zebra Print Open Abaya",
            slug: "black-white-zebra-print-open-abaya",
            price: 2500,
            tag: "FESTIVE EID",
          },
        ];

  /* ── Collections showcase ── */
  const allCollections: CollectionShowcaseItem[] = dbCategories.slice(0, 6).map((c, i) => {
    const fallbackImages = [
      "/images/products/boutique/bouthik 2.webp",
      "/images/products/three-piece/tree prices 1.webp",
      "/images/products/borka/borka 2.jpg",
      "/images/products/saree/shari 3.webp",
      "/images/products/boutique/bouthik 4.webp",
      "/images/products/three-piece/tree prices 3.webp",
    ];
    return {
      title: c.name,
      image: c.image || fallbackImages[i % 6],
      href: `/collections/${c.slug}`,
      tag: "COLLECTION",
    };
  });

  if (allCollections.length === 0) {
    allCollections.push({
      title: "New Arrivals",
      image: "/images/products/boutique/bouthik 2.webp",
      href: "/collections/new-arrivals",
      tag: "JUST IN",
    });
  }

  return (
    <div className="flex flex-col bg-[#fdfcfa] overflow-hidden">
      {/* 1. HERO — Eager loaded (above fold) */}
      <HeroSlider slides={heroSlides} />

      {/* 2. TRUST BADGES — Lightweight, eager */}
      <TrustBadges />

      {/* 3. CATEGORY GRID — Lazy loaded */}
      <CategoryGrid categories={mappedCategories} />

      {/* 4. NEW ARRIVALS — Lazy loaded */}
      <NewArrivalsGrid products={mappedProducts} />

      {/* 5. LOOKBOOK — Lazy loaded */}
      <LookbookSection looks={lookbookLooks} />

      {/* 6. ALL COLLECTIONS — Lazy loaded */}
      <CollectionsShowcase collections={allCollections} />

      {/* 7. TESTIMONIALS — Lazy loaded */}
      <TestimonialsCarousel testimonials={testimonials} />

      {/* 8. EDITORIAL — Lazy loaded */}
      <EditorialSection />
    </div>
  );
}
