import { NextResponse } from "next/server";
import { executePayment as executeBkash } from "@/lib/payment/bkash";
import { verifyNagadPayment } from "@/lib/payment/nagad";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const gateway = url.searchParams.get("gateway");

    // In a real scenario, this endpoint receives data from bKash/Nagad server
    const data = await request.json();

    if (gateway === "bkash") {
      const paymentID = data.paymentID;
      const orderId = data.orderId; // Passed via callback

      if (!paymentID || !orderId) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
      }

      const result = await executeBkash(paymentID);

      if (result.success) {
        // Update order status in DB
        await prisma.order.update({
          where: { orderNumber: orderId },
          data: {
            paymentStatus: "PAID",
            paymentDetails: JSON.stringify({
              gateway: "bKash",
              trxID: result.trxID,
            }),
          },
        });
        return NextResponse.json({ message: "Payment Successful", trxID: result.trxID });
      } else {
        return NextResponse.json({ error: "Payment failed" }, { status: 400 });
      }
    }

    if (gateway === "nagad") {
      const paymentRefId = data.paymentRefId;
      const orderId = data.orderId;

      if (!paymentRefId || !orderId) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
      }

      const result = await verifyNagadPayment(paymentRefId);

      if (result.success) {
        await prisma.order.update({
          where: { orderNumber: orderId },
          data: {
            paymentStatus: "PAID",
            paymentDetails: JSON.stringify({
              gateway: "Nagad",
              trxID: result.trxId,
            }),
          },
        });
        return NextResponse.json({ message: "Payment Successful", trxID: result.trxId });
      } else {
        return NextResponse.json({ error: "Payment failed" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Unknown gateway" }, { status: 400 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
