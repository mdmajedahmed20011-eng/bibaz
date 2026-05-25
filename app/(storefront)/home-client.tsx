/* eslint-disable */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight, Star, Sparkles, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice } from "@/lib/utils";
import { TrustBadges } from "@/components/home/trust-badges";

/* ──────────────── Scroll Reveal Hook ──────────────── */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ──────────────── Static Data ──────────────── */

const heroSlides = [
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

const testimonials = [
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

/* ──────────────── Image With Skeleton ──────────────── */

function ImageWithSkeleton({
  src,
  alt,
  fill = true,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer z-[1]" />}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

/* ──────────────── Main Component ──────────────── */

export function HomeUI({
  dbProducts,
  dbCategories,
}: {
  dbProducts: any[];

  dbCategories: any[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [heroReady, setHeroReady] = useState(false);

  // Scroll reveal hooks for each section
  const categoryReveal = useScrollReveal(0.1);
  const arrivalsReveal = useScrollReveal(0.1);
  const lookbookReveal = useScrollReveal(0.1);
  const collectionsReveal = useScrollReveal(0.1);
  const testimonialsReveal = useScrollReveal(0.1);
  const editorialReveal = useScrollReveal(0.1);

  // Hero entrance animation
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = useCallback(
    () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
    []
  );
  const handlePrevSlide = useCallback(
    () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length),
    []
  );

  // Map database categories to UI
  const mappedCategories = dbCategories.slice(0, 4).map((c, i) => {
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

  // Map database products to UI
  const mappedProducts = dbProducts.slice(0, 8).map((p) => {
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

  // Use up to 3 db products for Lookbook
  const lookbookLooks = dbProducts.slice(0, 3).map((p, i) => {
    const variantPrice = p.variants?.[0]?.price ? Number(p.variants[0].price) : Number(p.basePrice);
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
      tag: tags[i % 3],
    };
  });

  // All collections showcase using db categories
  const allCollections = dbCategories.slice(0, 6).map((c, i) => {
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
      {/* ═══════ 1. CINEMATIC HERO SLIDER ═══════ */}
      <section className="relative w-full h-[65vh] md:h-[88vh] overflow-hidden bg-neutral-950 group border-b border-border/20">
        {/* Decorative vertical lines */}
        <div className="absolute inset-0 z-20 pointer-events-none border-x-[1px] border-white/5 max-w-7xl mx-auto flex justify-between">
          <div className="w-[1px] h-full bg-white/5" />
          <div className="w-[1px] h-full bg-white/5" />
        </div>

        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div
                className={`absolute inset-0 transition-transform duration-[8500ms] cubic-bezier(0.1, 1, 0.1, 1) ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              >
                <ImageWithSkeleton
                  src={slide.image}
                  alt={slide.title}
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/30 to-transparent`}
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              {/* Hero Content with staggered entrance */}
              <div className="relative z-20 h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-16">
                  <div
                    className={`max-w-2xl transition-all duration-[1000ms] delay-300 transform ${
                      isActive && heroReady
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    {/* Overline with animated line */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`h-[1px] bg-accent transition-all duration-700 delay-500 ${
                          isActive && heroReady ? "w-8" : "w-0"
                        }`}
                      />
                      <p
                        className={`text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent font-bold transition-all duration-700 delay-500 ${
                          isActive && heroReady
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                        }`}
                      >
                        {slide.overline}
                      </p>
                    </div>

                    {/* Title with staggered word reveal */}
                    <h1
                      className={`text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-bold text-white leading-[1.05] tracking-tight mb-5 font-heading transition-all duration-[800ms] delay-[400ms] ${
                        isActive && heroReady
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      {slide.title}
                    </h1>

                    <p
                      className={`text-xs sm:text-sm md:text-base text-neutral-200 max-w-md leading-relaxed mb-8 md:mb-10 font-medium font-sans transition-all duration-[800ms] delay-[600ms] ${
                        isActive && heroReady
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      {slide.subtitle}
                    </p>

                    <div
                      className={`flex flex-wrap gap-4 transition-all duration-[800ms] delay-[800ms] ${
                        isActive && heroReady
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      <Link
                        href={slide.link}
                        className="inline-flex items-center justify-center gap-2 h-12 md:h-13 px-8 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm shadow-lg hover:shadow-xl active:scale-[0.97] group/btn cursor-pointer"
                      >
                        Shop Collection
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-10 md:size-13 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer backdrop-blur-[2px]"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-10 md:size-13 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer backdrop-blur-[2px]"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentSlide ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════ 2. TRUST BADGES ═══════ */}
      <TrustBadges />

      {/* ═══════ 3. CATEGORY GRID ═══════ */}
      {mappedCategories.length > 0 && (
        <section className="py-16 md:py-24 bg-[#f8f5f0] border-b border-border/40">
          <div
            ref={categoryReveal.ref}
            className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
          >
            {/* Section heading */}
            <div
              className={`text-center max-w-lg mx-auto mb-10 md:mb-16 transition-all duration-700 ${
                categoryReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
                ATELIER CATEGORIES
              </p>
              <h2 className="text-2xl md:text-[36px] font-bold tracking-tight text-foreground font-heading">
                Shop Collections
              </h2>
              <div
                className={`h-[2px] bg-accent mx-auto mt-4 transition-all duration-700 delay-300 ${
                  categoryReveal.isVisible ? "w-12" : "w-0"
                }`}
              />
            </div>

            {/* Category cards with staggered animation */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {mappedCategories.map((category, i) => (
                <Link
                  key={category.slug}
                  href={`/collections/${category.slug}`}
                  className={`group relative overflow-hidden rounded-sm aspect-[3/4] shadow-sm bg-neutral-100 transition-all duration-700 ${
                    categoryReveal.isVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-10 scale-[0.96]"
                  }`}
                  style={{
                    transitionDelay: categoryReveal.isVisible ? `${200 + i * 120}ms` : "0ms",
                  }}
                >
                  <ImageWithSkeleton
                    src={category.image}
                    alt={category.name}
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-105 group-active:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-3 border border-white/10 group-hover:border-white/20 transition-colors pointer-events-none z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-20">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold mb-1">
                      {category.productCount} Products
                    </p>
                    <h3 className="text-white text-sm md:text-lg font-bold tracking-tight mb-2">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0 transition-all duration-300 font-sans">
                      Explore Collection →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 4. NEW ARRIVALS ═══════ */}
      {mappedProducts.length > 0 && (
        <section className="py-16 md:py-28 bg-white">
          <div
            ref={arrivalsReveal.ref}
            className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
          >
            {/* Header */}
            <div
              className={`flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 transition-all duration-700 ${
                arrivalsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`h-[2px] bg-accent transition-all duration-700 delay-200 ${
                      arrivalsReveal.isVisible ? "w-6" : "w-0"
                    }`}
                  />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                    JUST RELEASED
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight text-foreground font-heading">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/collections/new-arrivals"
                className="text-xs font-bold uppercase tracking-[0.2em] text-foreground border-b border-accent hover:border-foreground pb-1.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                Browse All Items <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Product grid with staggered reveal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-14">
              {mappedProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={`transition-all duration-600 ${
                    arrivalsReveal.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: arrivalsReveal.isVisible ? `${200 + i * 80}ms` : "0ms",
                  }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 5. LOOKBOOK / EDITORIAL PICKS ═══════ */}
      {lookbookLooks.length > 0 && (
        <section className="py-16 md:py-24 bg-[#f8f5f0] border-t border-border/40 overflow-hidden relative">
          <div
            ref={lookbookReveal.ref}
            className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Left side: Title + selectable items */}
              <div
                className={`lg:col-span-5 space-y-6 z-10 transition-all duration-700 ${
                  lookbookReveal.isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                    BIBAZ EDITORIALS
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading leading-tight">
                    Hand-Picked <br /> Showcase
                  </h2>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  {lookbookLooks.map((look, idx) => (
                    <button
                      key={look.id}
                      onClick={() => setActiveLookIndex(idx)}
                      className={`flex items-center justify-between p-4 border text-left rounded-sm transition-all duration-300 cursor-pointer ${
                        activeLookIndex === idx
                          ? "bg-white border-accent shadow-md pl-6 scale-[1.02]"
                          : "border-border/60 bg-transparent text-muted-foreground hover:bg-white/40 hover:text-foreground active:bg-white/60"
                      }`}
                    >
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-accent font-bold">
                          {look.tag}
                        </p>
                        <h4 className="text-sm font-bold text-foreground mt-0.5 line-clamp-1">
                          {look.subtitle}
                        </h4>
                      </div>
                      <span
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                          activeLookIndex === idx ? "bg-accent scale-110" : "bg-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side: Active look image */}
              <div
                className={`lg:col-span-7 relative transition-all duration-700 delay-200 ${
                  lookbookReveal.isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                {lookbookLooks.map((look, idx) => {
                  if (idx !== activeLookIndex) return null;
                  return (
                    <div
                      key={look.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                    >
                      <div className="md:col-span-7 relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100 shadow-lg">
                        <ImageWithSkeleton
                          src={look.image}
                          alt={look.title}
                          className="object-cover transition-transform duration-[4000ms] hover:scale-103"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      </div>
                      <div className="md:col-span-5 space-y-4">
                        <span className="inline-flex px-2.5 py-1 bg-accent/15 border border-accent/25 rounded-sm text-[9px] text-accent font-bold uppercase tracking-wider">
                          Atelier Pick
                        </span>
                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground font-heading">
                          {look.subtitle}
                        </h3>
                        <p className="text-base font-semibold text-foreground">
                          {formatPrice(look.price)}
                        </p>
                        <div className="border-t border-border/40 pt-4 space-y-3">
                          <Link
                            href={`/products/${look.slug}`}
                            className="inline-flex items-center justify-center gap-2 w-full h-11 bg-foreground hover:bg-neutral-800 text-background text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm active:scale-[0.97]"
                          >
                            <ShoppingBag className="h-4 w-4" /> Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 6. ALL COLLECTIONS SHOWCASE ═══════ */}
      <section className="py-16 md:py-24 bg-white border-b border-border/20">
        <div
          ref={collectionsReveal.ref}
          className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
        >
          <div
            className={`text-center max-w-lg mx-auto mb-10 md:mb-16 transition-all duration-700 ${
              collectionsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
              EXPLORE EVERYTHING
            </p>
            <h2 className="text-2xl md:text-[36px] font-bold tracking-tight text-foreground font-heading">
              All Collections
            </h2>
            <div
              className={`h-[2px] bg-accent mx-auto mt-4 transition-all duration-700 delay-300 ${
                collectionsReveal.isVisible ? "w-12" : "w-0"
              }`}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {allCollections.map((collection, i) => (
              <Link
                key={collection.title}
                href={collection.href}
                className={`group relative overflow-hidden rounded-sm aspect-[4/5] shadow-sm bg-neutral-100 transition-all duration-700 ${
                  collectionsReveal.isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-[0.96]"
                }`}
                style={{
                  transitionDelay: collectionsReveal.isVisible ? `${200 + i * 120}ms` : "0ms",
                }}
              >
                <ImageWithSkeleton
                  src={collection.image}
                  alt={collection.title}
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105 group-active:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-3 border border-white/10 group-hover:border-white/25 transition-colors pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold mb-1.5">
                    {collection.tag}
                  </p>
                  <h3 className="text-white text-sm md:text-lg font-bold tracking-tight">
                    {collection.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0 transition-all duration-300">
                    <span className="text-[10px] text-white/80 uppercase tracking-wider font-bold font-sans">
                      Shop Now
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/80" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 7. TESTIMONIALS CAROUSEL ═══════ */}
      <section className="py-16 md:py-24 bg-[#f8f5f0] border-b border-border/20">
        <div
          ref={testimonialsReveal.ref}
          className="container mx-auto px-4 md:px-12 lg:px-16 max-w-5xl"
        >
          <div
            className={`text-center max-w-sm mx-auto mb-8 md:mb-10 transition-all duration-700 ${
              testimonialsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              CLIENT REVIEW JOURNAL
            </p>
            <h2 className="text-2xl font-bold text-foreground font-heading mt-2">Testimonials</h2>
          </div>
          <div
            className={`relative p-6 md:p-14 bg-white border border-border/40 shadow-sm rounded-sm text-center transition-all duration-700 delay-200 ${
              testimonialsReveal.isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-[0.97]"
            }`}
          >
            {/* Stars */}
            <div className="flex gap-1 justify-center mb-5 text-accent">
              {[...Array(testimonials[activeTestimonial]?.stars)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-current animate-[scaleIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>

            {/* Quote */}
            <p
              key={activeTestimonial}
              className="text-sm sm:text-base md:text-lg text-foreground/80 font-medium leading-relaxed font-heading max-w-2xl mx-auto italic animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            >
              &ldquo;{testimonials[activeTestimonial]?.quote}&rdquo;
            </p>

            {/* Author */}
            <div
              key={`author-${activeTestimonial}`}
              className="mt-5 animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_0.15s_both]"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {testimonials[activeTestimonial]?.author}
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {testimonials[activeTestimonial]?.designation}
              </p>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2.5 mt-7">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTestimonial === idx
                      ? "w-7 bg-accent"
                      : "w-2 bg-neutral-200 hover:bg-neutral-300"
                  }`}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 8. EDITORIAL / BRAND STORY ═══════ */}
      <section className="py-16 md:py-28 bg-white relative border-b border-border/20">
        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-border/20 hidden lg:block" />
        <div
          ref={editorialReveal.ref}
          className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left: Image */}
            <div
              className={`lg:col-span-5 relative group transition-all duration-700 ${
                editorialReveal.isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="absolute -inset-2 bg-accent-light border border-accent/25 rounded-sm -z-10 translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100 shadow-lg">
                <ImageWithSkeleton
                  src="/images/products/boutique/bouthik 3.webp"
                  alt="Exclusive Silk Abaya Drape"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105 group-active:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div
              className={`lg:col-span-7 space-y-6 lg:pl-6 transition-all duration-700 delay-200 ${
                editorialReveal.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                    THE CREATIVE STORY
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-[44px] font-bold tracking-tight leading-[1.1] text-foreground font-heading">
                  Woven with Artisanal Devotion,
                  <br />
                  <span className="italic font-normal text-muted-foreground font-heading">
                    Crafted to Inspire Poise.
                  </span>
                </h2>
              </div>
              <div className="p-5 md:p-8 bg-[#f8f5f0] border-l-2 border-accent rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-2 right-2 text-accent/10 text-7xl font-serif select-none font-bold">
                  &ldquo;
                </div>
                <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium italic z-10 relative">
                  &ldquo;Every BIBAZ creation represents a harmonious bridge connecting generational
                  loom weavers with contemporary silhouettes, yielding unparalleled luxury draping
                  for the modern woman.&rdquo;
                </p>
              </div>
              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-all rounded-sm shadow-sm active:scale-[0.97]"
                >
                  Explore Collections
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
