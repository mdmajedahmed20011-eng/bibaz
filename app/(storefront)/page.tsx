"use client";

/**
 * BIBAZ — Ultimate 10x Luxury Homepage (Premium v3.0)
 * Completely rewritten from scratch into a high-fashion visual masterpiece.
 * Aesthetics: Gold & Cream accents, asymmetrical editorial grids, Ken Burns parallax transitions,
 * vertical storytelling dividers, custom testimonials, and elite newsletter panels.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Star,
  ShieldCheck,
  Truck,
  Clock,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { ALL_PRODUCTS, CATEGORIES } from "@/lib/demo-data";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

// Slides for Hero Banner
const heroSlides = [
  {
    image: "/images/homebanner/Biba_NXT-D.jpg",
    title: "ATELIER OF MODEST GRACE",
    subtitle: "Discover our premium handcrafted Borka and Abaya designer series.",
    link: "/collections/borka",
    overline: "NEW SEASON 2026",
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
    overline: "EID CELEBRATIONS",
    color: "from-[#1c2420]/60",
  },
];

// Curated Lookbook Looks
const lookbookLooks = [
  {
    id: "look-1",
    image: "/images/products/borka/borka 3.jpg",
    title: "Modest Grace",
    subtitle: "Maroon Satin Lace Luxury Abaya",
    slug: "maroon-satin-lace-trim-luxury-abaya",
    price: 2500,
    tag: "EVERYDAY LUXE",
  },
  {
    id: "look-2",
    image: "/images/products/saree/0560000083852.webp",
    title: "Traditional Drape",
    subtitle: "Teal Paisley Block Print Cotton Saree",
    slug: "teal-paisley-block-print-cotton-saree",
    price: 2300,
    tag: "HERITAGE PRINT",
  },
  {
    id: "look-3",
    image: "/images/products/three-piece/tree prices 2.webp",
    title: "Coordinated Joy",
    subtitle: "Golden Yellow Floral Printed Kurta Set",
    slug: "golden-yellow-floral-printed-kurta-set",
    price: 3000,
    tag: "FESTIVE EID",
  },
];

// Testimonials
const testimonials = [
  {
    quote:
      "The fabric quality and intricate embroidery on the Golden Yellow Kurta set are simply outstanding. It draped elegantly and felt extremely premium. BIBAZ has completely elevated my festive wardrobe.",
    author: "Ananya Rahman",
    designation: "Verified Buyer — Dhaka",
    stars: 5,
  },
  {
    quote:
      "I am amazed by the butterfly abaya. The fluid silhouette, fine stitch work, and breathable satin fabric represent the highest level of craftsmanship. Highly recommend their luxury modest wear.",
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

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Automatic slideshow rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const products = ALL_PRODUCTS.slice(0, 8); // New arrivals

  return (
    <div className="flex flex-col bg-[#fdfcfa] overflow-hidden">
      {/* ═══════════════════════════════════════════
         1. CINEMATIC KEN BURNS HERO SLIDER — v3.0
         ═══════════════════════════════════════════ */}
      <section className="relative w-full h-[65vh] md:h-[88vh] overflow-hidden bg-neutral-950 group border-b border-border/20">
        {/* Subtle Luxury Frame Lines Overlay */}
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
              {/* Image with slow dynamic Ken Burns scale trigger */}
              <div
                className={`absolute inset-0 transition-transform duration-[8500ms] cubic-bezier(0.1, 1, 0.1, 1) ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />

                {/* Visual Enhancers: Dark Linear and Radial Gradient Masks */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/30 to-transparent`}
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              {/* Overlaid Luxury Content Panel */}
              <div className="relative z-20 h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-16">
                  <div
                    className={`max-w-2xl transition-all duration-[1000ms] delay-300 transform ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    {/* Golden Accent Overline */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-[1px] w-8 bg-accent" />
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent font-bold">
                        {slide.overline}
                      </p>
                    </div>

                    {/* Headline in Serif Display typography */}
                    <h1 className="text-[36px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-white leading-[1.05] tracking-tight mb-5 font-heading">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm md:text-base text-neutral-200 max-w-md leading-relaxed mb-8 md:mb-10 font-medium font-sans">
                      {slide.subtitle}
                    </p>

                    {/* Dynamic Action Link */}
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={slide.link}
                        className="inline-flex items-center justify-center gap-2 h-12 md:h-13 px-8 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm shadow-lg hover:shadow-xl active:scale-[0.98] group/btn cursor-pointer"
                      >
                        Shop Collection
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>

                      <Link
                        href="/collections/new-arrivals"
                        className="inline-flex items-center justify-center h-12 md:h-13 px-8 border border-white/30 hover:border-white text-white text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm backdrop-blur-[2px] cursor-pointer hover:bg-white/5"
                      >
                        Atelier Lookbook
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Manual Slideshow Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-11 md:size-13 rounded-full border border-white/10 bg-black/10 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer backdrop-blur-[2px]"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-11 md:size-13 rounded-full border border-white/10 bg-black/10 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer backdrop-blur-[2px]"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
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

      {/* ═══════════════════════════════════════════
         2. ELITE TRUST BADGES STRIP — v3.0
         ═══════════════════════════════════════════ */}
      <section className="relative z-20 -mt-4 bg-[#f8f5f0] border-y border-border/50 shadow-sm py-5 md:py-6 overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border/60">
            <div className="flex items-center gap-4 justify-center py-2 md:py-0 md:px-4">
              <div className="p-3 bg-white rounded-full text-accent shadow-sm">
                <Truck className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Express Shipping
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  ৳80 Dhaka | ৳150 Nationwide delivery
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center py-3 md:py-0 md:px-4">
              <div className="p-3 bg-white rounded-full text-accent shadow-sm">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Premium Authenticity
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  100% hand-crafted loom fabrics & prints
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center py-2 md:py-0 md:px-4">
              <div className="p-3 bg-white rounded-full text-accent shadow-sm">
                <Clock className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Dynamic Returns
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  7-day easy size exchange support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         3. EDITORIAL ASYMMETRICAL SPLIT PROMO — v3.0
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white relative">
        {/* Subtle Grid Divider Lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-border/20 hidden lg:block" />

        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Parallax Image Showcase (Spans 5 Columns) */}
            <div className="lg:col-span-5 relative group">
              {/* Solid Golden Background Frame Accent */}
              <div className="absolute -inset-2 bg-accent-light border border-accent/25 rounded-sm -z-10 translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />

              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100 shadow-lg">
                <Image
                  src="/images/products/boutique/bouthik 3.webp"
                  alt="Exclusive Silk Abaya Drape"
                  fill
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Corner Label */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-[2px] border border-border px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground">
                  Luxe Series
                </div>
              </div>
            </div>

            {/* Right Side: Editorial Storytelling (Spans 7 Columns) */}
            <div className="lg:col-span-7 space-y-7 lg:pl-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                    THE CREATIVE STORY
                  </p>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-[1.1] text-foreground font-heading">
                  Woven with Artisanal Devotion,
                  <br />
                  <span className="italic font-normal text-muted-foreground font-heading">
                    Crafted to Inspire Poise.
                  </span>
                </h2>
              </div>

              {/* Large Gold Quote Card */}
              <div className="p-6 md:p-8 bg-[#f8f5f0] border-l-2 border-accent rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-2 right-2 text-accent/10 text-7xl font-serif select-none font-bold">
                  “
                </div>
                <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium italic z-10 relative">
                  &ldquo;Every BIBAZ creation represents a harmonious bridge connecting generational
                  loom weavers of Bangladesh with contemporary high-fashion silhouettes, yielding
                  unparalleled luxury draping for the modern woman.&rdquo;
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Our designer abayas, luxury sarees, and curated boutique co-ords are engineered
                using selected premium linen, organic silk, and breathable cotton. From delicate
                hand-stitched lace motifs to exquisite paisley patterns, each piece represents the
                zenith of craftsmanship.
              </p>

              {/* Luxury Call-to-action list */}
              <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-accent font-bold">
                    ATELIER QUALITY
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    100% Quality checked stitching & fabric
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-accent font-bold">
                    EXQUISITE MOTIFS
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generational artisan craft & detailing
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-all rounded-sm shadow-sm"
                >
                  Explore Our Legacy
                </Link>
                <Link
                  href="/collections/boutique"
                  className="inline-flex items-center justify-center h-12 px-8 border border-border hover:border-foreground text-foreground text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm hover:bg-neutral-50"
                >
                  View Boutique Wear
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         4. HIGH-FASHION CATEGORY GRID — v3.0
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-[#f8f5f0] border-y border-border/40">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          {/* Editorial Section Heading */}
          <div className="text-center max-w-lg mx-auto mb-14 md:mb-16">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
              ATELIER CATEGORIES
            </p>
            <h2 className="text-2xl md:text-[36px] font-bold tracking-tight text-foreground font-heading">
              Shop Handcrafted Collections
            </h2>
            <div className="h-[2px] w-12 bg-accent mx-auto mt-4" />
          </div>

          {/* Asymmetric Category Grid: Spans columns dramatically */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
            {CATEGORIES.map((category, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <Link
                  key={category.slug}
                  href={`/collections/${category.slug}`}
                  className={`group relative overflow-hidden rounded-sm aspect-[4/5] md:aspect-auto md:min-h-[460px] shadow-sm transition-all duration-300 ${
                    isLarge ? "md:col-span-2" : "md:col-span-1"
                  }`}
                >
                  {/* Category Image with Scale Hover */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    sizes={
                      isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"
                    }
                  />

                  {/* Luxury Inner Border Accent */}
                  <div className="absolute inset-3 border border-white/10 group-hover:border-white/20 transition-colors pointer-events-none z-10" />

                  {/* Dark Radial Mask to read white text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category Labels */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold mb-1">
                      {category.productCount} Products
                    </p>
                    <h3 className="text-white text-lg md:text-xl font-bold tracking-tight mb-2">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-white/70 max-w-xs leading-relaxed opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-sans uppercase tracking-wider font-semibold">
                      Explore Atelier Collection →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         5. NEW ARRIVALS GRID (INTERACTIVE COVERS) — v3.0
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[2px] w-6 bg-accent" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                  JUST RELEASED
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight text-foreground font-heading">
                New Seasonal Arrivals
              </h2>
            </div>

            <Link
              href="/collections/new-arrivals"
              className="text-xs font-bold uppercase tracking-[0.2em] text-foreground border-b border-accent hover:border-foreground pb-1.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              Browse All Items
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Product Grid — 4 Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         6. THE BRAND LOOKBOOK / TREND BOARD — v3.0
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-[#f8f5f0] border-t border-border/40 overflow-hidden relative">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Interactive Selector Panel (Spans 5 Columns) */}
            <div className="lg:col-span-5 space-y-7 z-10">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                  BIBAZ EDITORIALS
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading leading-tight">
                  Hand-Picked <br />
                  Atelier Showcase
                </h2>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-sm">
                Click below to cycle through the curated ensembles designed by our styling
                directors, matching fine textiles with elegant poise.
              </p>

              {/* Selector Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                {lookbookLooks.map((look, idx) => (
                  <button
                    key={look.id}
                    onClick={() => setActiveLookIndex(idx)}
                    className={`flex items-center justify-between p-4 border text-left rounded-sm transition-all duration-300 cursor-pointer ${
                      activeLookIndex === idx
                        ? "bg-white border-accent shadow-sm pl-6"
                        : "border-border/60 bg-transparent text-muted-foreground hover:bg-white/40 hover:text-foreground"
                    }`}
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-accent font-bold">
                        {look.tag}
                      </p>
                      <h4 className="text-sm font-bold text-foreground mt-0.5">{look.title}</h4>
                    </div>
                    <span
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        activeLookIndex === idx ? "bg-accent scale-120" : "bg-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Panoramic Display Frame (Spans 7 Columns) */}
            <div className="lg:col-span-7 relative">
              {/* Backing Gold Ornament */}
              <div className="absolute right-0 top-0 size-72 bg-gradient-to-br from-accent/5 to-transparent rounded-full -z-10 blur-xl translate-x-12 -translate-y-12" />

              {lookbookLooks.map((look, idx) => {
                const isActive = idx === activeLookIndex;
                if (!isActive) return null;
                return (
                  <div
                    key={look.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                  >
                    {/* Look Image wrapper (Spans 7 Cols) */}
                    <div className="md:col-span-7 relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100 shadow-md">
                      <Image
                        src={look.image}
                        alt={look.title}
                        fill
                        className="object-cover transition-transform duration-[4000ms] hover:scale-103"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    </div>

                    {/* Look Info wrapper (Spans 5 Cols) */}
                    <div className="md:col-span-5 space-y-4">
                      <span className="inline-flex px-2 py-0.5 bg-accent/15 border border-accent/25 rounded-sm text-[9px] text-accent font-bold uppercase tracking-wider">
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
                          className="inline-flex items-center justify-center gap-2 w-full h-11 bg-foreground hover:bg-neutral-800 text-background text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Buy Product
                        </Link>
                        <Link
                          href={`/products/${look.slug}`}
                          className="inline-flex items-center justify-center w-full h-11 border border-border hover:border-foreground text-foreground text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm hover:bg-white"
                        >
                          View Details
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

      {/* ═══════════════════════════════════════════
         7. ATELIER STORY & HERITAGE PANEL — v3.0
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-white border-b border-border/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start divide-y lg:divide-y-0 lg:divide-x divide-border/50">
            <div className="space-y-4 lg:pr-8 py-4 lg:py-0">
              <span className="text-xs font-bold text-accent tracking-widest font-heading italic">
                01. Legacy Loom
              </span>
              <h3 className="text-xl font-bold text-foreground font-heading">Handwoven Heritage</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                We work alongside master handloom weavers in remote Bangladeshi heritage villages,
                maintaining age-old traditional block-printing patterns intact and preventing
                original designs from fading.
              </p>
            </div>

            <div className="space-y-4 lg:px-8 py-6 lg:py-0">
              <span className="text-xs font-bold text-accent tracking-widest font-heading italic">
                02. Modern Silhouette
              </span>
              <h3 className="text-xl font-bold text-foreground font-heading">Couture Tailoring</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Every Borka, Abaya, and Co-ord set is refined by internal master drapers to deliver
                comfortable modesty. We optimize measurements to balance flowy coverage with elegant
                movement.
              </p>
            </div>

            <div className="space-y-4 lg:pl-8 py-4 lg:py-0">
              <span className="text-xs font-bold text-accent tracking-widest font-heading italic">
                03. Slow Fashion
              </span>
              <h3 className="text-xl font-bold text-foreground font-heading">
                Ethically Hand-Crafted
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Rejecting mass production, BIBAZ strictly develops high-fashion items in limited
                artisanal batches. This ensures pristine quality and minimal waste, supporting fair
                wages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         8. ELITE CLIENT TESTIMONIALS CAROUSEL — v3.0
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-[#f8f5f0] border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-5xl">
          <div className="text-center max-w-sm mx-auto mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              CLIENT REVIEW JOURNAL
            </p>
            <h2 className="text-2xl font-bold text-foreground font-heading mt-2">
              Atelier Testimonials
            </h2>
          </div>

          <div className="relative p-8 md:p-14 bg-white border border-border/40 shadow-sm rounded-sm text-center">
            {/* Stars */}
            <div className="flex gap-1 justify-center mb-6 text-accent">
              {[...Array(testimonials[activeTestimonial]?.stars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-currentColor" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 font-medium leading-relaxed font-heading max-w-2xl mx-auto italic animate-[fadeIn_0.3s_ease-out]">
              &ldquo;{testimonials[activeTestimonial]?.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {testimonials[activeTestimonial]?.author}
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {testimonials[activeTestimonial]?.designation}
              </p>
            </div>

            {/* Navigators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTestimonial === idx ? "w-6 bg-accent" : "w-2 bg-neutral-200"
                  }`}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         9. PREMIUM DARK NEWSLETTER SIGN-UP — v3.0
         ═══════════════════════════════════════════ */}
      <section className="relative bg-neutral-950 text-white py-20 md:py-24 overflow-hidden border-t border-white/5">
        {/* Abstract Gold Radial Glow */}
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.06),transparent_60%)] pointer-events-none" />
        <div className="absolute left-10 top-10 w-[300px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.03),transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-4xl relative z-10 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-accent uppercase tracking-widest font-bold font-sans">
              <Sparkles className="h-3 w-3 text-accent animate-pulse" />
              BIBAZ PRIVÉ CLUB
            </span>
            <h2 className="text-3xl md:text-[42px] font-bold text-white font-heading leading-tight tracking-tight">
              Unlock Elite Seasonal Edits
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              Subscribe to the BIBAZ Privé ledger and be the first to receive notifications on
              designer Eid drops, rare textiles, and exclusive client trunk shows.
            </p>
          </div>

          {/* Premium Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Welcome to BIBAZ Privé Club", {
                description: "You have successfully subscribed to the ledger.",
              });
            }}
            className="mt-10 max-w-md mx-auto flex flex-col sm:flex-row gap-3 items-stretch justify-center"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 h-12 px-5 bg-white/5 border border-white/15 focus:border-accent text-white text-xs font-medium tracking-wide rounded-sm outline-none placeholder-neutral-500 transition-all font-sans"
            />
            <button
              type="submit"
              className="h-12 px-8 bg-accent hover:bg-accent/90 text-neutral-950 text-xs font-bold uppercase tracking-[0.15em] rounded-sm transition-all shadow-lg shadow-accent/5 active:scale-[0.98] cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[10px] text-neutral-500 mt-4 leading-relaxed font-sans">
            By subscribing, you agree to our privacy conditions and general ledger protocols.
          </p>
        </div>
      </section>
    </div>
  );
}
