import "dotenv/config";
import { prisma } from "./lib/db";

async function runTest() {
  console.log("Starting End-to-End Test...");
  try {
    // 1. Create a Collection
    console.log("Creating Collection...");
    const collection = await prisma.collection.upsert({
      where: { slug: "winter-collection" },
      update: {},
      create: {
        name: "Winter Collection",
        slug: "winter-collection",
        description: "Best winter clothes",
        isActive: true,
        isFeatured: true,
        productIds: [],
      },
    });

    // 2. Create a Category
    const category = await prisma.category.upsert({
      where: { slug: "jackets" },
      update: {},
      create: {
        name: "Jackets",
        slug: "jackets",
        isActive: true,
      },
    });

    // 3. Upload a Product
    console.log("Uploading Product...");
    const product = await prisma.product.upsert({
      where: { slug: "premium-winter-jacket" },
      update: {},
      create: {
        name: "Premium Winter Jacket",
        slug: "premium-winter-jacket",
        description: "A very warm jacket for the winter season.",
        basePrice: 5000,
        categoryId: category.id,
        status: "ACTIVE",
        isFeatured: true,
      },
    });

    const variant = await prisma.productVariant.upsert({
      where: { sku: "WINT-JAC-001" },
      update: {},
      create: {
        productId: product.id,
        sku: "WINT-JAC-001",
        size: "M",
        color: "Black",
        price: 5000,
        stock: 50,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
      },
    });

    // Add product to collection
    await prisma.collection.update({
      where: { id: collection.id },
      data: { productIds: [product.id] },
    });

    // 4. Upload Home Banner
    console.log("Uploading Home Banner...");
    const banners = await prisma.homepageSection.findMany({ where: { type: "hero_banner" } });
    if (banners.length === 0) {
      await prisma.homepageSection.create({
        data: {
          type: "hero_banner",
          title: "Winter Sale 2026",
          subtitle: "Up to 50% off on premium jackets",
          content: {
            image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            link: "/collections/winter-collection",
          },
          isActive: true,
        },
      });
    }

    // 5. Create a Discount
    console.log("Creating Discount...");
    const coupon = await prisma.coupon.upsert({
      where: { code: "WINT26" },
      update: {},
      create: {
        code: "WINT26",
        type: "PERCENTAGE",
        value: 20,
        minOrder: 1000,
        isActive: true,
      },
    });

    // 6. Make an Order
    console.log("Making an Order...");
    const order = await prisma.order.upsert({
      where: { orderNumber: "ORD-999999" },
      update: {},
      create: {
        orderNumber: "ORD-999999",
        guestName: "John Doe",
        guestEmail: "john@example.com",
        guestPhone: "01700000000",
        shippingAddress: { street: "123 Main St", city: "Dhaka" },
        status: "PENDING",
        subtotal: 5000,
        shippingCharge: 100,
        discount: 1000,
        total: 4100,
        paymentMethod: "COD",
        paymentStatus: "UNPAID",
        couponId: coupon.id,
      },
    });

    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
    if (items.length === 0) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: variant.id,
          quantity: 1,
          unitPrice: 5000,
          totalPrice: 5000,
        },
      });
    }

    console.log("E2E Test Completed Successfully!");
  } catch (error) {
    console.error("E2E Test Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
