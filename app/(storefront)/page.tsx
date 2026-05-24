import { prisma, serializeDecimals } from "@/lib/db";
import { HomeUI } from "./home-client";

export default async function HomePage() {
  // Fetch real categories from DB
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: true },
      },
    },
    take: 6,
  });

  // Fetch real active products from DB (latest)
  // Use select to avoid fetching compare_at_price (column may not exist in production DB yet)
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      createdAt: true,
      category: {
        select: { name: true, slug: true },
      },
      variants: {
        where: { isActive: true },
        take: 1,
        select: {
          price: true,
          images: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <HomeUI dbCategories={serializeDecimals(categories)} dbProducts={serializeDecimals(products)} />
  );
}
