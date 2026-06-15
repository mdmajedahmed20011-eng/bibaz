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

const colorMap: Record<string, string> = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#008000",
  yellow: "#ffff00",
  black: "#000000",
  white: "#ffffff",
  "black/white": "linear-gradient(135deg, #000000 50%, #ffffff 50%)",
  "red/blue": "linear-gradient(135deg, #ff0000 50%, #0000ff 50%)",
  "red blue": "linear-gradient(135deg, #ff0000 50%, #0000ff 50%)",
  maroon: "#800000",
  purple: "#800080",
  "sky blue": "#87ceeb",
  magenta: "#ff00ff",
  "golden yellow": "#ffdf00",
  golden: "#ffd700",
  "olive green": "#808000",
  teal: "#008080",
  "blush pink": "#ffb6c1",
  "dusty rose": "#dcae96",
  beige: "#f5f5dc",
  "hot pink": "#ff69b4",
};

const normalizeStr = (str: string | null | undefined) =>
  str ? str.trim().toLowerCase().replace(/\s+/g, " ") : "";

export function ProductInfo({
  product,
  settings = {},
}: ProductInfoProps & { settings?: Record<string, unknown> }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Normalize and deduplicate sizes
  const availableSizes = useMemo(() => {
    const unique = new Map<string, string>();
    product.variants.forEach((v) => {
      if (v.size) {
        const norm = normalizeStr(v.size);
        if (!unique.has(norm)) {
          unique.set(norm, v.size.trim().replace(/\s+/g, " "));
        }
      }
    });
    return Array.from(unique.values());
  }, [product.variants]);

  // Normalize and deduplicate colors
  const availableColors = useMemo(() => {
    const unique = new Map<string, string>();
    product.variants.forEach((v) => {
      if (v.color) {
        const norm = normalizeStr(v.color);
        if (!unique.has(norm)) {
          unique.set(norm, v.color.trim().replace(/\s+/g, " "));
        }
      }
    });
    return Array.from(unique.values());
  }, [product.variants]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

  // Find selected variant using normalized matching
  const selectedVariant = useMemo(() => {
    let match = product.variants;
    if (availableSizes.length > 0) {
      if (!selectedSize) return null;
      match = match.filter((v) => normalizeStr(v.size) === normalizeStr(selectedSize));
    }
    if (availableColors.length > 0) {
      if (!selectedColor) return null;
      match = match.filter((v) => normalizeStr(v.color) === normalizeStr(selectedColor));
    }
    const inStockMatch = match.find((v) => v.stock > 0);
    return inStockMatch ?? match[0] ?? null;
  }, [product.variants, selectedSize, selectedColor, availableSizes, availableColors]);

  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const isInStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const maxQuantity = selectedVariant?.stock ?? 10;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - currentPrice) / product.compareAtPrice!) * 100)
    : 0;

  // Check if a color is available and in stock for the current selection
  const isColorInStock = (color: string) => {
    const normColor = normalizeStr(color);
    return product.variants.some((v) => {
      const matchColor = normalizeStr(v.color) === normColor;
      const matchSize = !selectedSize || normalizeStr(v.size) === normalizeStr(selectedSize);
      return matchColor && matchSize && v.stock > 0;
    });
  };

  // Check if a size is available and in stock for the current selection
  const isSizeInStock = (size: string) => {
    const normSize = normalizeStr(size);
    return product.variants.some((v) => {
      const matchSize = normalizeStr(v.size) === normSize;
      const matchColor = !selectedColor || normalizeStr(v.color) === normalizeStr(selectedColor);
      return matchColor && matchSize && v.stock > 0;
    });
  };

  const isSelectionComplete = useMemo(() => {
    return (
      (availableSizes.length === 0 || selectedSize !== null) &&
      (availableColors.length === 0 || selectedColor !== null)
    );
  }, [availableSizes, selectedSize, availableColors, selectedColor]);

  const buttonDisabled = !isSelectionComplete || !isInStock;

  const getButtonLabel = () => {
    if (availableSizes.length > 0 && !selectedSize) return "Select Size";
    if (availableColors.length > 0 && !selectedColor) return "Select Color";
    if (!isInStock) return "Out of Stock";
    return "ADD TO BAG";
  };

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (!selectedVariant) {
      toast.error("Selected variant is unavailable");
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

    toast.success("Added to bag", {
      description: `${product.name} — Size ${selectedVariant.size} × ${quantity}`,
    });

    openCart();
  };

  const handleBuyNow = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (!selectedVariant) {
      toast.error("Selected variant is unavailable");
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

      {/* Color Selector */}
      {availableColors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Select Color
              </p>
              {selectedColor && (
                <span className="text-xs text-muted-foreground font-medium">({selectedColor})</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => {
              const inStock = isColorInStock(color);
              const isSelectedNorm = normalizeStr(selectedColor) === normalizeStr(color);
              const normColor = normalizeStr(color);
              const colorStyle = colorMap[normColor];

              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(isSelectedNorm ? null : color)}
                  disabled={!inStock}
                  className={`group relative flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
                    isSelectedNorm
                      ? "ring-2 ring-foreground ring-offset-2 scale-105"
                      : inStock
                        ? "hover:scale-105"
                        : "opacity-40 cursor-not-allowed"
                  }`}
                  style={{ width: "36px", height: "36px" }}
                  title={color}
                  aria-pressed={isSelectedNorm}
                >
                  <span
                    className="h-full w-full rounded-full border border-black/10 shadow-inner"
                    style={{
                      background: colorStyle?.includes("gradient") ? colorStyle : undefined,
                      backgroundColor: !colorStyle?.includes("gradient")
                        ? (colorStyle ?? "#e5e5e5")
                        : undefined,
                    }}
                  />
                  {!colorStyle && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase text-foreground leading-none px-1 text-center truncate">
                      {color.slice(0, 3)}
                    </span>
                  )}
                  <span className="sr-only">{color}</span>
                  {!inStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-full h-[1px] bg-red-500/70 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <div className="mb-6">
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
              const inStock = isSizeInStock(size);
              const isSelectedNorm = normalizeStr(selectedSize) === normalizeStr(size);
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(isSelectedNorm ? null : size)}
                  disabled={!inStock}
                  className={`h-11 min-w-[48px] px-4 text-xs font-semibold uppercase tracking-wider border rounded-sm transition-all duration-200 cursor-pointer ${
                    isSelectedNorm
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : inStock
                        ? "border-border text-foreground hover:border-foreground hover:bg-neutral-50"
                        : "border-border/30 text-muted-foreground/30 line-through cursor-not-allowed bg-neutral-50/20"
                  }`}
                  aria-pressed={isSelectedNorm}
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
      )}

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
            disabled={buttonDisabled}
            className={`flex-1 flex items-center justify-center gap-2 h-12 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 rounded-sm cursor-pointer active:scale-[0.98] ${
              buttonDisabled
                ? "bg-neutral-200 border border-neutral-300 text-neutral-600 font-bold opacity-100 cursor-not-allowed"
                : "bg-foreground hover:bg-neutral-800 text-background"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {getButtonLabel()}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={buttonDisabled}
            className={`flex-1 flex items-center justify-center gap-2 h-12 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 rounded-sm cursor-pointer shadow-sm active:scale-[0.98] ${
              buttonDisabled
                ? "bg-neutral-200 border border-neutral-300 text-neutral-600 font-bold opacity-100 cursor-not-allowed"
                : "bg-[#b33a3a] hover:bg-[#9c2f2f] text-white"
            }`}
          >
            {!isSelectionComplete ? getButtonLabel() : "BUY NOW"}
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
        disabled={buttonDisabled}
        label={getButtonLabel()}
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
