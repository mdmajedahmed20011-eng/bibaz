/**
 * BIBAZ — Product Card Component
 * Displays product image, name, price with hover effects
 * SOP §২ — Frontend Plan F2.4
 *
 * Used in: Homepage (New Arrivals, Featured), Collection pages
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
      className="group block space-y-3"
      aria-label={`View ${name} - ${CURRENCY.SYMBOL}${price}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="inline-flex items-center rounded-md bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center rounded-md bg-destructive px-2 py-0.5 text-[10px] font-semibold text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-md bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider text-background">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 px-0.5">
        {category && (
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{category}</p>
        )}
        <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(price)}</span>
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
