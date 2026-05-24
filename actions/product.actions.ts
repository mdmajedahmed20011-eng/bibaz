"use server";

/**
 * BIBAZ — Product Server Actions
 * SOP §৬A — Product Management
 *
 * Public: getProducts, getProductBySlug, getCategories
 * Admin+: createProduct, updateProduct, deleteProduct, createVariant, updateVariant
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
  createCategorySchema,
  type CreateProductInput,
  type UpdateProductInput,
  type CreateVariantInput,
  type UpdateVariantInput,
  type CreateCategoryInput,
} from "@/lib/validators/product";

// ═══════════════════════════════════════════
// PUBLIC ACTIONS
// ═══════════════════════════════════════════

/**
 * Get products with filters, sorting, and pagination
 */
export async function getProducts(options?: {
  categorySlug?: string;
  status?: string;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  isFeatured?: boolean;
}) {
  try {
    const {
      categorySlug,
      status = "ACTIVE",
      search,
      sort = "newest",
      page = 1,
      pageSize = 12,
      isFeatured,
    } = options || {};

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (search) {
      where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
    }

    // Build orderBy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    switch (sort) {
      case "price-asc":
        orderBy = { basePrice: "asc" };
        break;
      case "price-desc":
        orderBy = { basePrice: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "name-desc":
        orderBy = { name: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const skip = (page - 1) * pageSize;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          category: { select: { name: true, slug: true } },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              size: true,
              color: true,
              price: true,
              stock: true,
              images: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      success: true,
      products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("[PRODUCT] getProducts error:", error);
    return { success: false, products: [], pagination: null, error: "Failed to fetch products" };
  }
}

/**
 * Get single product by slug (with all variants)
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      return { success: false, product: null, error: "Product not found" };
    }

    return { success: true, product };
  } catch (error) {
    console.error("[PRODUCT] getProductBySlug error:", error);
    return { success: false, product: null, error: "Failed to fetch product" };
  }
}

/**
 * Get all active categories
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("[PRODUCT] getCategories error:", error);
    return { success: false, categories: [], error: "Failed to fetch categories" };
  }
}

/**
 * Get related products (same category, excluding current)
 */
export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        status: "ACTIVE",
        deletedAt: null,
      },
      take: limit,
      include: {
        variants: {
          where: { isActive: true },
          take: 1,
          select: { price: true, images: true },
        },
        category: { select: { name: true, slug: true } },
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("[PRODUCT] getRelatedProducts error:", error);
    return { success: false, products: [] };
  }
}

// ═══════════════════════════════════════════
// ADMIN ACTIONS (Requires Admin+ role)
// ═══════════════════════════════════════════

/**
 * Helper: Check if current user has admin access
 */
async function requireAdmin(): Promise<
  | { authorized: true; error: null; userId: string }
  | { authorized: false; error: string; userId: null }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { authorized: false, error: "Not authenticated", userId: null };
  }
  const role = (session.user as { role?: string }).role;
  const adminRoles = ["ADMIN", "SUPER_ADMIN", "MANAGER"];
  if (!adminRoles.includes(role || "")) {
    return { authorized: false, error: "Insufficient permissions", userId: null };
  }
  return { authorized: true, error: null, userId: session.user.id };
}

/**
 * Create a new product (Admin+)
 */
export async function createProduct(data: CreateProductInput) {
  const { authorized, error, userId } = await requireAdmin();
  if (!authorized) return { success: false, error };

  const parsed = createProductSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error?.issues?.[0]?.message || "Invalid input" };
  }

  try {
    // Generate slug from name
    const slug = parsed.data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: finalSlug,
        description: parsed.data.description,
        basePrice: parsed.data.basePrice,
        categoryId: parsed.data.categoryId,
        status: parsed.data.status || "DRAFT",
        isFeatured: parsed.data.isFeatured || false,
        seoTitle: parsed.data.seoTitle,
        seoDesc: parsed.data.seoDesc,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId!,
        action: "CREATE_PRODUCT",
        entity: "Product",
        entityId: product.id,
        newValue: { name: product.name, slug: product.slug },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, product };
  } catch (error) {
    console.error("[PRODUCT] createProduct error:", error);
    return { success: false, error: "Failed to create product" };
  }
}

/**
 * Update a product (Admin+)
 */
export async function updateProduct(productId: string, data: UpdateProductInput) {
  const { authorized, error, userId } = await requireAdmin();
  if (!authorized) return { success: false, error };

  const parsed = updateProductSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error?.issues?.[0]?.message || "Invalid input" };
  }

  try {
    const oldProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!oldProduct) return { success: false, error: "Product not found" };

    const product = await prisma.product.update({
      where: { id: productId },
      data: parsed.data,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId!,
        action: "UPDATE_PRODUCT",
        entity: "Product",
        entityId: product.id,
        oldValue: { name: oldProduct.name, status: oldProduct.status },
        newValue: { name: product.name, status: product.status },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/");

    return { success: true, product };
  } catch (error) {
    console.error("[PRODUCT] updateProduct error:", error);
    return { success: false, error: "Failed to update product" };
  }
}

/**
 * Soft delete a product (Admin+)
 */
export async function deleteProduct(productId: string) {
  const { authorized, error, userId } = await requireAdmin();
  if (!authorized) return { success: false, error };

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date(), status: "ARCHIVED" },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId!,
        action: "DELETE_PRODUCT",
        entity: "Product",
        entityId: product.id,
        oldValue: { name: product.name },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("[PRODUCT] deleteProduct error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

/**
 * Create a product variant (Admin+)
 */
export async function createVariant(data: CreateVariantInput) {
  const { authorized, error, userId } = await requireAdmin();
  if (!authorized) return { success: false, error };

  const parsed = createVariantSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error?.issues?.[0]?.message || "Invalid input" };
  }

  try {
    // Auto-generate SKU
    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
      select: { slug: true },
    });
    if (!product) return { success: false, error: "Product not found" };

    const skuBase = product.slug.substring(0, 8).toUpperCase().replace(/-/g, "");
    const skuSuffix = Date.now().toString(36).toUpperCase().slice(-4);
    const sku = `${skuBase}-${parsed.data.size || "OS"}-${skuSuffix}`;

    const variant = await prisma.productVariant.create({
      data: {
        productId: parsed.data.productId,
        sku,
        size: parsed.data.size,
        color: parsed.data.color,
        price: parsed.data.price,
        stock: parsed.data.stock,
        images: parsed.data.images || [],
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId!,
        action: "CREATE_VARIANT",
        entity: "ProductVariant",
        entityId: variant.id,
        newValue: { sku: variant.sku, size: variant.size, color: variant.color },
      },
    });

    revalidatePath("/admin/products");

    return { success: true, variant };
  } catch (error) {
    console.error("[PRODUCT] createVariant error:", error);
    return { success: false, error: "Failed to create variant" };
  }
}

/**
 * Update a product variant (Admin+)
 */
export async function updateVariant(variantId: string, data: UpdateVariantInput) {
  const { authorized, error, userId } = await requireAdmin();
  if (!authorized) return { success: false, error };

  const parsed = updateVariantSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error?.issues?.[0]?.message || "Invalid input" };
  }

  try {
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: parsed.data,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId!,
        action: "UPDATE_VARIANT",
        entity: "ProductVariant",
        entityId: variant.id,
        newValue: parsed.data,
      },
    });

    revalidatePath("/admin/products");

    return { success: true, variant };
  } catch (error) {
    console.error("[PRODUCT] updateVariant error:", error);
    return { success: false, error: "Failed to update variant" };
  }
}

/**
 * Update stock for a variant (Staff+)
 */
export async function updateStock(variantId: string, stock: number) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  const allowedRoles = ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"];
  if (!allowedRoles.includes(role || "")) {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id!,
        action: "UPDATE_STOCK",
        entity: "ProductVariant",
        entityId: variant.id,
        newValue: { stock },
      },
    });

    revalidatePath("/admin/products");

    return { success: true, variant };
  } catch (error) {
    console.error("[PRODUCT] updateStock error:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

/**
 * Create a category (Admin+)
 */
export async function createCategory(data: CreateCategoryInput) {
  const { authorized, error, userId } = await requireAdmin();
  if (!authorized) return { success: false, error };

  const parsed = createCategorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error?.issues?.[0]?.message || "Invalid input" };
  }

  try {
    const slug = parsed.data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug,
        parentId: parsed.data.parentId,
        image: parsed.data.image,
        sortOrder: parsed.data.sortOrder || 0,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId!,
        action: "CREATE_CATEGORY",
        entity: "Category",
        entityId: category.id,
        newValue: { name: category.name, slug: category.slug },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, category };
  } catch (error) {
    console.error("[PRODUCT] createCategory error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

/**
 * Get all collection IDs that a product belongs to
 */
export async function getProductCollections(productId: string) {
  try {
    const collections = await prisma.collection.findMany({
      select: {
        id: true,
        productIds: true,
      },
    });

    const activeCollectionIds = collections
      .filter((col) => {
        const productIds = (col.productIds as string[]) || [];
        return productIds.includes(productId);
      })
      .map((col) => col.id);

    return { success: true, collectionIds: activeCollectionIds };
  } catch (error) {
    console.error("[PRODUCT] getProductCollections error:", error);
    return { success: false, collectionIds: [], error: "Failed to fetch product collections" };
  }
}

/**
 * Update collections a product belongs to (Admin+)
 */
export async function updateProductCollections(productId: string, collectionIds: string[]) {
  const { authorized, error } = await requireAdmin();
  if (!authorized) return { success: false, error };

  try {
    const collections = await prisma.collection.findMany();

    for (const col of collections) {
      const currentProductIds = (col.productIds as string[]) || [];
      const isCurrentlyInCollection = currentProductIds.includes(productId);
      const shouldBeInCollection = collectionIds.includes(col.id);

      if (isCurrentlyInCollection && !shouldBeInCollection) {
        const updated = currentProductIds.filter((id) => id !== productId);
        await prisma.collection.update({
          where: { id: col.id },
          data: { productIds: updated as unknown as object },
        });
      } else if (!isCurrentlyInCollection && shouldBeInCollection) {
        const updated = [...currentProductIds, productId];
        await prisma.collection.update({
          where: { id: col.id },
          data: { productIds: updated as unknown as object },
        });
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/collections");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("[PRODUCT] updateProductCollections error:", error);
    return { success: false, error: "Failed to update product collections" };
  }
}

/**
 * Bulk update stock for multiple variants in a single transaction (Staff+)
 */
export async function bulkUpdateStock(updates: { variantId: string; stock: number }[]) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const role = (session.user as { role?: string }).role;
  const allowedRoles = ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"];
  if (!allowedRoles.includes(role || "")) {
    return { success: false, error: "Insufficient permissions" };
  }

  if (!updates || updates.length === 0) {
    return { success: false, error: "No updates provided" };
  }

  try {
    // Perform bulk updates inside a single secure transactional block
    await prisma.$transaction(
      updates.map((up) =>
        prisma.productVariant.update({
          where: { id: up.variantId },
          data: { stock: up.stock },
        })
      )
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: session.user.id!,
        action: "BULK_UPDATE_STOCK",
        entity: "ProductVariant",
        entityId: "BULK",
        newValue: { updates },
      },
    });

    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("[PRODUCT] bulkUpdateStock error:", error);
    return { success: false, error: "Failed to bulk update stock" };
  }
}
