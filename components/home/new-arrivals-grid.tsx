"use client";

/**
 * BIBAZ — New Arrivals Grid (Extracted from home-client.tsx)
 * Product cards grid with Framer Motion stagger animations.
 */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";

/* ──────────────── Types ──────────────── */

export interface ArrivalsProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category?: string;
  isNew?: boolean;
}

interface NewArrivalsGridProps {
  products: ArrivalsProduct[];
}

/* ──────────────── Animation Variants ──────────────── */

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ──────────────── Component ──────────────── */

export function NewArrivalsGrid({ products }: NewArrivalsGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-28 bg-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px 0px" }}
        variants={containerVariants}
        className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl"
      >
        {/* Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 24 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-[2px] bg-accent"
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
        </motion.div>

        {/* Product grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-14"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
