"use client";

/**
 * BIBAZ — Create Product Form (Admin)
 */

import { createProduct } from "@/actions/product.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CreateProductFormProps {
  categories: Category[];
}

export function CreateProductForm({ categories }: CreateProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      basePrice: parseFloat(formData.get("basePrice") as string),
      categoryId: formData.get("categoryId") as string,
      status: (formData.get("status") as "DRAFT" | "ACTIVE") || "DRAFT",
      isFeatured: formData.get("isFeatured") === "on",
      seoTitle: (formData.get("seoTitle") as string) || undefined,
      seoDesc: (formData.get("seoDesc") as string) || undefined,
    };

    const result = await createProduct(data);

    setLoading(false);

    if (result.success) {
      router.push("/admin/products");
    } else {
      setError(result.error || "Failed to create product");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
    >
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          minLength={3}
          maxLength={200}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
          placeholder="e.g., Teal Paisley Block Print Cotton Saree"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={5}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
          placeholder="Detailed product description..."
        />
      </div>

      {/* Price + Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="basePrice" className="mb-1 block text-sm font-medium text-gray-700">
            Base Price (৳) *
          </label>
          <input
            type="number"
            id="basePrice"
            name="basePrice"
            required
            min={1}
            step="0.01"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="2500"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status + Featured */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-gray-300" />
            <span className="text-sm text-gray-700">Featured Product</span>
          </label>
        </div>
      </div>

      {/* SEO Fields */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">SEO (Optional)</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="seoTitle" className="mb-1 block text-sm font-medium text-gray-700">
              SEO Title (max 60 chars)
            </label>
            <input
              type="text"
              id="seoTitle"
              name="seoTitle"
              maxLength={60}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="seoDesc" className="mb-1 block text-sm font-medium text-gray-700">
              SEO Description (max 160 chars)
            </label>
            <textarea
              id="seoDesc"
              name="seoDesc"
              maxLength={160}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
