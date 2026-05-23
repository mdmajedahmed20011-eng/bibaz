/**
 * BIBAZ — About Page (Premium v2.0)
 * Immersive brand story, artisanal heritage, visual values cards
 * Design Guide: 10x advanced luxury brand editorial layout
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story — BIBAZ",
  description:
    "Discover the artisanal heritage, philosophy, and values behind BIBAZ premium fashion.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* 1. Header Section — Immersive Editorial */}
      <section className="relative py-16 md:py-24 bg-surface-warm/40 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold animate-[slideDown_0.5s_ease-out]">
              BIBAZ Heritage
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-[54px] font-bold font-heading tracking-[-0.03em] leading-tight text-foreground animate-[fadeInUp_0.6s_ease-out]">
              Crafting Elegance, <br />
              <span className="italic font-normal">Inspiring Stories</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto pt-2 animate-[fadeIn_0.8s_ease-out]">
              Curating high-fashion ethnic and modest wear for the modern woman, blending timeless
              craftsmanship with modern sensibilities.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Brand Story split grid — 10x Asymmetrical layout */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column: Asymmetrical Editorial Image Panel (5 cols) */}
            <div className="lg:col-span-5 reveal">
              <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden border border-border/40 shadow-sm group">
                <Image
                  src="/images/products/boutique/bouthik 3.webp"
                  alt="Artisanal tailoring at BIBAZ"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300" />
              </div>
            </div>

            {/* Right Column: Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 reveal [transition-delay:200ms]">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight text-foreground">
                  Our Artistic Journey
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  BIBAZ was founded in 2015 with a singular, passionate philosophy — that luxury
                  modest fashion and fine sarees should be both exquisitely crafted and accessible.
                  We believe clothing is not merely attire; it is an intimate canvas of local
                  heritage, artisan devotion, and timeless elegance.
                </p>
              </div>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Every single piece in our collection — from the fluid silhouettes of our signature
                abayas and embroidered borkas to the royal elegance of our hand-blocked sarees — is
                curated with meticulous care. We partner with local weavers and skilled master
                tailors, ensuring every thread narrates a story of dedication, premium fabric
                quality, and design precision.
              </p>

              <div className="pt-4">
                <Link
                  href="/collections/new-arrivals"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground border-b border-foreground/60 hover:border-foreground pb-1.5 transition-all"
                >
                  Explore Current Collection
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Immersive Philosophy Blockquote Section */}
      <section className="relative py-20 md:py-24 bg-surface-warm/30 border-y border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.04),transparent_70%)]" />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8 reveal">
            <span className="inline-flex items-center justify-center size-10 rounded-full bg-accent-light text-accent">
              <Sparkles className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <blockquote className="text-lg md:text-[26px] font-medium font-heading leading-relaxed italic text-foreground px-4 md:px-8">
              &ldquo;We believe that elegance is not about being noticed, it is about being
              remembered. Our collections are designed to empower the modern woman with confidence,
              grace, and uncompromised modest comfort.&rdquo;
            </blockquote>
            <div className="w-12 h-[1px] bg-accent/40 mx-auto" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground">
                Habiba Hafiz
              </p>
              <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                Founder & Creative Director, BIBAZ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Values Section — 3-Column Luxury Cards */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 md:mb-20 reveal">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              Our Core Pillars
            </p>
            <h2 className="text-2xl md:text-[34px] font-bold font-heading tracking-tight text-foreground">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: Artisanal Guarantee */}
            <div className="group border border-border/50 hover:border-foreground p-8 rounded-sm bg-[#fafafa]/50 hover:bg-background transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full shadow-sm reveal">
              <div className="space-y-4">
                <span className="inline-flex items-center justify-center size-12 rounded-sm bg-accent-light text-accent group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-base font-bold uppercase tracking-wider text-foreground pt-2">
                  Artisanal Guarantee
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-1">
                  We handpick every raw fabric, inspect every thread density, and review each master
                  stitch. Quality is not a metric for us — it is our identity.
                </p>
              </div>
            </div>

            {/* Card 2: Accessible Luxury */}
            <div className="group border border-border/50 hover:border-foreground p-8 rounded-sm bg-[#fafafa]/50 hover:bg-background transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full shadow-sm reveal [transition-delay:150ms]">
              <div className="space-y-4">
                <span className="inline-flex items-center justify-center size-12 rounded-sm bg-accent-light text-accent group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <Sparkles className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-base font-bold uppercase tracking-wider text-foreground pt-2">
                  Accessible Luxury
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-1">
                  By cutting out middle wholesalers and designing in-house collections, we deliver
                  premium fabrics, zardozi embroidery, and bespoke tailoring at fair, direct prices.
                </p>
              </div>
            </div>

            {/* Card 3: Seamless Flow */}
            <div className="group border border-border/50 hover:border-foreground p-8 rounded-sm bg-[#fafafa]/50 hover:bg-background transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full shadow-sm reveal [transition-delay:300ms]">
              <div className="space-y-4">
                <span className="inline-flex items-center justify-center size-12 rounded-sm bg-accent-light text-accent group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <Heart className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-base font-bold uppercase tracking-wider text-foreground pt-2">
                  Tactile Devotion
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-1">
                  Your trust is our highest reward. Enjoy 7-day hassle-free exchanges, fast secured
                  deliveries, and a customer support team that treats you like family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
