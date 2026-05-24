/**
 * BIBAZ — Database Seed Script
 * Seeds categories and products from demo-data.ts into the database
 *
 * Usage: npx tsx prisma/seed.ts
 * Note: This runs locally or via GitHub Actions, NOT on Hostinger
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Categories to seed
const CATEGORIES = [
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

// Products to seed (from product_catalog.xlsx)
const PRODUCTS = [
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
      "Stunning black sharara set with floral embroidery. Perfect for evening events and celebrations. Includes top, sharara, and dupatta.",
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
    ],
  },
  {
    name: "Blush Pink Embroidered Silk Suit",
    slug: "blush-pink-embroidered-silk-suit",
    description:
      "Delicate blush pink silk suit with fine embroidery. Luxurious fabric with a beautiful sheen. Ideal for weddings and formal gatherings.",
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
      "Casual sky blue three-piece set with floral print. Comfortable cotton fabric for everyday wear. Easy to maintain and style.",
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
      "Trendy purple open abaya with floral print and bell sleeves. Modern design with traditional modesty. Lightweight and comfortable.",
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
      "Luxurious maroon satin abaya with delicate lace trim. Premium quality fabric with a beautiful sheen. Ideal for formal events.",
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
      "Bold black and white zebra print open abaya. Fashion-forward design for the modern woman. Lightweight and easy to style.",
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

// Default coupons to seed
const COUPONS = [
  { code: "BIBAZ10", type: "PERCENTAGE" as const, value: 10, minOrder: 2000 },
  { code: "BIBAZ20", type: "PERCENTAGE" as const, value: 20, minOrder: 5000 },
  { code: "EID2026", type: "PERCENTAGE" as const, value: 15, minOrder: 3000 },
  { code: "WELCOME", type: "PERCENTAGE" as const, value: 5 },
  { code: "FLAT100", type: "FIXED" as const, value: 100, minOrder: 1500 },
  { code: "FLAT200", type: "FIXED" as const, value: 200, minOrder: 3000 },
];

async function main() {
  console.log("🌱 Starting BIBAZ database seed...\n");

  // 1. Seed Categories
  console.log("📁 Seeding categories...");
  const categoryMap = new Map<string, string>();

  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
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
    categoryMap.set(cat.slug, category.id);
    console.log(`  ✓ ${cat.name} (${category.id})`);
  }

  // 2. Seed Products with Variants
  console.log("\n📦 Seeding products...");
  let productCount = 0;
  let variantCount = 0;

  for (const prod of PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.error(`  ✗ Category not found: ${prod.categorySlug}`);
      continue;
    }

    // Check if product already exists
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existing) {
      console.log(`  → ${prod.name} (already exists, skipping)`);
      continue;
    }

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

    // Create variants
    for (const variant of prod.variants) {
      const skuBase = prod.slug.substring(0, 8).toUpperCase().replace(/-/g, "");
      const skuSuffix = `${variant.size?.replace(/\s/g, "") || "OS"}-${(variantCount + 1).toString().padStart(3, "0")}`;
      const sku = `${skuBase}-${skuSuffix}`;

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          stock: variant.stock,
          images: variant.images,
          isActive: true,
        },
      });
      variantCount++;
    }

    productCount++;
    console.log(`  ✓ ${prod.name} (${prod.variants.length} variants)`);
  }

  // 3. Seed Coupons
  console.log("\n🎟️ Seeding coupons...");
  for (const coupon of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: { value: coupon.value, minOrder: coupon.minOrder },
      create: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        isActive: true,
      },
    });
    console.log(`  ✓ ${coupon.code} (${coupon.type}: ${coupon.value})`);
  }

  // 4. Create admin user (if not exists)
  console.log("\n👤 Checking admin user...");
  const bcrypt = await import("bcryptjs");
  const adminEmail = "admin@bibaz.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@2026", 12);
    await prisma.user.create({
      data: {
        name: "BIBAZ Admin",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`  ✓ Admin user created (admin@bibaz.com / Admin@2026)`);
  } else {
    console.log(`  → Admin user already exists`);
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(`   Products: ${productCount}`);
  console.log(`   Variants: ${variantCount}`);
  console.log(`   Coupons: ${COUPONS.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
