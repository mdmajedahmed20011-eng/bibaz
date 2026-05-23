"use client";

/**
 * BIBAZ — Product Info (Premium v2.0 — Aarong Inspired)
 * Clean layout: Name → Price → Size → Quantity → ADD TO BAG → Accordion sections
 * No product code, no color selector (single color per product for now)
 */

import { useState, useMemo } from "react";
import { Heart, Minus, Plus, ShoppingBag, Truck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface Variant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    compareAtPrice?: number | null;
    variants: Variant[];
    features: string[];
    deliveryInfo: string;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const addItem = useCartStore((state) => state.addItem);

  const availableSizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedSize) return null;
    return product.variants.find((v) => v.size === selectedSize) ?? null;
  }, [product.variants, selectedSize]);

  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const isInStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const maxQuantity = selectedVariant?.stock ?? 10;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - currentPrice) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantSku: selectedVariant.sku,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      quantity,
      image: "",
      maxStock: selectedVariant.stock,
    });

    toast.success("Added to bag", {
      description: `${product.name} — Size ${selectedVariant.size} × ${quantity}`,
    });
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold leading-tight tracking-[-0.01em]">
          {product.name}
        </h1>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-lg md:text-xl font-bold">
          {formatPrice(currentPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
            <span className="text-sm font-medium text-sale">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Size</p>
          {selectedSize && (
            <p className="text-sm text-muted-foreground">{selectedSize}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const variant = product.variants.find((v) => v.size === size);
            const inStock = variant ? variant.stock > 0 : false;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={!inStock}
                className={`h-10 min-w-[44px] px-4 text-sm border transition-all ${selectedSize === size
                  ? "bg-foreground text-background border-foreground"
                  : inStock
                    ? "border-border text-foreground hover:border-foreground"
                    : "border-border/50 text-muted-foreground/40 line-through cursor-not-allowed"
                  }`}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            );
          })}
        </div>
        {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
          <p className="text-xs text-sale mt-2">
            Only {selectedVariant.stock} left in stock
          </p>
        )}
      </div>

      {/* Quantity + Add to Bag */}
      <div className="flex items-center gap-3">
        {/* Quantity */}
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex items-center justify-center h-11 w-11 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex items-center justify-center h-11 w-11 text-sm font-medium border-x border-border">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="flex items-center justify-center h-11 w-11 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add to Bag — Full width, prominent */}
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          {!selectedSize ? "Select Size" : !isInStock ? "Out of Stock" : "ADD TO BAG"}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`flex items-center justify-center h-11 w-11 border transition-colors ${isWishlisted
            ? "border-sale text-sale"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Delivery Info */}
      <div className="flex items-start gap-3 py-4 border-y border-border">
        <Truck className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium">Delivery Information</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.deliveryInfo}
          </p>
        </div>
      </div>

      {/* Accordion Sections — Aarong Style */}
      <div className="divide-y divide-border">
        {/* Description */}
        <AccordionItem
          title="Product Description"
          isOpen={openSection === "description"}
          onToggle={() => toggleSection("description")}
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </AccordionItem>

        {/* Features / Details */}
        <AccordionItem
          title="Details & Care"
          isOpen={openSection === "details"}
          onToggle={() => toggleSection("details")}
        >
          <ul className="space-y-1.5">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </AccordionItem>

        {/* Shipping */}
        <AccordionItem
          title="Shipping & Returns"
          isOpen={openSection === "shipping"}
          onToggle={() => toggleSection("shipping")}
        >
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Dhaka: ৳80 (2-3 business days)</p>
            <p>• Outside Dhaka: ৳150 (3-5 business days)</p>
            <p>• Free delivery on orders above ৳10,000</p>
            <p>• 7-day easy return policy</p>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}

/* Accordion Item Component */
function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 animate-[fadeIn_0.2s_ease-out]">
          {children}
        </div>
      )}
    </div>
  );
}
