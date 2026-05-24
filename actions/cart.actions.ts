"use server";

/**
 * BIBAZ — Cart Server Actions
 * SOP §৬C — Shopping Cart (DB sync for logged-in users)
 *
 * Guest cart: localStorage (handled client-side)
 * Logged-in cart: Database (synced)
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ═══════════════════════════════════════════
// CART ACTIONS (Logged-in users — DB sync)
// ═══════════════════════════════════════════

/**
 * Get cart for logged-in user
 */
export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, cart: null, error: "Not authenticated" };
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { success: true, cart };
  } catch (error) {
    console.error("[CART] getCart error:", error);
    return { success: false, cart: null, error: "Failed to fetch cart" };
  }
}

/**
 * Add item to cart (logged-in user)
 */
export async function addToCart(variantId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Validate variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { id: true, stock: true, isActive: true, product: { select: { status: true } } },
    });

    if (!variant || !variant.isActive || variant.product.status !== "ACTIVE") {
      return { success: false, error: "Product not available" };
    }

    if (variant.stock < quantity) {
      return { success: false, error: "Insufficient stock" };
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > variant.stock) {
        return { success: false, error: "Cannot add more than available stock" };
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[CART] addToCart error:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(variantId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) return { success: true }; // No cart = nothing to remove

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[CART] removeFromCart error:", error);
    return { success: false, error: "Failed to remove from cart" };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartQuantity(variantId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  if (quantity < 1) {
    return removeFromCart(variantId);
  }

  try {
    // Validate stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stock: true },
    });

    if (!variant || variant.stock < quantity) {
      return { success: false, error: "Insufficient stock" };
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) return { success: false, error: "Cart not found" };

    await prisma.cartItem.updateMany({
      where: {
        cartId: cart.id,
        variantId,
      },
      data: { quantity },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[CART] updateCartQuantity error:", error);
    return { success: false, error: "Failed to update quantity" };
  }
}

/**
 * Sync localStorage cart to DB on login
 */
export async function syncCart(localItems: { variantId: string; quantity: number }[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  if (!localItems || localItems.length === 0) {
    return { success: true };
  }

  try {
    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: { items: true },
      });
    }

    // Merge local items with DB cart
    for (const localItem of localItems) {
      const existingItem = cart.items.find((item) => item.variantId === localItem.variantId);

      // Validate variant
      const variant = await prisma.productVariant.findUnique({
        where: { id: localItem.variantId },
        select: { stock: true, isActive: true },
      });

      if (!variant || !variant.isActive) continue;

      const quantity = Math.min(
        existingItem ? existingItem.quantity + localItem.quantity : localItem.quantity,
        variant.stock
      );

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: localItem.variantId,
            quantity,
          },
        });
      }
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[CART] syncCart error:", error);
    return { success: false, error: "Failed to sync cart" };
  }
}

/**
 * Clear cart (after order placed)
 */
export async function clearCart() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: true }; // Guest cart cleared client-side
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[CART] clearCart error:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

/**
 * Validate cart stock before checkout
 */
export async function validateCartStock() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: true, issues: [] }; // Guest validation done client-side
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              select: {
                id: true,
                stock: true,
                isActive: true,
                product: { select: { name: true, status: true } },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, issues: ["Cart is empty"] };
    }

    const issues: string[] = [];

    for (const item of cart.items) {
      if (!item.variant.isActive || item.variant.product.status !== "ACTIVE") {
        issues.push(`${item.variant.product.name} is no longer available`);
      } else if (item.variant.stock < item.quantity) {
        issues.push(
          `${item.variant.product.name}: only ${item.variant.stock} available (you have ${item.quantity})`
        );
      }
    }

    return { success: issues.length === 0, issues };
  } catch (error) {
    console.error("[CART] validateCartStock error:", error);
    return { success: false, issues: ["Failed to validate cart"] };
  }
}
