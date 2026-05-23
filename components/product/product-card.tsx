"use client";

/**
 * BIBAZ — Product Card (Premium v2.0)
 * Borderless, editorial, clean hierarchy
 * Design Guide: No border, no shadow, 3:4 ratio, clean info
 */

import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { useQuickViewStore } from "@/store/quick-view-store";
import { CURRENCY } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category?: string;
  isNew?: boolean;
  isSoldOut?: boolean;
}

function getSecondaryImage(image: string): string {
  if (image.includes("borka 1")) return "/images/products/borka/borka 2.jpg";
  if (image.includes("borka 2")) return "/images/products/borka/borka 3.jpg";
  if (image.includes("borka 3")) return "/images/products/borka/borka 4.jpg";
  if (image.includes("borka 4")) return "/images/products/borka/borka 1.jpg";

  if (image.includes("bouthik 1")) return "/images/products/boutique/bouthik 2.webp";
  if (image.includes("bouthik 2")) return "/images/products/boutique/bouthik 3.webp";
  if (image.includes("bouthik 3")) return "/images/products/boutique/bouthik 4.webp";
  if (image.includes("bouthik 4")) return "/images/products/boutique/bouthik 1.webp";

  if (image.includes("tree prices 1")) return "/images/products/three-piece/tree prices 2.webp";
  if (image.includes("tree prices 2")) return "/images/products/three-piece/tree prices 3.webp";
  if (image.includes("tree prices 3")) return "/images/products/three-piece/tree prices 4.webp";
  if (image.includes("tree prices 4")) return "/images/products/three-piece/tree prices 1.webp";

  if (image.includes("0560000083852")) return "/images/products/saree/shari 2.webp";
  if (image.includes("shari 2")) return "/images/products/saree/shari 3.webp";
  if (image.includes("shari 3")) return "/images/products/saree/shari 4.webp";
  if (image.includes("shari 4")) return "/images/products/saree/shari 5.webp";
  if (image.includes("shari 5")) return "/images/products/saree/0560000083852.webp";

  return image; // Fallback to same image
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  category,
  isNew,
  isSoldOut,
}: ProductCardProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const secondaryImage = getSecondaryImage(image);
  const hasSecondaryImage = secondaryImage !== image;

  const openQuickView = useQuickViewStore((state) => state.openQuickView);

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView({
      id,
      name,
      slug,
      price,
      compareAtPrice,
      image,
      category,
      isNew,
      isSoldOut,
    });
  };

  return (
    <Link
      href={`/products/${slug}`}
      className="group block"
      aria-label={`View ${name} - ${CURRENCY.SYMBOL}${price}`}
    >
      {/* Image Container — 3:4 ratio, editorial sharp edges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] mb-3 md:mb-4">
        {/* Primary Image */}
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-[800ms] cubic-bezier(0.25, 1, 0.5, 1) ${
            hasSecondaryImage
              ? "group-hover:opacity-0 scale-100 group-hover:scale-103"
              : "group-hover:scale-[1.03]"
          }`}
        />

        {/* Secondary Image Swap on Hover */}
        {hasSecondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${name} detail view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-[800ms] cubic-bezier(0.25, 1, 0.5, 1) scale-103 group-hover:scale-100"
          />
        )}

        {/* Badges — minimal, top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isNew && (
            <span className="inline-flex items-center px-2.5 py-0.5 bg-foreground text-background text-[9px] font-bold uppercase tracking-[0.15em] rounded-sm">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center px-2 py-0.5 bg-sale text-white text-[9px] font-bold tracking-wide rounded-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/80 border border-foreground/30 px-3 py-1">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Hover Button (Eye Icon) */}
        {!isSoldOut && (
          <button
            onClick={handleQuickViewClick}
            className="absolute bottom-3 right-3 z-20 flex items-center justify-center h-10 w-10 rounded-full bg-white/95 text-foreground border border-border/40 hover:bg-white hover:text-accent shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer backdrop-blur-[1px] transform md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus:translate-y-0 md:focus:opacity-100"
            title="Quick View"
          >
            <Eye className="h-4.5 w-4.5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Product Info — elegant whitespace and typography */}
      <div className="space-y-1">
        {/* Category overline */}
        {category && (
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
            {category}
          </p>
        )}

        {/* Product name */}
        <h3 className="text-[13px] md:text-[14px] font-medium leading-snug text-foreground line-clamp-2 transition-colors duration-300 group-hover:text-accent font-sans">
          {name}
        </h3>

        {/* Price display with strikethrough styling */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm md:text-[15px] font-semibold text-foreground">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through font-medium">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
