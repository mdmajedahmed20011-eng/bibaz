/**
 * BIBAZ — One-time Product Seed Route (Production-safe)
 *
 * GET /api/seed-products — Seeds categories, products, variants, coupons into DB
 *
 * Safety: Only runs if products table is empty. Idempotent — safe to call multiple times.
 * DELETE THIS FILE after successful seed for security.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check if products already exist
    const existingCount = await prisma.product.count();
    if (existingCount > 0) {
      return NextResponse.json({
        message: `Database already has ${existingCount} products. Seed skipped.`,
        hint: "Delete all products first if you want to re-seed.",
      });
    }

    // ═══════════════════════════════════════════
    // 1. SEED CATEGORIES
    // ═══════════════════════════════════════════
    const categories = [
      {
        name: "Borka & Abaya",
        slug: "borka",
        image: "/images/products/borka/borka 1.jpg",
        sortOrder: 1,
      },
      {
        name: "Saree",
        slug: "saree",
        image: "/images/products/saree/0560000083852.webp",
        sortOrder: 2,
      },
      {
        name: "Boutique",
        slug: "boutique",
        image: "/images/products/boutique/bouthik 1.webp",
        sortOrder: 3,
      },
      {
        name: "Three Piece",
        slug: "three-piece",
        image: "/images/products/three-piece/tree prices 1.webp",
        sortOrder: 4,
      },
    ];

    const categoryMap = new Map<string, string>();

    for (const cat of categories) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, image: cat.image, sortOrder: cat.sortOrder },
        create: {
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      });
      categoryMap.set(cat.slug, created.id);
    }

    // ═══════════════════════════════════════════
    // 2. SEED PRODUCTS WITH VARIANTS
    // ═══════════════════════════════════════════
    const products = [
      // SAREES
      {
        name: "Teal Paisley Block Print Cotton Saree",
        slug: "teal-paisley-block-print-cotton-saree",
        description:
          "Elegant teal paisley block print cotton saree with intricate traditional patterns. Perfect for both casual and semi-formal occasions. Lightweight and comfortable fabric ideal for Bangladesh weather.",
        basePrice: 2300,
        categorySlug: "saree",
        status: "ACTIVE" as const,
        isFeatured: true,
        variants: [
          {
            size: "Free Size",
            color: "Teal",
            price: 2300,
            stock: 15,
            images: ["/images/products/saree/0560000083852.webp"],
          },
        ],
      },
      {
        name: "Olive Green Floral Block Print Saree",
        slug: "olive-green-floral-block-print-saree",
        description:
          "Beautiful olive green saree with delicate floral block print design. Crafted from premium cotton blend fabric with excellent drape and comfort.",
        basePrice: 2800,
        categorySlug: "saree",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "Free Size",
            color: "Olive Green",
            price: 2800,
            stock: 12,
            images: ["/images/products/saree/shari 2.webp"],
          },
        ],
      },
      {
        name: "Violet Geometric Mirror Work Saree",
        slug: "violet-geometric-mirror-work-saree",
        description:
          "Stunning violet saree featuring geometric patterns with mirror work embellishments. A showstopper for parties and special events.",
        basePrice: 2500,
        categorySlug: "saree",
        status: "ACTIVE" as const,
        isFeatured: true,
        variants: [
          {
            size: "Free Size",
            color: "Violet",
            price: 2500,
            stock: 10,
            images: ["/images/products/saree/shari 3.webp"],
          },
        ],
      },
      {
        name: "Sky Blue Floral Block Print Silk Saree",
        slug: "sky-blue-floral-block-print-silk-saree",
        description:
          "Luxurious sky blue silk saree with floral block print. Premium silk fabric with a beautiful sheen and smooth texture.",
        basePrice: 1918,
        categorySlug: "saree",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "Free Size",
            color: "Sky Blue",
            price: 1918,
            stock: 8,
            images: ["/images/products/saree/shari 4.webp"],
          },
        ],
      },
      {
        name: "Magenta Sheer Geometric Block Print Saree",
        slug: "magenta-sheer-geometric-block-print-saree",
        description:
          "Eye-catching magenta saree with sheer geometric block print. Modern design meets traditional craftsmanship.",
        basePrice: 2800,
        categorySlug: "saree",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "Free Size",
            color: "Magenta",
            price: 2800,
            stock: 14,
            images: ["/images/products/saree/shari 5.webp"],
          },
        ],
      },
      // THREE PIECE
      {
        name: "Magenta Zardozi Embroidered 3-Piece Suit",
        slug: "magenta-zardozi-embroidered-3-piece-suit",
        description:
          "Exquisite magenta three-piece suit with zardozi embroidery. Includes kameez, dupatta, and palazzo. Perfect for weddings and formal events.",
        basePrice: 2500,
        categorySlug: "three-piece",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "S",
            color: "Magenta",
            price: 2500,
            stock: 5,
            images: ["/images/products/three-piece/tree prices 1.webp"],
          },
          {
            size: "M",
            color: "Magenta",
            price: 2500,
            stock: 8,
            images: ["/images/products/three-piece/tree prices 1.webp"],
          },
          {
            size: "L",
            color: "Magenta",
            price: 2500,
            stock: 6,
            images: ["/images/products/three-piece/tree prices 1.webp"],
          },
          {
            size: "XL",
            color: "Magenta",
            price: 2500,
            stock: 4,
            images: ["/images/products/three-piece/tree prices 1.webp"],
          },
        ],
      },
      {
        name: "Golden Yellow Floral Printed Kurta Set",
        slug: "golden-yellow-floral-printed-kurta-set",
        description:
          "Vibrant golden yellow kurta set with floral print. Comfortable cotton fabric with beautiful drape. Includes kurta, bottom, and dupatta.",
        basePrice: 3000,
        categorySlug: "three-piece",
        status: "ACTIVE" as const,
        isFeatured: true,
        variants: [
          {
            size: "S",
            color: "Golden Yellow",
            price: 3000,
            stock: 4,
            images: ["/images/products/three-piece/tree prices 2.webp"],
          },
          {
            size: "M",
            color: "Golden Yellow",
            price: 3000,
            stock: 7,
            images: ["/images/products/three-piece/tree prices 2.webp"],
          },
          {
            size: "L",
            color: "Golden Yellow",
            price: 3000,
            stock: 5,
            images: ["/images/products/three-piece/tree prices 2.webp"],
          },
          {
            size: "XL",
            color: "Golden Yellow",
            price: 3000,
            stock: 3,
            images: ["/images/products/three-piece/tree prices 2.webp"],
          },
        ],
      },
      {
        name: "Hot Pink Paisley Printed 3-Piece Suit",
        slug: "hot-pink-paisley-printed-3-piece-suit",
        description:
          "Bold hot pink three-piece suit with paisley print. Lightweight and breathable fabric perfect for summer occasions.",
        basePrice: 2197,
        categorySlug: "three-piece",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "M",
            color: "Hot Pink",
            price: 2197,
            stock: 6,
            images: ["/images/products/three-piece/tree prices 3.webp"],
          },
          {
            size: "L",
            color: "Hot Pink",
            price: 2197,
            stock: 4,
            images: ["/images/products/three-piece/tree prices 3.webp"],
          },
          {
            size: "XL",
            color: "Hot Pink",
            price: 2197,
            stock: 3,
            images: ["/images/products/three-piece/tree prices 3.webp"],
          },
        ],
      },
      {
        name: "Golden Paisley Embellished 3-Piece Suit",
        slug: "golden-paisley-embellished-3-piece-suit",
        description:
          "Elegant golden three-piece suit with paisley embellishments. Rich fabric with intricate detailing for a premium look.",
        basePrice: 2755,
        categorySlug: "three-piece",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "M",
            color: "Golden",
            price: 2755,
            stock: 5,
            images: ["/images/products/three-piece/tree prices 4.webp"],
          },
          {
            size: "L",
            color: "Golden",
            price: 2755,
            stock: 3,
            images: ["/images/products/three-piece/tree prices 4.webp"],
          },
        ],
      },
      // BOUTIQUE
      {
        name: "Beige Paisley Embellished Designer Suit",
        slug: "beige-paisley-embellished-designer-suit",
        description:
          "Sophisticated beige designer suit with paisley embellishments. Premium boutique quality with hand-finished details.",
        basePrice: 1639,
        categorySlug: "boutique",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "M",
            color: "Beige",
            price: 1639,
            stock: 4,
            images: ["/images/products/boutique/bouthik 1.webp"],
          },
          {
            size: "L",
            color: "Beige",
            price: 1639,
            stock: 3,
            images: ["/images/products/boutique/bouthik 1.webp"],
          },
        ],
      },
      {
        name: "Black Floral Embroidered Sharara Set",
        slug: "black-floral-embroidered-sharara-set",
        description:
          "Stunning black sharara set with floral embroidery. Perfect for evening events and celebrations.",
        basePrice: 2476,
        categorySlug: "boutique",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "S",
            color: "Black",
            price: 2476,
            stock: 3,
            images: ["/images/products/boutique/bouthik 2.webp"],
          },
          {
            size: "M",
            color: "Black",
            price: 2476,
            stock: 5,
            images: ["/images/products/boutique/bouthik 2.webp"],
          },
          {
            size: "L",
            color: "Black",
            price: 2476,
            stock: 4,
            images: ["/images/products/boutique/bouthik 2.webp"],
          },
        ],
      },
      {
        name: "Blush Pink Embroidered Silk Suit",
        slug: "blush-pink-embroidered-silk-suit",
        description:
          "Delicate blush pink silk suit with fine embroidery. Luxurious fabric with a beautiful sheen. Ideal for weddings.",
        basePrice: 2500,
        categorySlug: "boutique",
        status: "ACTIVE" as const,
        isFeatured: true,
        variants: [
          {
            size: "S",
            color: "Blush Pink",
            price: 2500,
            stock: 4,
            images: ["/images/products/boutique/bouthik 3.webp"],
          },
          {
            size: "M",
            color: "Blush Pink",
            price: 2500,
            stock: 6,
            images: ["/images/products/boutique/bouthik 3.webp"],
          },
          {
            size: "L",
            color: "Blush Pink",
            price: 2500,
            stock: 3,
            images: ["/images/products/boutique/bouthik 3.webp"],
          },
        ],
      },
      {
        name: "Sky Blue Floral Printed Casual 3-Piece",
        slug: "sky-blue-floral-printed-casual-3-piece",
        description:
          "Casual sky blue three-piece set with floral print. Comfortable cotton fabric for everyday wear.",
        basePrice: 2500,
        categorySlug: "boutique",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "M",
            color: "Sky Blue",
            price: 2500,
            stock: 7,
            images: ["/images/products/boutique/bouthik 4.webp"],
          },
          {
            size: "L",
            color: "Sky Blue",
            price: 2500,
            stock: 5,
            images: ["/images/products/boutique/bouthik 4.webp"],
          },
        ],
      },
      // BORKA & ABAYA
      {
        name: "Dusty Rose Embroidered Butterfly Abaya",
        slug: "dusty-rose-embroidered-butterfly-abaya",
        description:
          "Graceful dusty rose abaya with butterfly embroidery. Flowing fabric with elegant drape. Perfect for daily wear and special occasions.",
        basePrice: 2500,
        categorySlug: "borka",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "Free Size",
            color: "Dusty Rose",
            price: 2500,
            stock: 10,
            images: ["/images/products/borka/borka 1.jpg"],
          },
        ],
      },
      {
        name: "Purple Floral Bell Sleeve Open Abaya",
        slug: "purple-floral-bell-sleeve-open-abaya",
        description:
          "Trendy purple open abaya with floral print and bell sleeves. Modern design with traditional modesty.",
        basePrice: 2500,
        categorySlug: "borka",
        status: "ACTIVE" as const,
        isFeatured: true,
        variants: [
          {
            size: "Free Size",
            color: "Purple",
            price: 2500,
            stock: 8,
            images: ["/images/products/borka/borka 2.jpg"],
          },
        ],
      },
      {
        name: "Maroon Satin Lace-Trim Luxury Abaya",
        slug: "maroon-satin-lace-trim-luxury-abaya",
        description:
          "Luxurious maroon satin abaya with delicate lace trim. Premium quality fabric with a beautiful sheen.",
        basePrice: 2500,
        categorySlug: "borka",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "Free Size",
            color: "Maroon",
            price: 2500,
            stock: 6,
            images: ["/images/products/borka/borka 3.jpg"],
          },
        ],
      },
      {
        name: "Black & White Zebra Print Open Abaya",
        slug: "black-white-zebra-print-open-abaya",
        description:
          "Bold black and white zebra print open abaya. Fashion-forward design for the modern woman.",
        basePrice: 2500,
        categorySlug: "borka",
        status: "ACTIVE" as const,
        variants: [
          {
            size: "Free Size",
            color: "Black/White",
            price: 2500,
            stock: 9,
            images: ["/images/products/borka/borka 4.jpg"],
          },
        ],
      },
    ];

    let productCount = 0;
    let variantCount = 0;

    for (const prod of products) {
      const categoryId = categoryMap.get(prod.categorySlug);
      if (!categoryId) continue;

      const product = await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          basePrice: prod.basePrice,
          categoryId,
          status: prod.status,
          isFeatured: prod.isFeatured || false,
        },
      });

      for (const v of prod.variants) {
        const sku = `${prod.slug.substring(0, 8).toUpperCase().replace(/-/g, "")}-${v.size?.replace(/\s/g, "") || "OS"}-${(variantCount + 1).toString().padStart(3, "0")}`;

        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku,
            size: v.size,
            color: v.color,
            price: v.price,
            stock: v.stock,
            images: v.images,
            isActive: true,
          },
        });
        variantCount++;
      }
      productCount++;
    }

    // ═══════════════════════════════════════════
    // 3. SEED COUPONS
    // ═══════════════════════════════════════════
    const coupons = [
      { code: "BIBAZ10", type: "PERCENTAGE" as const, value: 10, minOrder: 2000 },
      { code: "BIBAZ20", type: "PERCENTAGE" as const, value: 20, minOrder: 5000 },
      { code: "EID2026", type: "PERCENTAGE" as const, value: 15, minOrder: 3000 },
      { code: "WELCOME", type: "PERCENTAGE" as const, value: 5 },
      { code: "FLAT100", type: "FIXED" as const, value: 100, minOrder: 1500 },
      { code: "FLAT200", type: "FIXED" as const, value: 200, minOrder: 3000 },
    ];

    for (const c of coupons) {
      await prisma.coupon.upsert({
        where: { code: c.code },
        update: {},
        create: {
          code: c.code,
          type: c.type,
          value: c.value,
          minOrder: c.minOrder,
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        categories: categories.length,
        products: productCount,
        variants: variantCount,
        coupons: coupons.length,
      },
      nextSteps: [
        "1. Order and Wishlist should now work!",
        "2. DELETE this file (app/api/seed-products/route.ts) for security",
      ],
    });
  } catch (error) {
    console.error("[SEED] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
