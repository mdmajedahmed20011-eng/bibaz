/**
 * BIBAZ — Admin Product List Page
 * SOP §৬F — Product Management
 */

import { getProducts } from "@/actions/product.actions";
import Link from "next/link";
import Form from "next/form";
import { Plus, Search } from "lucide-react";
import { ProductStatusBadge } from "@/components/admin/product-status-badge";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const status = params.status || undefined;

  const result = await getProducts({
    page,
    pageSize: 20,
    search: search || undefined,
    status: status || undefined,
  });

  const products = result.products || [];
  const pagination = result.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/bulk"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            Excel Editor
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Form className="relative flex-1" action="/admin/products">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search products... (Press Enter)"
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-gray-400 focus:outline-none"
          />
        </Form>
        <div className="flex gap-2">
          {["ALL", "ACTIVE", "DRAFT", "OUT_OF_STOCK", "ARCHIVED"].map((s) => (
            <Link
              key={s}
              href={`/admin/products${s === "ALL" ? "" : `?status=${s}`}`}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                (s === "ALL" && !status) || status === s
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  {search
                    ? `No products found for "${search}"`
                    : "No products yet. Create your first product!"}
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.variants.length} variant(s)
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ৳{Number(product.basePrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          totalStock === 0
                            ? "text-red-600"
                            : totalStock < 5
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/products?page=${page - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {page < pagination.totalPages && (
              <Link
                href={`/admin/products?page=${page + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
