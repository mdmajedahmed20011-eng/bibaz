"use client";

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
  Sparkles,
  ShoppingBag,
  Gift,
} from "lucide-react";
import { ALL_PRODUCTS, CATEGORIES } from "@/lib/demo-data";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice } from "@/lib/utils";

/* ──────────────── Static Default Data (Fallbacks) ──────────────── */

const defaultHeroSlides = [
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

/* ──────────────── Component ──────────────── */

type SectionData = {
  id: string;
  type: string;
  title?: string | null;
  subtitle?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
};

export function HomeClient({ dbSections = [] }: { dbSections: SectionData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Group hero banners
  const heroSections = dbSections.filter((s) => s.type === "hero_banner");
  const otherSections = dbSections.filter((s) => s.type !== "hero_banner");

  const activeHeroSlides =
    heroSections.length > 0
      ? heroSections.map((s) => ({
          image: s.content?.image || "",
          title: s.title || "Special Collection",
          subtitle: s.subtitle || "",
          link: s.content?.link || "/collections/all",
          overline: "FEATURED",
          color: "from-black/60",
        }))
      : defaultHeroSlides;

  // Use original sequence if no custom DB sections are set
  const hasCustomSections = otherSections.length > 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeHeroSlides.length]);

  const handleNextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
  const handlePrevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + activeHeroSlides.length) % activeHeroSlides.length);

  const products = ALL_PRODUCTS.slice(0, 8);

  const renderCategoryGrid = (section: SectionData, key: string) => (
    <section key={key} className="py-20 md:py-24 bg-[#f8f5f0] border-b border-border/40">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="text-center max-w-lg mx-auto mb-14 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
            ATELIER CATEGORIES
          </p>
          <h2 className="text-2xl md:text-[36px] font-bold tracking-tight text-foreground font-heading">
            {section?.title || "Shop Handcrafted Collections"}
          </h2>
          {section?.subtitle && (
            <p className="text-sm text-muted-foreground mt-2">{section.subtitle}</p>
          )}
          <div className="h-[2px] w-12 bg-accent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="group relative overflow-hidden rounded-sm aspect-[3/4] shadow-sm transition-all duration-300 bg-neutral-100"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-3 border border-white/10 group-hover:border-white/20 transition-colors pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold mb-1">
                  {category.productCount} Products
                </p>
                <h3 className="text-white text-base md:text-lg font-bold tracking-tight mb-2">
                  {category.name}
                </h3>
                <p className="text-[10px] text-white/70 max-w-xs leading-relaxed opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-sans uppercase tracking-wider font-semibold">
                  Explore Collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  const renderProductGrid = (section: SectionData, key: string) => (
    <section key={key} className="py-20 md:py-28 bg-white border-b border-border/20">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[2px] w-6 bg-accent" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                {section?.subtitle || "JUST RELEASED"}
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight text-foreground font-heading">
              {section?.title || "New Seasonal Arrivals"}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );

  const renderLookbook = (section: SectionData, key: string) => (
    <section
      key={key}
      className="py-20 md:py-24 bg-[#f8f5f0] border-b border-border/40 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Selector */}
          <div className="lg:col-span-5 space-y-7 z-10">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                {section?.subtitle || "BIBAZ EDITORIALS"}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading leading-tight whitespace-pre-line">
                {section?.title || "Hand-Picked\nAtelier Showcase"}
              </h2>
            </div>

            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Click below to cycle through the curated ensembles designed by our styling directors,
              matching fine textiles with elegant poise.
            </p>

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

          {/* Right: Display */}
          <div className="lg:col-span-7 relative">
            <div className="absolute right-0 top-0 size-72 bg-gradient-to-br from-accent/5 to-transparent rounded-full -z-10 blur-xl translate-x-12 -translate-y-12" />
            {lookbookLooks.map((look, idx) => {
              if (idx !== activeLookIndex) return null;
              return (
                <div
                  key={look.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                >
                  <div className="md:col-span-7 relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100 shadow-md">
                    <Image
                      src={look.image}
                      alt={look.title}
                      fill
                      className="object-cover transition-transform duration-[4000ms] hover:scale-103"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
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
  );

  const renderTestimonials = (section: SectionData, key: string) => (
    <section key={key} className="py-20 md:py-24 bg-[#f8f5f0] border-b border-border/20">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-5xl">
        <div className="text-center max-w-sm mx-auto mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            {section?.subtitle || "CLIENT REVIEW JOURNAL"}
          </p>
          <h2 className="text-2xl font-bold text-foreground font-heading mt-2">
            {section?.title || "Atelier Testimonials"}
          </h2>
        </div>

        <div className="relative p-8 md:p-14 bg-white border border-border/40 shadow-sm rounded-sm text-center">
          <div className="flex gap-1 justify-center mb-6 text-accent">
            {[...Array(testimonials[activeTestimonial]?.stars)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>

          <p className="text-sm sm:text-base md:text-lg text-foreground/80 font-medium leading-relaxed font-heading max-w-2xl mx-auto italic animate-[fadeIn_0.3s_ease-out]">
            &ldquo;{testimonials[activeTestimonial]?.quote}&rdquo;
          </p>

          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {testimonials[activeTestimonial]?.author}
            </h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {testimonials[activeTestimonial]?.designation}
            </p>
          </div>

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
  );

  const renderCustomHtml = (section: SectionData, key: string) => (
    <section key={key} className="py-12 border-b border-border/20">
      <div
        className="container mx-auto px-6"
        dangerouslySetInnerHTML={{ __html: section.content?.html || "" }}
      />
    </section>
  );

  return (
    <div className="flex flex-col bg-[#fdfcfa] overflow-hidden">
      {/* ═══════════════════════════════════════════
         1. DYNAMIC HERO SLIDER
         ═══════════════════════════════════════════ */}
      <section className="relative w-full h-[65vh] md:h-[88vh] overflow-hidden bg-neutral-950 group border-b border-border/20">
        <div className="absolute inset-0 z-20 pointer-events-none border-x-[1px] border-white/5 max-w-7xl mx-auto flex justify-between">
          <div className="w-[1px] h-full bg-white/5" />
          <div className="w-[1px] h-full bg-white/5" />
        </div>

        {activeHeroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.image + index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
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
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/30 to-transparent`}
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              <div className="relative z-20 h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-16">
                  <div
                    className={`max-w-2xl transition-all duration-[1000ms] delay-300 transform ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-[1px] w-8 bg-accent" />
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent font-bold">
                        {slide.overline}
                      </p>
                    </div>
                    <h1 className="text-[36px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-white leading-[1.05] tracking-tight mb-5 font-heading">
                      {slide.title}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-neutral-200 max-w-md leading-relaxed mb-8 md:mb-10 font-medium font-sans">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={slide.link}
                        className="inline-flex items-center justify-center gap-2 h-12 md:h-13 px-8 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm shadow-lg hover:shadow-xl active:scale-[0.98] group/btn cursor-pointer"
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

        {/* Controls */}
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

        {/* Dots */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {activeHeroSlides.map((_, index) => (
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
         2. STATIC TRUST BADGES 
         ═══════════════════════════════════════════ */}
      <section className="relative z-20 -mt-4 bg-[#f8f5f0] border-y border-border/50 shadow-sm py-6 md:py-8 overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 max-w-5xl">
          <div className="grid grid-cols-2 gap-5 md:gap-6">
            <div className="flex items-center gap-3 py-3 md:px-4">
              <div className="p-2.5 bg-white rounded-full text-accent shadow-sm shrink-0">
                <Truck className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground">
                  Express Shipping
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  ৳80 Dhaka | ৳150 Nationwide
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 md:px-4">
              <div className="p-2.5 bg-white rounded-full text-accent shadow-sm shrink-0">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground">
                  Premium Authenticity
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  100% hand-crafted fabrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 md:px-4">
              <div className="p-2.5 bg-white rounded-full text-accent shadow-sm shrink-0">
                <Clock className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground">
                  Easy Returns
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  7-day size exchange support
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 md:px-4">
              <div className="p-2.5 bg-white rounded-full text-accent shadow-sm shrink-0">
                <Gift className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground">
                  Gift Packaging
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Premium gift wrap available
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         3. DYNAMIC SECTIONS RENDERING
         ═══════════════════════════════════════════ */}
      {hasCustomSections ? (
        otherSections.map((section) => {
          if (section.type === "category_grid") return renderCategoryGrid(section, section.id);
          if (section.type === "product_grid") return renderProductGrid(section, section.id);
          if (section.type === "collection_showcase") return renderLookbook(section, section.id);
          if (section.type === "testimonials") return renderTestimonials(section, section.id);
          if (section.type === "custom_html") return renderCustomHtml(section, section.id);
          return null;
        })
      ) : (
        /* Fallback sequence if admin has no sections configured */
        <>
          {renderCategoryGrid(null, "fallback-cat")}
          {renderProductGrid(null, "fallback-prod")}
          {renderLookbook(null, "fallback-lookbook")}
          {renderTestimonials(null, "fallback-testimonials")}
        </>
      )}

      {/* ═══════════════════════════════════════════
         STATIC STORY PROMO (Always at bottom)
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white relative border-b border-border/20">
        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-border/20 hidden lg:block" />
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Image */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 bg-accent-light border border-accent/25 rounded-sm -z-10 translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100 shadow-lg">
                <Image
                  src="/images/products/boutique/bouthik 3.webp"
                  alt="Exclusive Silk Abaya Drape"
                  fill
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-[2px] border border-border px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground">
                  Luxe Series
                </div>
              </div>
            </div>

            {/* Right: Story */}
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

              <div className="p-6 md:p-8 bg-[#f8f5f0] border-l-2 border-accent rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-2 right-2 text-accent/10 text-7xl font-serif select-none font-bold">
                  &ldquo;
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
    </div>
  );
}
