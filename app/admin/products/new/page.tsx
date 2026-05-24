/**
 * BIBAZ — Admin Create Product Page
 */

import { getCategories } from "@/actions/product.actions";
import { CreateProductForm } from "@/components/admin/create-product-form";

export default async function AdminNewProductPage() {
  const result = await getCategories();
  const categories = result.categories || [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
        <p className="text-sm text-gray-500">Add a new product to your catalog</p>
      </div>

      <CreateProductForm categories={categories} />
    </div>
  );
}
