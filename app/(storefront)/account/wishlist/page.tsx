/**
 * BIBAZ — Wishlist Page
 * Saved products grid
 * SOP §২ — Frontend Plan F5.9
 */

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard, type ProductCardProps } from "@/components/product/product-card";
import { Separator } from "@/components/ui/separator";

// Placeholder wishlist items
const wishlistItems: ProductCardProps[] = [
  {
    id: "w1",
    name: "Luxury Handwoven Jamdani Saree",
    slug: "luxury-handwoven-jamdani-saree",
    price: 8500,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/wishlist-1.jpg",
    category: "Saree",
  },
  {
    id: "w2",
    name: "Premium Abaya — Midnight Black",
    slug: "premium-abaya-midnight-black",
    price: 4200,
    compareAtPrice: 5000,
    image: "https://res.cloudinary.com/dnbol4pey/image/upload/v1/bibaz/wishlist-2.jpg",
    category: "Borka",
  },
];

export default function WishlistPage() {
  if (wishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">My Wishlist</h2>
        <Separator />
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/30" />
          <div>
            <h3 className="text-base font-semibold">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">Save items you love for later.</p>
          </div>
          <Link
            href="/collections/new-arrivals"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Wishlist ({wishlistItems.length})</h2>
      </div>
      <Separator />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {wishlistItems.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
