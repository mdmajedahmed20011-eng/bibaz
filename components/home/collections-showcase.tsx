"use client";

/**
 * BIBAZ — Collections Showcase (Extracted from home-client.tsx)
 * All collections grid with Framer Motion scroll reveal.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

/* ──────────────── Types ──────────────── */

export interface CollectionShowcaseItem {
  title: string;
  image: string;
  href: string;
  tag: string;
}

interface CollectionsShowcaseProps {
  collections: CollectionShowcaseItem[];
}

/* ──────────────── Animation Variants ──────────────── */

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

export function CollectionsShowcase({ collections }: CollectionsShowcaseProps) {
  if (collections.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-border/20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px 0px" }}
        variants={containerVariants}
        className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
      >
        <motion.div variants={headingVariants} className="text-center max-w-lg mx-auto mb-10 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
            EXPLORE EVERYTHING
          </p>
          <h2 className="text-2xl md:text-[36px] font-bold tracking-tight text-foreground font-heading">
            All Collections
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-[2px] bg-accent mx-auto mt-4"
          />
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {collections.map((collection) => (
            <motion.div key={collection.title} variants={cardVariants}>
              <Link
                href={collection.href}
                className="group relative overflow-hidden rounded-sm aspect-[4/5] shadow-sm bg-neutral-100 block"
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
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
