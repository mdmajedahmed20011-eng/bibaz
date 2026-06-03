"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Heart, Minus, Plus, ShoppingBag, Truck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { SizeGuideModal } from "./size-guide-modal";
import { StickyAddToCart } from "./sticky-add-to-cart";
import { toggleWishlist } from "@/actions/account.actions";

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
    images: string[];
  };
}

export function ProductInfo({
  product,
  settings = {},
}: ProductInfoProps & { settings?: Record<string, unknown> }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const availableSizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

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
      image: product.images[0] ?? "", // Fixed the empty string image bug!
      maxStock: selectedVariant.stock,
    });

    toast.success("Added to bag", {
      description: `${product.name} — Size ${selectedVariant.size} × ${quantity}`,
    });

    // Open cart drawer for premium feel
    openCart();
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
      image: product.images[0] ?? "",
      maxStock: selectedVariant.stock,
    });

    toast.success("Proceeding to checkout...", {
      description: `${product.name} — Size ${selectedVariant.size}`,
    });

    router.push("/checkout");
  };

  const handleToggleWishlist = async () => {
    const res = await toggleWishlist(product.id);
    if (res.success) {
      setIsWishlisted(res.isWishlisted ?? false);
      toast.success(res.message);
    } else {
      if (res.error?.includes("Unauthorized")) {
        toast.error("Please login to use wishlist");
        router.push("/login?callbackUrl=/product/" + product.slug);
      } else {
        toast.error(res.error || "Failed to update wishlist");
      }
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Category/Brand overline */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
        BIBAZ LUXURY EDITION
      </p>

      {/* Product Name */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold leading-tight tracking-[-0.02em] font-heading text-foreground">
          {product.name}
        </h1>
      </div>

      {/* Price Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-xl md:text-2xl font-semibold text-foreground">
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

      {/* Divider */}
      <div className="border-t border-border/40" />

      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-baseline gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Select Size
            </p>
            {selectedSize && (
              <span className="text-xs text-muted-foreground font-medium">({selectedSize})</span>
            )}
          </div>
          <SizeGuideModal />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {availableSizes.map((size) => {
            const variant = product.variants.find((v) => v.size === size);
            const inStock = variant ? variant.stock > 0 : false;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={!inStock}
                className={`h-11 min-w-[48px] px-4 text-xs font-semibold uppercase tracking-wider border rounded-sm transition-all duration-200 cursor-pointer ${
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

        {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
          <p className="text-xs font-medium text-sale mt-2.5 animate-pulse">
            Only {selectedVariant.stock} left in stock — shop soon!
          </p>
        )}
      </div>

      {/* Quantity & Actions Grid */}
      <div className="space-y-4">
        {/* Quantity */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Quantity:
          </span>
          <div className="flex items-center border border-border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex items-center justify-center h-10 w-10 text-xs font-semibold border-x border-border">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
              className="flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Add to Bag & Buy Now Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !isInStock}
            className={`flex-1 flex items-center justify-center gap-2 h-12 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 rounded-sm cursor-pointer active:scale-[0.98] ${
              !selectedSize
                ? "bg-neutral-200 border border-neutral-300 text-neutral-600 font-bold opacity-100 cursor-not-allowed"
                : "bg-foreground hover:bg-neutral-800 text-background"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {!selectedSize ? "Select Size" : !isInStock ? "Out of Stock" : "ADD TO BAG"}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={!selectedSize || !isInStock}
            className={`flex-1 flex items-center justify-center gap-2 h-12 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 rounded-sm cursor-pointer shadow-sm active:scale-[0.98] ${
              !selectedSize
                ? "bg-neutral-200 border border-neutral-300 text-neutral-600 font-bold opacity-100 cursor-not-allowed"
                : "bg-[#b33a3a] hover:bg-[#9c2f2f] text-white"
            }`}
          >
            {!selectedSize ? "Select Size" : "BUY NOW"}
          </button>

          {/* Wishlist */}
          <button
            onClick={handleToggleWishlist}
            className={`flex items-center justify-center h-12 w-12 border transition-colors shrink-0 ${
              isWishlisted
                ? "border-sale text-sale"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="flex items-start gap-3 py-4 border-y border-border">
        <Truck className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium">Delivery Information</p>
          <p className="text-xs text-muted-foreground mt-0.5">{product.deliveryInfo}</p>
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
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
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
            <p>• Dhaka: ৳{String(settings.shipping_dhaka ?? 80)} (2-3 business days)</p>
            <p>• Outside Dhaka: ৳{String(settings.shipping_outside ?? 150)} (3-5 business days)</p>
            {Number(settings.free_shipping_threshold ?? 0) > 0 && (
              <p>
                • Free delivery on orders above ৳
                {Number(settings.free_shipping_threshold).toLocaleString()}
              </p>
            )}
            <p>• 7-day easy return policy</p>
          </div>
        </AccordionItem>
      </div>

      {/* Sticky Bottom Add to Cart Bar for Mobile */}
      <StickyAddToCart
        price={currentPrice}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        disabled={!selectedSize || !isInStock}
        label={!selectedSize ? "Select Size" : !isInStock ? "Out of Stock" : "ADD TO BAG"}
      />
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
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="pb-4 animate-[fadeIn_0.2s_ease-out]">{children}</div>}
    </div>
  );
}
