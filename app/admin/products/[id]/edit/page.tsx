/**
 * BIBAZ — Admin Edit Product Page
 */

import { prisma } from "@/lib/db";
import { getCategories, getProductCollections } from "@/actions/product.actions";
import { getAdminCollections } from "@/actions/collection.actions";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/admin/edit-product-form";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categoriesResult, collectionsResult, activeCollectionsResult] = await Promise.all(
    [
      prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          basePrice: true,
          categoryId: true,
          status: true,
          isFeatured: true,
          seoTitle: true,
          seoDesc: true,
          ogImage: true,
          createdAt: true,
          updatedAt: true,
          variants: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              productId: true,
              sku: true,
              size: true,
              color: true,
              price: true,
              stock: true,
              images: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          category: { select: { id: true, name: true } },
        },
      }),
      getCategories(),
      getAdminCollections(),
      getProductCollections(id),
    ]
  );

  if (!product) {
    notFound();
  }

  const categories = categoriesResult.categories || [];
  const collections = collectionsResult.collections || [];
  const initialCollectionIds = activeCollectionsResult.collectionIds || [];

  // Serialize Decimal fields for client component
  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice),
    compareAtPrice: null,
    variants: product.variants.map((v) => ({
      ...v,
      price: Number(v.price),
    })),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500">{product.name}</p>
      </div>

      <EditProductForm
        product={serializedProduct}
        categories={categories}
        collections={collections}
        initialCollectionIds={initialCollectionIds}
      />
    </div>
  );
}
