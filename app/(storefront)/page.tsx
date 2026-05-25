import { prisma, serializeDecimals } from "@/lib/db";
import { HomeUI } from "./home-client";
import { unstable_cache } from "next/cache";

const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      take: 6,
    });
  },
  ["homepage_categories"],
  { revalidate: 3600, tags: ["categories"] }
);

const getCachedProducts = unstable_cache(
  async () => {
    return await prisma.product.findMany({
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
  },
  ["homepage_products"],
  { revalidate: 3600, tags: ["products"] }
);

export default async function HomePage() {
  const categories = await getCachedCategories();
  const products = await getCachedProducts();

  return (
    <HomeUI dbCategories={serializeDecimals(categories)} dbProducts={serializeDecimals(products)} />
  );
}
