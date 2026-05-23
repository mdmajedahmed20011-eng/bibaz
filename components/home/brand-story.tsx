"use client";

/**
 * BIBAZ — Brand Story Component (Premium v2.0 — Aarong Inspired)
 * Immersive storytelling segment linking heritage with modern luxury fashion.
 * Layout: 2-column asymmetric (50% image, 50% narrative text grid).
 */

import Link from "next/link";
import Image from "next/image";

export function BrandStory() {
  return (
    <section className="bg-surface border-t border-border/40 py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Elegant Asymmetric Photo Frame */}
          <div className="lg:col-span-6 relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-sm overflow-hidden shadow-sm group">
            <Image
              src="/images/products/boutique/bouthik 3.webp"
              alt="Artisanal craftmanship at BIBAZ"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Soft gold accent corner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.1),transparent_50%)]" />
          </div>

          {/* Right Side: Editorial narrative and typography */}
          <div className="lg:col-span-6 space-y-6 lg:pl-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              The Art of Weaving Elegance
            </p>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground font-heading">
              Crafted for the Modern Woman,
              <br />
              <span className="italic font-normal text-foreground/80">Inspired by Heritage</span>
            </h2>

            <div className="border-l-2 border-accent/40 pl-4 py-1 text-muted-foreground italic text-sm">
              &ldquo;We believe that clothing is not merely attire &mdash; it is a canvas of local heritage, artisan devotion, and timeless luxury.&rdquo;
            </div>

            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Every thread at BIBAZ tells a story of meticulous dedication. Our designer Borka, luxury Saree, and exclusive Boutique collections are crafted utilizing hand-selected fabrics, custom loom patterns, and refined embroidery techniques.
              </p>
              <p>
                Collaborating directly with generational artisans, we merge traditional Bangladeshi heritage with modern high-fashion silhouettes. The result is a curated collection of rare comfort, rich texture, and elegant poise designed to make you feel extraordinary.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center h-11 px-8 bg-foreground text-background text-xs font-semibold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-all rounded-sm shadow-sm active:scale-[0.98]"
              >
                Our Complete Story
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
