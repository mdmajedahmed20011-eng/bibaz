/**
 * BIBAZ — Product Card (Premium v2.0)
 * Borderless, editorial, clean hierarchy
 * Design Guide: No border, no shadow, 3:4 ratio, clean info
 */

import Link from "next/link";
import Image from "next/image";
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

export function ProductCard({
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

  return (
    <Link
      href={`/products/${slug}`}
      className="group block"
      aria-label={`View ${name} - ${CURRENCY.SYMBOL}${price}`}
    >
      {/* Image — 3:4 ratio, no border radius (editorial) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] mb-3 md:mb-4">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Badges — minimal, top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="inline-flex items-center px-2 py-0.5 bg-foreground text-background text-[10px] font-semibold uppercase tracking-[0.1em]">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center px-2 py-0.5 bg-sale text-white text-[10px] font-semibold">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground/70">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info — Clean hierarchy */}
      <div className="space-y-1">
        {/* Category overline */}
        {category && (
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
            {category}
          </p>
        )}

        {/* Product name */}
        <h3 className="text-[13px] md:text-sm font-medium leading-snug text-foreground line-clamp-2 group-hover:opacity-70 transition-opacity duration-200">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm md:text-[15px] font-semibold text-foreground">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
