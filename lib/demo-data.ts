/**
 * BIBAZ — Demo Product Data
 * Real product data from product_catalog.xlsx
 * Will be replaced with DB queries in Phase 3
 */

import type { ProductCardProps } from "@/components/product/product-card";

// ═══════════════════════════════════════════
// Categories
// ═══════════════════════════════════════════
export const CATEGORIES = [
  {
    name: "Borka & Abaya",
    slug: "borka",
    description: "Elegant everyday & party wear borka and abaya designs",
    image: "/images/products/borka/borka 1.jpg",
    productCount: 5,
  },
  {
    name: "Saree",
    slug: "saree",
    description: "Premium silk, cotton, and designer sarees",
    image: "/images/products/saree/0560000083852.webp",
    productCount: 5,
  },
  {
    name: "Boutique",
    slug: "boutique",
    description: "Exclusive designer boutique wear",
    image: "/images/products/boutique/bouthik 1.webp",
    productCount: 4,
  },
  {
    name: "Three Piece",
    slug: "three-piece",
    description: "Complete coordinated three piece sets",
    image: "/images/products/three-piece/tree prices 1.webp",
    productCount: 4,
  },
];

// ═══════════════════════════════════════════
// All Products (from product_catalog.xlsx)
// ═══════════════════════════════════════════
export const ALL_PRODUCTS: ProductCardProps[] = [
  // --- SAREES ---
  {
    id: "p1",
    name: "Teal Paisley Block Print Cotton Saree",
    slug: "teal-paisley-block-print-cotton-saree",
    price: 2300,
    compareAtPrice: 2500,
    image: "/images/products/saree/0560000083852.webp",
    category: "Saree",
    isNew: true,
  },
  {
    id: "p2",
    name: "Olive Green Floral Block Print Saree",
    slug: "olive-green-floral-block-print-saree",
    price: 2800,
    compareAtPrice: 3000,
    image: "/images/products/saree/shari 2.webp",
    category: "Saree",
  },
  {
    id: "p3",
    name: "Violet Geometric Mirror Work Saree",
    slug: "violet-geometric-mirror-work-saree",
    price: 2500,
    compareAtPrice: 3000,
    image: "/images/products/saree/shari 3.webp",
    category: "Saree",
    isNew: true,
  },
  {
    id: "p4",
    name: "Sky Blue Floral Block Print Silk Saree",
    slug: "sky-blue-floral-block-print-silk-saree",
    price: 1918,
    compareAtPrice: 3000,
    image: "/images/products/saree/shari 4.webp",
    category: "Saree",
  },
  {
    id: "p5",
    name: "Magenta Sheer Geometric Block Print Saree",
    slug: "magenta-sheer-geometric-block-print-saree",
    price: 2800,
    compareAtPrice: 3000,
    image: "/images/products/saree/shari 5.webp",
    category: "Saree",
  },

  // --- THREE PIECE ---
  {
    id: "p6",
    name: "Magenta Zardozi Embroidered 3-Piece Suit",
    slug: "magenta-zardozi-embroidered-3-piece-suit",
    price: 2500,
    compareAtPrice: 2700,
    image: "/images/products/three-piece/tree prices 1.webp",
    category: "Three Piece",
  },
  {
    id: "p7",
    name: "Golden Yellow Floral Printed Kurta Set",
    slug: "golden-yellow-floral-printed-kurta-set",
    price: 3000,
    compareAtPrice: 3200,
    image: "/images/products/three-piece/tree prices 2.webp",
    category: "Three Piece",
    isNew: true,
  },
  {
    id: "p8",
    name: "Hot Pink Paisley Printed 3-Piece Suit",
    slug: "hot-pink-paisley-printed-3-piece-suit",
    price: 2197,
    compareAtPrice: 3000,
    image: "/images/products/three-piece/tree prices 3.webp",
    category: "Three Piece",
  },
  {
    id: "p9",
    name: "Golden Paisley Embellished 3-Piece Suit",
    slug: "golden-paisley-embellished-3-piece-suit",
    price: 2755,
    compareAtPrice: 3000,
    image: "/images/products/three-piece/tree prices 4.webp",
    category: "Three Piece",
  },

  // --- BOUTIQUE ---
  {
    id: "p10",
    name: "Beige Paisley Embellished Designer Suit",
    slug: "beige-paisley-embellished-designer-suit",
    price: 1639,
    compareAtPrice: 3000,
    image: "/images/products/boutique/bouthik 1.webp",
    category: "Boutique",
  },
  {
    id: "p11",
    name: "Black Floral Embroidered Sharara Set",
    slug: "black-floral-embroidered-sharara-set",
    price: 2476,
    compareAtPrice: 3000,
    image: "/images/products/boutique/bouthik 2.webp",
    category: "Boutique",
  },
  {
    id: "p12",
    name: "Blush Pink Embroidered Silk Suit",
    slug: "blush-pink-embroidered-silk-suit",
    price: 2500,
    compareAtPrice: 3000,
    image: "/images/products/boutique/bouthik 3.webp",
    category: "Boutique",
    isNew: true,
  },
  {
    id: "p13",
    name: "Sky Blue Floral Printed Casual 3-Piece",
    slug: "sky-blue-floral-printed-casual-3-piece",
    price: 2500,
    compareAtPrice: 3000,
    image: "/images/products/boutique/bouthik 4.webp",
    category: "Boutique",
  },

  // --- BORKA / ABAYA ---
  {
    id: "p14",
    name: "Dusty Rose Embroidered Butterfly Abaya",
    slug: "dusty-rose-embroidered-butterfly-abaya",
    price: 2500,
    compareAtPrice: 3000,
    image: "/images/products/borka/borka 1.jpg",
    category: "Borka & Abaya",
  },
  {
    id: "p15",
    name: "Purple Floral Bell Sleeve Open Abaya",
    slug: "purple-floral-bell-sleeve-open-abaya",
    price: 2500,
    compareAtPrice: 3000,
    image: "/images/products/borka/borka 2.jpg",
    category: "Borka & Abaya",
    isNew: true,
  },
  {
    id: "p16",
    name: "Maroon Satin Lace-Trim Luxury Abaya",
    slug: "maroon-satin-lace-trim-luxury-abaya",
    price: 2500,
    compareAtPrice: 3000,
    image: "/images/products/borka/borka 3.jpg",
    category: "Borka & Abaya",
  },
  {
    id: "p17",
    name: "Black & White Zebra Print Open Abaya",
    slug: "black-white-zebra-print-open-abaya",
    price: 2500,
    compareAtPrice: 3000,
    image: "/images/products/borka/borka 4.jpg",
    category: "Borka & Abaya",
  },
];

// ═══════════════════════════════════════════
// Filtered Collections
// ═══════════════════════════════════════════
export const NEW_ARRIVALS = ALL_PRODUCTS.filter((p) => p.isNew);
export const FEATURED_PRODUCTS = ALL_PRODUCTS.slice(0, 4);
export const SAREE_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === "Saree");
export const BORKA_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === "Borka & Abaya");
export const BOUTIQUE_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === "Boutique");
export const THREE_PIECE_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === "Three Piece");

// Get products by category slug
export function getProductsByCategory(slug: string): ProductCardProps[] {
  switch (slug) {
    case "borka":
      return BORKA_PRODUCTS;
    case "saree":
      return SAREE_PRODUCTS;
    case "boutique":
      return BOUTIQUE_PRODUCTS;
    case "three-piece":
      return THREE_PIECE_PRODUCTS;
    case "new-arrivals":
      return NEW_ARRIVALS;
    case "featured":
      return FEATURED_PRODUCTS;
    default:
      return ALL_PRODUCTS;
  }
}
