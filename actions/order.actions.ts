"use server";

/**
 * BIBAZ — Order Server Actions
 * SOP §৬B — Order Management System
 *
 * Guest-first: Order করতে login দরকার নেই
 * Track: Order Number + Phone দিয়ে track করা যাবে
 */

import { prisma, serializeDecimals } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  type CreateOrderInput,
  type UpdateOrderStatusInput,
} from "@/lib/validators/order";
import { after } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { BUSINESS } from "@/lib/constants";

// ═══════════════════════════════════════════
// PUBLIC ACTIONS
// ═══════════════════════════════════════════

/**
 * Create a new order (Guest or Logged-in)
 * Server-side price re-calculation — NEVER trust client prices
 * Accepts both typed CreateOrderInput and legacy checkout form format
 */
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { headers } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createOrder(data: CreateOrderInput | any) {
  try {
    // Rate limit check
    const headersList = await headers();
    const ip = getClientIP(headersList);
    const rateLimit = await checkRateLimit(ip, "checkout");
    if (!rateLimit.success) {
      return { success: false, error: "Too many orders placed recently. Please try again later." };
    }

    const session = await auth();
    const userId = session?.user?.id || null;

    // Normalize data — support both new format and legacy checkout form format
    let items: { variantId: string; quantity: number }[];
    let shippingAddress: {
      name: string;
      phone: string;
      street: string;
      city: string;
      area: string;
      postalCode: string;
    };
    let paymentMethod: "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ";
    let guestEmail: string | undefined;
    let couponCode: string | undefined;

    if (data.shippingAddress) {
      // New typed format (CreateOrderInput)
      const parsed = createOrderSchema.safeParse(data);
      if (!parsed.success) {
        const firstIssue = parsed.error?.issues?.[0];
        return { success: false, error: firstIssue?.message || "Invalid input" };
      }
      items = parsed.data.items;
      shippingAddress = parsed.data.shippingAddress;
      paymentMethod = parsed.data.paymentMethod;
      guestEmail = parsed.data.guestEmail;
      couponCode = parsed.data.couponCode;
    } else if (data.address) {
      // Legacy checkout form format
      items = (data.items || []).map(
        (item: { variantId?: string; id?: string; quantity: number }) => ({
          variantId: item.variantId || item.id || "",
          quantity: item.quantity,
        })
      );
      shippingAddress = {
        name: data.address.name,
        phone: data.address.phone,
        street: data.address.street,
        city: data.address.city,
        area: data.address.area,
        postalCode: data.address.postalCode || "0000",
      };
      paymentMethod = (data.paymentMethod || "COD") as "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ";
      guestEmail = data.address.email;
      couponCode = data.couponCode;
    } else {
      return { success: false, error: "Invalid order data" };
    }

    // Server-side price calculation (NEVER trust client)
    const variantIds = items.map((item) => item.variantId);

    // Acquire distributed locks to prevent inventory race conditions
    const { acquireInventoryLocks, releaseInventoryLocks } = await import("@/lib/redis");
    const locksAcquired = await acquireInventoryLocks(variantIds);
    if (!locksAcquired) {
      return {
        success: false,
        error:
          "The store is experiencing high traffic. Please try checking out again in a few seconds.",
      };
    }

    try {
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds }, isActive: true },
        include: { product: { select: { status: true, name: true } } },
      });

      // Validate all variants exist and are active
      if (variants.length !== items.length) {
        // Find which variants are missing
        const foundIds = new Set(variants.map((v) => v.id));
        const missingIds = variantIds.filter((id) => !foundIds.has(id));
        console.error("[ORDER] Missing variant IDs:", missingIds);
        return {
          success: false,
          error:
            "Your cart contains items that are no longer available. Please clear your cart and re-add products.",
        };
      }

      // Validate stock
      for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return { success: false, error: "Product variant not found" };
        }
        if (variant.product.status !== "ACTIVE") {
          return { success: false, error: `${variant.product.name} is not available` };
        }
        if (variant.stock < item.quantity) {
          return {
            success: false,
            error: `${variant.product.name}: only ${variant.stock} in stock`,
          };
        }
      }

      // Calculate subtotal from DB prices
      let subtotal = 0;
      const orderItems = items.map((item) => {
        const variant = variants.find((v) => v.id === item.variantId)!;
        const unitPrice = Number(variant.price);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;
        return {
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        };
      });

      // Calculate shipping from DB settings
      const settingsList = await prisma.siteSetting.findMany({
        where: {
          key: { in: ["shipping_dhaka", "shipping_outside", "free_shipping_threshold"] },
        },
      });

      const shippingDhaka = Number(
        settingsList.find((s) => s.key === "shipping_dhaka")?.value ?? 80
      );
      const shippingOutside = Number(
        settingsList.find((s) => s.key === "shipping_outside")?.value ?? 150
      );
      const freeShippingThreshold = Number(
        settingsList.find((s) => s.key === "free_shipping_threshold")?.value ?? 0
      );

      const isDhaka = shippingAddress.city.toLowerCase().includes("dhaka");
      let shippingCharge = isDhaka ? shippingDhaka : shippingOutside;

      if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) {
        shippingCharge = 0;
      }

      // Apply coupon if provided
      let discount = 0;
      let couponId: string | null = null;
      if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });

        if (!coupon) {
          return { success: false, error: "Invalid coupon code" };
        }
        if (!coupon.isActive) {
          return { success: false, error: "This coupon is no longer active" };
        }
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          return { success: false, error: "This coupon has expired" };
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return { success: false, error: "This coupon has reached its usage limit" };
        }
        if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
          return { success: false, error: `Minimum order amount is ৳${coupon.minOrder}` };
        }

        switch (coupon.type) {
          case "PERCENTAGE":
            discount = (subtotal * Number(coupon.value)) / 100;
            break;
          case "FIXED":
            discount = Number(coupon.value);
            break;
          case "FREE_SHIPPING":
            discount = shippingCharge;
            break;
        }
        discount = Math.min(discount, subtotal);
        couponId = coupon.id;
      }

      const total = subtotal + shippingCharge - discount;

      // Atomic Checkout Transaction
      const year = new Date().getFullYear();

      const order = await prisma.$transaction(async (tx) => {
        // 1. Generate unique order number atomically using Redis
        const { redis } = await import("@/lib/redis");
        const orderCounterKey = `order_count:${year}`;
        const orderCountThisYear = await redis.incr(orderCounterKey);
        const orderNumber = `ORD-${year}-${orderCountThisYear.toString().padStart(5, "0")}`;

        // 2. Create order with items
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId,
            guestName: shippingAddress.name,
            guestPhone: shippingAddress.phone,
            guestEmail: guestEmail || null,
            shippingAddress: shippingAddress,
            subtotal,
            shippingCharge,
            discount,
            total,
            paymentMethod,
            paymentStatus: "UNPAID",
            status: "PENDING",
            couponId,
            items: { create: orderItems },
            timeline: {
              create: { status: "PENDING", note: "Order placed", createdBy: userId || "GUEST" },
            },
          },
        });

        // 3. Deduct stock safely (Prevents race conditions)
        for (const item of items) {
          const updateRes = await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });

          if (updateRes.count === 0) {
            throw new Error("One or more items in your cart went out of stock during checkout.");
          }
        }

        // 4. Increment coupon usage
        if (couponId) {
          await tx.coupon.update({
            where: { id: couponId },
            data: { usedCount: { increment: 1 } },
          });
        }

        // 5. Initiate COD payment safely inside transaction
        if (paymentMethod === "COD") {
          const transactionId = `COD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          await tx.payment.create({
            data: {
              orderId: newOrder.id,
              transactionId,
              method: "COD",
              amount: newOrder.total,
              status: "UNPAID",
            },
          });
        }

        return newOrder;
      });

      const orderNumber = order.orderNumber;

      // Clear user cart if logged in
      if (userId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
          await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        revalidatePath("/account/orders");
      }

      // Send email notifications and check stock in the background (non-blocking)
      after(async () => {
        try {
          const { sendEmail, orderConfirmationEmail, newOrderAlertEmail } =
            await import("@/lib/email");

          const customerEmail = guestEmail || null;
          if (customerEmail) {
            const emailData = orderConfirmationEmail({
              orderNumber,
              customerName: shippingAddress.name,
              items: orderItems.map((item, i) => ({
                name: `Item ${i + 1}`,
                quantity: item.quantity,
                price: item.totalPrice,
              })),
              subtotal,
              shipping: shippingCharge,
              discount,
              total,
              address: `${shippingAddress.street}, ${shippingAddress.area}, ${shippingAddress.city}`,
              paymentMethod,
            });
            emailData.to = customerEmail;
            await sendEmail(emailData);
          }

          // Admin alert
          const adminAlert = newOrderAlertEmail({
            orderNumber,
            customerName: shippingAddress.name,
            total,
            itemCount: items.length,
          });
          await sendEmail(adminAlert);

          // Low stock warning check
          const lowStockVariants = await prisma.productVariant.findMany({
            where: {
              id: { in: variantIds },
              stock: { lt: 5 },
              isActive: true,
            },
            include: { product: { select: { name: true } } },
          });

          if (lowStockVariants.length > 0) {
            const lowStockAlertHtml = `
            <h3>⚠️ Low Stock Warning</h3>
            <p>The following variants are running low on stock (less than 5 units remaining):</p>
            <table border="1" cellpadding="8" style="border-collapse: collapse; border-color: #eee;">
              <thead>
                <tr style="background-color: #f9f9f9;">
                  <th>Product/Variant</th>
                  <th>Remaining Stock</th>
                </tr>
              </thead>
              <tbody>
                ${lowStockVariants
                  .map(
                    (v) => `
                  <tr>
                    <td>${v.product.name} (Size: ${v.size || "OS"}, Color: ${v.color || "None"})</td>
                    <td style="color: red; font-weight: bold;">${v.stock}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
            <p><a href="https://majedahmed.space/admin/products">Manage Inventory in Admin Panel →</a></p>
          `;

            await sendEmail({
              to: BUSINESS.EMAIL || "noreply@majedahmed.space",
              subject: `⚠️ Low Stock Alert — BIBAZ`,
              html: lowStockAlertHtml,
            });
          }
        } catch (backgroundError) {
          console.error("[BACKGROUND EMAIL/STOCK ERROR]:", backgroundError);
        }
      });

      revalidatePath("/admin/orders");

      let paymentURL: string | undefined;

      if (paymentMethod === "BKASH") {
        const { createPayment } = await import("@/lib/payment/bkash");
        const paymentRes = await createPayment(order.orderNumber, total);
        if (paymentRes.success && paymentRes.bkashURL) {
          paymentURL = paymentRes.bkashURL;
        }
      } else if (paymentMethod === "NAGAD") {
        const { createNagadPayment } = await import("@/lib/payment/nagad");
        const paymentRes = await createNagadPayment(order.orderNumber, total);
        if (paymentRes.success && paymentRes.nagadURL) {
          paymentURL = paymentRes.nagadURL;
        }
      }

      return { success: true, orderNumber: order.orderNumber, orderId: order.id, paymentURL };
    } finally {
      await releaseInventoryLocks(variantIds);
    }
  } catch (error) {
    console.error("[ORDER] createOrder error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to place order",
    };
  }
}

/**
 * Track order by order number + phone (Guest — no login required)
 */
export async function trackOrder(orderNumber: string, phone: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        guestPhone: phone,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true, slug: true } },
              },
            },
          },
        },
        timeline: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found. Check your order number and phone." };
    }

    return { success: true, order: serializeDecimals(order) };
  } catch (error) {
    console.error("[ORDER] trackOrder error:", error);
    return { success: false, error: "Failed to track order" };
  }
}

/**
 * Get orders for logged-in user
 */
export async function getMyOrders(page = 1, pageSize = 10) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, orders: [], error: "Not authenticated" };
  }

  try {
    const skip = (page - 1) * pageSize;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: { select: { name: true, slug: true } },
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ]);

    return {
      success: true,
      orders: serializeDecimals(orders),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    console.error("[ORDER] getMyOrders error:", error);
    return { success: false, orders: [], error: "Failed to fetch orders" };
  }
}

/**
 * Get order detail (Auth or Guest with phone verification)
 */
export async function getOrderDetail(orderId: string) {
  const session = await auth();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true, slug: true, id: true } },
              },
            },
          },
        },
        timeline: {
          orderBy: { createdAt: "desc" },
        },
        payments: true,
      },
    });

    if (!order) {
      return { success: false, order: null, error: "Order not found" };
    }

    // Authorization: user can only see their own orders
    if (session?.user?.id && order.userId !== session.user.id) {
      const role = (session.user as { role?: string }).role;
      if (!["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"].includes(role || "")) {
        return { success: false, order: null, error: "Unauthorized" };
      }
    }

    return { success: true, order: serializeDecimals(order) };
  } catch (error) {
    console.error("[ORDER] getOrderDetail error:", error);
    return { success: false, order: null, error: "Failed to fetch order" };
  }
}

/**
 * Cancel order (Customer — only if PENDING or CONFIRMED)
 */
export async function cancelOrder(orderId: string, reason?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { success: false, error: "Order not found" };
    if (order.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return { success: false, error: "Order cannot be cancelled at this stage" };
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    // Add timeline entry
    await prisma.orderTimeline.create({
      data: {
        orderId,
        status: "CANCELLED",
        note: reason || "Cancelled by customer",
        createdBy: session.user.id,
      },
    });

    // Restore stock
    for (const item of order.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
    }

    revalidatePath("/account/orders");
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    console.error("[ORDER] cancelOrder error:", error);
    return { success: false, error: "Failed to cancel order" };
  }
}

// ═══════════════════════════════════════════
// ADMIN ACTIONS
// ═══════════════════════════════════════════

/**
 * Get all orders (Admin — with filters)
 */
export async function getAdminOrders(options?: {
  status?: string;
  paymentStatus?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  try {
    await requirePermission("view_orders");

    const {
      status,
      paymentStatus,
      search,
      page = 1,
      pageSize = 20,
      dateFrom,
      dateTo,
    } = options || {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { deletedAt: null };

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { guestName: { contains: search } },
        { guestPhone: { contains: search } },
        { guestEmail: { contains: search } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const skip = (page - 1) * pageSize;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          items: {
            include: {
              variant: {
                include: { product: { select: { name: true } } },
              },
            },
          },
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      success: true,
      orders: serializeDecimals(orders),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    console.error("[ORDER] getAdminOrders error:", error);
    return { success: false, orders: [], error: "Failed to fetch orders" };
  }
}

/**
 * Update order status (Admin/Staff)
 */
export async function updateOrderStatus(data: UpdateOrderStatusInput) {
  try {
    const { userId } = await requirePermission("process_orders");

    const parsed = updateOrderStatusSchema.safeParse(data);
    if (!parsed.success) {
      const firstIssue = parsed.error?.issues?.[0];
      return { success: false, error: firstIssue?.message || "Invalid input" };
    }

    const { orderId, status, note } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, items: true },
    });

    if (!order) return { success: false, error: "Order not found" };

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Add timeline entry
    await prisma.orderTimeline.create({
      data: {
        orderId,
        status,
        note: note || `Status changed to ${status}`,
        createdBy: userId,
      },
    });

    // If confirmed, mark payment as pending confirmation
    if (status === "CONFIRMED" && order.status === "PENDING") {
      // COD: payment collected on delivery
    }

    // If cancelled/returned, restore stock
    if (
      ["CANCELLED", "RETURNED"].includes(status) &&
      !["CANCELLED", "RETURNED", "REFUNDED"].includes(order.status)
    ) {
      for (const item of order.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId,
        action: "UPDATE_ORDER_STATUS",
        entity: "Order",
        entityId: orderId,
        oldValue: { status: order.status },
        newValue: { status, note },
      },
    });

    // Send email notifications on key status changes (non-blocking)
    after(async () => {
      try {
        const { sendEmail, orderShippedEmail } = await import("@/lib/email");
        const fullOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { guestEmail: true, guestName: true, orderNumber: true },
        });

        if (fullOrder?.guestEmail) {
          if (status === "SHIPPED") {
            const emailData = orderShippedEmail({
              orderNumber: fullOrder.orderNumber,
              customerName: fullOrder.guestName || "Customer",
              trackingNumber: parsed.data.trackingNumber,
            });
            emailData.to = fullOrder.guestEmail;
            await sendEmail(emailData);
          }
        }
      } catch (emailError) {
        // Don't fail the status update if email fails
        console.error("[ORDER] Email notification failed:", emailError);
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("[ORDER] updateOrderStatus error:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboardStats() {
  try {
    await requirePermission("view_reports");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    const [
      todayOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalRevenue,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalProducts,
      lowStockCount,
      totalCustomers,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today }, deletedAt: null } }),
      prisma.order.count({ where: { status: "PENDING", deletedAt: null } }),
      prisma.order.count({ where: { status: "PROCESSING", deletedAt: null } }),
      prisma.order.count({ where: { status: "DELIVERED", deletedAt: null } }),
      prisma.order.aggregate({
        where: {
          status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
          deletedAt: null,
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: today },
          status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
          deletedAt: null,
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: weekAgo },
          status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
          deletedAt: null,
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: monthAgo },
          status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
          deletedAt: null,
        },
        _sum: { total: true },
      }),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.productVariant.count({ where: { stock: { lt: 5 }, isActive: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          guestName: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      success: true,
      stats: {
        todayOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        totalRevenue: Number(totalRevenue._sum.total || 0),
        todayRevenue: Number(todayRevenue._sum.total || 0),
        weeklyRevenue: Number(weeklyRevenue._sum.total || 0),
        monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
        totalProducts,
        lowStockCount,
        totalCustomers,
        recentOrders,
      },
    };
  } catch (error) {
    console.error("[ORDER] getAdminDashboardStats error:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

/**
 * Bulk update order status (Admin)
 */
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  note?: string
) {
  try {
    const { userId } = await requirePermission("manage_orders");

    if (!orderIds.length) return { success: false, error: "No orders selected" };

    let updated = 0;

    for (const orderId of orderIds) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true, items: true },
      });

      if (!order) continue;

      // Skip if already in target status
      if (order.status === status) continue;

      await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      await prisma.orderTimeline.create({
        data: {
          orderId,
          status,
          note: note || `Bulk status update to ${status}`,
          createdBy: userId,
        },
      });

      // Restore stock if cancelling
      if (status === "CANCELLED" && !["CANCELLED", "RETURNED", "REFUNDED"].includes(order.status)) {
        for (const item of order.items) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      updated++;
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: userId,
        action: "BULK_UPDATE_ORDER_STATUS",
        entity: "Order",
        entityId: orderIds.join(","),
        newValue: { status, count: updated, note },
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, updated };
  } catch (error) {
    console.error("[ORDER] bulkUpdateOrderStatus error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to bulk update orders",
    };
  }
}

/**
 * Update internal notes / delivery date for an order (Admin+)
 */
export async function updateOrderNotes(orderId: string, notes: string) {
  try {
    await requirePermission("process_orders");

    await prisma.order.update({
      where: { id: orderId },
      data: { notes },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("[ORDER] updateOrderNotes error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update internal notes",
    };
  }
}

/**
 * Export orders list as CSV (Admin+)
 */
export async function exportOrdersToCSV() {
  try {
    await requirePermission("view_orders");

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Order Number",
      "Customer Name",
      "Phone",
      "Email",
      "Subtotal",
      "Shipping Charge",
      "Discount",
      "Total",
      "Payment Method",
      "Payment Status",
      "Status",
      "Date",
    ];

    const rows = orders.map((o) => {
      const address =
        (o.shippingAddress as { name?: string; phone?: string; email?: string }) || {};
      return [
        o.orderNumber,
        o.guestName || address.name || "",
        o.guestPhone || address.phone || "",
        o.guestEmail || address.email || "",
        o.subtotal.toString(),
        o.shippingCharge.toString(),
        o.discount.toString(),
        o.total.toString(),
        o.paymentMethod,
        o.paymentStatus,
        o.status,
        new Date(o.createdAt).toLocaleDateString("en-BD"),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return { success: true, csv: csvContent };
  } catch (error) {
    console.error("[ORDER] exportOrdersToCSV error:", error);
    return {
      success: false,
      csv: "",
      error: error instanceof Error ? error.message : "Failed to export orders",
    };
  }
}

/**
 * Delete a single order (Admin - Soft Delete)
 */
export async function deleteOrder(orderId: string) {
  try {
    const { userId } = await requirePermission("manage_orders");

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true, items: true },
    });

    if (!order) return { success: false, error: "Order not found" };

    await prisma.order.update({
      where: { id: orderId },
      data: { deletedAt: new Date() },
    });

    if (!["CANCELLED", "RETURNED", "REFUNDED"].includes(order.status)) {
      for (const item of order.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        adminId: userId,
        action: "DELETE_ORDER",
        entity: "Order",
        entityId: orderId,
      },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("[ORDER] deleteOrder error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}

/**
 * Bulk delete orders (Admin - Soft Delete)
 */
export async function bulkDeleteOrders(orderIds: string[]) {
  try {
    const { userId } = await requirePermission("manage_orders");

    if (!orderIds.length) return { success: false, error: "No orders selected" };

    let deletedCount = 0;

    for (const orderId of orderIds) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, status: true, deletedAt: true, items: true },
      });

      if (!order || order.deletedAt) continue;

      await prisma.order.update({
        where: { id: orderId },
        data: { deletedAt: new Date() },
      });

      if (!["CANCELLED", "RETURNED", "REFUNDED"].includes(order.status)) {
        for (const item of order.items) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      deletedCount++;
    }

    await prisma.auditLog.create({
      data: {
        adminId: userId,
        action: "BULK_DELETE_ORDERS",
        entity: "Order",
        entityId: "bulk",
        newValue: { count: deletedCount },
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, count: deletedCount };
  } catch (error) {
    console.error("[ORDER] bulkDeleteOrders error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to bulk delete orders",
    };
  }
}

/**
 * Get dynamic revenue and order count trends for admin charts
 */
export async function getDashboardAnalytics(range: string = "7d") {
  try {
    await requirePermission("view_reports");
    const now = new Date();
    const startDate = new Date();
    let grouping: "day" | "month" = "day";

    if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
      grouping = "day";
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
      grouping = "day";
    } else if (range === "12m") {
      startDate.setFullYear(now.getFullYear() - 1);
      grouping = "month";
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        deletedAt: null,
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const groupedData: Record<string, { label: string; revenue: number; count: number }> = {};

    if (grouping === "day") {
      const temp = new Date(startDate);
      while (temp <= now) {
        const key = temp.toISOString().slice(0, 10);
        const label = temp.toLocaleDateString("en-BD", { day: "numeric", month: "short" });
        groupedData[key] = { label, revenue: 0, count: 0 };
        temp.setDate(temp.getDate() + 1);
      }
    } else {
      const temp = new Date(startDate);
      for (let i = 0; i < 12; i++) {
        const key = `${temp.getFullYear()}-${(temp.getMonth() + 1).toString().padStart(2, "0")}`;
        const label = temp.toLocaleDateString("en-BD", { month: "short", year: "2-digit" });
        groupedData[key] = { label, revenue: 0, count: 0 };
        temp.setMonth(temp.getMonth() + 1);
      }
    }

    orders.forEach((o) => {
      let key = "";
      if (grouping === "day") {
        key = o.createdAt.toISOString().slice(0, 10);
      } else {
        key = `${o.createdAt.getFullYear()}-${(o.createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
      }

      const item = groupedData[key];
      if (item) {
        item.revenue += Number(o.total);
        item.count += 1;
      }
    });

    const dataPoints = Object.values(groupedData);
    return { success: true, dataPoints };
  } catch (error) {
    console.error("[ANALYTICS] getDashboardAnalytics error:", error);
    return { success: false, error: "Failed to fetch analytics chart data" };
  }
}
