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
    take: 6, // Fetch top 6 for the layout
  });

  // Fetch real active products from DB (latest)
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    take: 8, // Need 8 for New Arrivals
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        take: 1, // Get first variant for pricing/images
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <HomeUI dbCategories={serializeDecimals(categories)} dbProducts={serializeDecimals(products)} />
  );
}
