/**
 * BIBAZ — Product Info Component
 * Product name, price, variants, add to cart, delivery info
 * SOP §২ — Frontend Plan F3.7-F3.11
 */

"use client";

import { useState, useMemo } from "react";
import { Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
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

  // Get unique sizes and colors
  const availableSizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants]
  );
  const availableColors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product.variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return (
      product.variants.find((v) => v.size === selectedSize && v.color === selectedColor) ?? null
    );
  }, [product.variants, selectedSize, selectedColor]);

  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const isInStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const maxQuantity = selectedVariant?.stock ?? 10;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > currentPrice;

  // Check if a size is available for selected color
  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return true;
    return product.variants.some(
      (v) => v.size === size && v.color === selectedColor && v.stock > 0
    );
  };

  // Check if a color is available for selected size
  const isColorAvailable = (color: string) => {
    if (!selectedSize) return true;
    return product.variants.some(
      (v) => v.color === color && v.size === selectedSize && v.stock > 0
    );
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

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
      image: "", // Will come from variant images
      maxStock: selectedVariant.stock,
    });

    toast.success("Added to cart", {
      description: `${product.name} (${selectedVariant.size}, ${selectedVariant.color}) × ${quantity}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Name & Price */}
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl font-bold">{formatPrice(currentPrice)}</span>
          {hasDiscount && (
            <>
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
              <span className="text-sm font-medium text-destructive">
                {Math.round(
                  ((product.compareAtPrice! - currentPrice) / product.compareAtPrice!) * 100
                )}
                % OFF
              </span>
            </>
          )}
        </div>
      </div>

      {/* Color Selector */}
      {availableColors.length > 1 && (
        <div>
          <p className="text-sm font-medium mb-2">
            Color: <span className="text-muted-foreground">{selectedColor ?? "Select"}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const available = isColorAvailable(color);
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!available}
                  className={`px-4 py-2 text-sm rounded-md border transition-all ${
                    selectedColor === color
                      ? "bg-foreground text-background border-foreground"
                      : available
                        ? "border-border text-foreground hover:border-foreground"
                        : "border-border text-muted-foreground/50 line-through cursor-not-allowed"
                  }`}
                  aria-pressed={selectedColor === color}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div>
        <p className="text-sm font-medium mb-2">
          Size: <span className="text-muted-foreground">{selectedSize ?? "Select"}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const available = isSizeAvailable(size);
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={!available}
                className={`h-10 min-w-[2.5rem] px-3 text-sm rounded-md border transition-all ${
                  selectedSize === size
                    ? "bg-foreground text-background border-foreground"
                    : available
                      ? "border-border text-foreground hover:border-foreground"
                      : "border-border text-muted-foreground/50 line-through cursor-not-allowed"
                }`}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Status */}
      {selectedVariant && (
        <p
          className={`text-sm font-medium ${
            selectedVariant.stock === 0
              ? "text-destructive"
              : selectedVariant.stock <= 3
                ? "text-warning"
                : "text-success"
          }`}
        >
          {selectedVariant.stock === 0
            ? "Out of Stock"
            : selectedVariant.stock <= 3
              ? `Only ${selectedVariant.stock} left in stock`
              : "In Stock"}
        </p>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3">
        {/* Quantity Selector */}
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex items-center justify-center h-10 w-10 text-sm font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !isInStock}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          {!selectedSize || !selectedColor
            ? "Select Options"
            : !isInStock
              ? "Out of Stock"
              : "Add to Cart"}
        </button>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`flex items-center justify-center h-11 w-11 rounded-lg border transition-colors ${
            isWishlisted
              ? "bg-destructive/10 border-destructive text-destructive"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Delivery Info */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Truck className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
        <div>
          <p className="text-sm font-medium">Delivery Information</p>
          <p className="text-sm text-muted-foreground mt-0.5">{product.deliveryInfo}</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold">Description</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      {/* Features */}
      {product.features.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Features</h2>
          <ul className="space-y-1.5">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
