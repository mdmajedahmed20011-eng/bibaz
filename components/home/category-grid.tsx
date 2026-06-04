"use client";

/**
 * BIBAZ — Category Grid (Extracted from home-client.tsx)
 * Animated category cards with Framer Motion staggerChildren.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* ──────────────── Types ──────────────── */

export interface CategoryItem {
  name: string;
  slug: string;
  productCount: number;
  image: string;
}

interface CategoryGridProps {
  categories: CategoryItem[];
}

/* ──────────────── Animation Variants ──────────────── */

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const headingVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

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

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#f8f5f0] border-b border-border/40">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px 0px" }}
        variants={containerVariants}
        className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
      >
        {/* Section heading */}
        <motion.div variants={headingVariants} className="text-center max-w-lg mx-auto mb-10 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
            ATELIER CATEGORIES
          </p>
          <h2 className="text-2xl md:text-[36px] font-bold tracking-tight text-foreground font-heading">
            Shop Collections
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-[2px] bg-accent mx-auto mt-4"
          />
        </motion.div>

        {/* Category cards with staggered animation */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {categories.map((category) => (
            <motion.div key={category.slug} variants={cardVariants}>
              <Link
                href={`/collections/${category.slug}`}
                className="group relative overflow-hidden rounded-sm aspect-[3/4] shadow-sm bg-neutral-100 block"
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
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
