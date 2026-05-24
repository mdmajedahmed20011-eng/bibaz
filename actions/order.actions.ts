"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createOrder(data: any) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Generate unique order number (e.g. ORD-2026-89421)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${new Date().getFullYear()}-${randomNum}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        guestName: data.address.name,
        guestPhone: data.address.phone,
        guestEmail: data.address.email,
        shippingAddress: data.address,
        subtotal: data.subtotal,
        shippingCharge: data.shippingCharge,
        discount: data.discount,
        total: data.total,
        paymentMethod: data.paymentMethod,
        status: "PENDING",
        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: data.items.map((item: any) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
        },
      },
    });

    if (userId) {
      // Revalidate account pages so orders appear
      revalidatePath("/account/orders");
    }

    return { success: true, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Order creation error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to place order. Unknown error." };
  }
}
