/**
 * BIBAZ — Health Check Endpoint
 * Used by Better Uptime monitoring
 * GET /api/health
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  let dbStatus = "not_checked";
  let dbResult = null;
  let dbError = null;

  try {
    dbResult = await prisma.order.aggregate({
      where: {
        status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        deletedAt: null,
      },
      _sum: { total: true },
    });
    dbStatus = "ok";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    dbStatus = "error";
    dbError = {
      message: e.message || "Unknown error",
      stack: e.stack || "",
    };
  }

  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    version: process.env.npm_package_version || "0.1.0",
    db: {
      status: dbStatus,
      result: dbResult,
      error: dbError,
    },
  };

  return NextResponse.json(healthCheck, { status: 200 });
}
