"use client";

/**
 * BIBAZ — Editorial / Brand Story Section (Extracted from home-client.tsx)
 * Premium editorial section with Framer Motion scroll reveal.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/* ──────────────── Image With Skeleton ──────────────── */

function ImageWithSkeleton({
  src,
  alt,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer z-[1]" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

/* ──────────────── Component ──────────────── */

export function EditorialSection() {
  return (
    <section className="py-16 md:py-28 bg-white relative border-b border-border/20">
      <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-border/20 hidden lg:block" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px 0px" }}
        className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="lg:col-span-5 relative group"
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
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="lg:col-span-7 space-y-6 lg:pl-6"
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
