/**
 * BIBAZ — Admin Edit Product Page
 */

import { prisma } from "@/lib/db";
import { getCategories } from "@/actions/product.actions";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/admin/edit-product-form";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categoriesResult] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { createdAt: "asc" } },
        category: { select: { id: true, name: true } },
      },
    }),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const categories = categoriesResult.categories || [];

  // Serialize Decimal fields for client component
  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice),
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

      <EditProductForm product={serializedProduct} categories={categories} />
    </div>
  );
}
