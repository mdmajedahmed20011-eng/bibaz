"use client";

/**
 * BIBAZ — Quick View Modal (Premium v4.0)
 * Glassmorphism modal with REAL variant data fetched from DB.
 * No more fake/hardcoded variants — fetches via getProductVariants server action.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Heart, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useQuickViewStore, type QuickViewProduct } from "@/store/quick-view-store";
import { getProductVariants, type QuickViewVariant } from "@/actions/quick-view.actions";

export function QuickViewModal() {
  const { isOpen, product, closeQuickView } = useQuickViewStore();

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-neutral-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      {/* Click Outside to Close */}
      <div className="absolute inset-0" onClick={closeQuickView} />

      {/* Modal Container — Inner mounted with unique key to reset state */}
      <QuickViewModalInner key={product.id} product={product} onClose={closeQuickView} />
    </div>
  );
}

interface QuickViewModalInnerProps {
  product: QuickViewProduct;
  onClose: () => void;
}

function QuickViewModalInner({ product, onClose }: QuickViewModalInnerProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // States
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Real variant state
  const [variants, setVariants] = useState<QuickViewVariant[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(true);

  // Fetch real variants from DB when the modal opens
  useEffect(() => {
    let cancelled = false;

    async function fetchVariants() {
      setIsLoadingVariants(true);
      const result = await getProductVariants(product.id);
      if (!cancelled) {
        setVariants(result.success ? result.data : []);
        setIsLoadingVariants(false);
      }
    }

    fetchVariants();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  // Derive unique sizes from real variants
  const availableSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];

  // Find selected variant
  const selectedVariant = selectedSize
    ? (variants.find((v) => v.size === selectedSize) ?? null)
    : null;

  const currentPrice = selectedVariant?.price ?? product.price;
  const isInStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const maxQuantity = selectedVariant?.stock ?? 10;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - currentPrice) / product.compareAtPrice!) * 100)
    : 0;

  // Build image gallery from variant images + product image
  const variantImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : variants.length > 0
      ? variants.flatMap((v) => v.images || [])
      : [];

  const allImages = variantImages.length > 0
    ? [...new Set([product.image, ...variantImages])]
    : [product.image];

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
      image: product.image,
      maxStock: selectedVariant.stock,
    });

    toast.success("Added to bag", {
      description: `${product.name} — Size ${selectedVariant.size} × ${quantity}`,
    });

    onClose();
  };

  const handleBuyNow = () => {
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
      image: product.image,
      maxStock: selectedVariant.stock,
    });

    toast.success("Proceeding to checkout...", {
      description: `${product.name} — Size ${selectedVariant.size}`,
    });

    onClose();
    router.push("/checkout");
  };

  return (
    <div className="relative w-full max-w-4xl bg-[#fdfcfa]/98 border border-white/20 shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-[85vh] animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-muted-foreground hover:text-foreground transition-colors border border-border/40 cursor-pointer"
        aria-label="Close modal"
      >
        <X className="h-4.5 w-4.5" />
      </button>

      {/* Left Section: Gallery (50%) */}
      <div className="w-full md:w-1/2 bg-[#f5f5f5] p-6 flex flex-col justify-between max-h-[40vh] md:max-h-full">
        <div className="relative flex-1 aspect-[3/4] max-h-[35vh] md:max-h-[55vh] overflow-hidden rounded-sm bg-neutral-100">
          <Image
            src={allImages[activeImageIndex] ?? product.image}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-700 hover:scale-103 bg-[#f5f5f5]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="inline-flex items-center px-2 py-0.5 bg-foreground text-background text-[9px] font-bold uppercase tracking-[0.15em] rounded-sm">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center px-2 py-0.5 bg-sale text-white text-[9px] font-bold tracking-wide rounded-sm">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Thumbnails if multiple images exist */}
        {allImages.length > 1 && (
          <div className="flex gap-2.5 mt-4 justify-center overflow-x-auto scrollbar-hide">
            {allImages.slice(0, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-14 w-11 overflow-hidden border transition-all cursor-pointer shrink-0 ${
                  activeImageIndex === idx
                    ? "border-accent scale-103 shadow-sm"
                    : "border-border/60 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Section: Details (50%) */}
      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full bg-white">
        <div className="space-y-5">
          {/* Category / Brand Overline */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-1">
              {product.category || "BIBAZ LUXURY EDITION"}
            </p>
            <h2 className="text-xl md:text-2xl font-bold leading-tight font-heading text-foreground tracking-[-0.01em]">
              {product.name}
            </h2>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-semibold text-foreground">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-muted-foreground line-through font-medium">
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <span className="text-xs font-bold text-sale bg-sale/5 px-2 py-0.5 rounded-sm">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="border-t border-border/40" />

          {/* Size Selector */}
          <div>
            <div className="flex items-baseline gap-2 mb-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Select Size
              </p>
              {selectedSize && (
                <span className="text-xs text-muted-foreground font-medium">({selectedSize})</span>
              )}
            </div>

            {isLoadingVariants ? (
              <div className="flex items-center gap-2 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span className="text-xs text-muted-foreground">Loading sizes...</span>
              </div>
            ) : availableSizes.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No sizes available for this product.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const variant = variants.find((v) => v.size === size);
                  const inStock = variant ? variant.stock > 0 : false;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                        setActiveImageIndex(0);
                      }}
                      disabled={!inStock}
                      className={`h-10 min-w-[42px] px-3.5 text-xs font-semibold border rounded-sm transition-all duration-200 cursor-pointer ${
                        selectedSize === size
                          ? "bg-foreground text-background border-foreground shadow-sm"
                          : inStock
                            ? "border-border text-foreground hover:border-foreground hover:bg-neutral-50"
                            : "border-border/30 text-muted-foreground/30 line-through cursor-not-allowed bg-neutral-50/20"
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Color indicator if selected variant has color */}
            {selectedVariant?.color && selectedVariant.color !== "As Shown" && (
              <p className="text-[10px] text-muted-foreground mt-2">
                Color: <span className="font-semibold text-foreground">{selectedVariant.color}</span>
              </p>
            )}

            {/* Stock indicator */}
            {selectedVariant && (
              <p className={`text-[10px] mt-1.5 font-medium ${
                selectedVariant.stock <= 3 && selectedVariant.stock > 0
                  ? "text-warning"
                  : selectedVariant.stock === 0
                    ? "text-sale"
                    : "text-success"
              }`}>
                {selectedVariant.stock === 0
                  ? "Out of stock"
                  : selectedVariant.stock <= 3
                    ? `Only ${selectedVariant.stock} left!`
                    : "In stock"}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              Quantity:
            </span>
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex items-center justify-center h-9 w-9 text-xs font-semibold border-x border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                className="flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3.5">
          {/* Primary Actions Grid */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !isInStock || isLoadingVariants}
              className={`flex-1 flex items-center justify-center gap-2 h-11 text-xs font-bold uppercase tracking-[0.12em] transition-all rounded-sm cursor-pointer ${
                !selectedSize || isLoadingVariants
                  ? "bg-neutral-100 border border-neutral-200 text-neutral-400 opacity-60 cursor-not-allowed"
                  : "bg-foreground hover:bg-neutral-800 text-background"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {isLoadingVariants
                ? "Loading..."
                : !selectedSize
                  ? "Select Size"
                  : !isInStock
                    ? "Out of Stock"
                    : "ADD TO BAG"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!selectedSize || !isInStock || isLoadingVariants}
              className={`flex-1 flex items-center justify-center gap-2 h-11 text-xs font-bold uppercase tracking-[0.12em] transition-all rounded-sm cursor-pointer shadow-sm ${
                !selectedSize || isLoadingVariants
                  ? "bg-neutral-100 border border-neutral-200 text-neutral-400 opacity-60 cursor-not-allowed"
                  : "bg-[#b33a3a] hover:bg-[#9c2f2f] text-white"
              }`}
            >
              {isLoadingVariants ? "Loading..." : !selectedSize ? "Select Size" : "BUY NOW"}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`flex items-center justify-center h-11 w-11 border transition-colors shrink-0 ${
                isWishlisted
                  ? "border-sale text-sale bg-sale/5"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* View Full details */}
          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="block w-full text-center py-2.5 border border-border/70 hover:border-foreground text-xs font-bold uppercase tracking-[0.15em] text-foreground/80 hover:text-foreground transition-all rounded-sm hover:bg-neutral-50"
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
