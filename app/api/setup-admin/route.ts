/**
 * BIBAZ — One-time Admin Setup Route
 *
 * GET /api/setup-admin — Creates admin user if none exists
 * DELETE THIS FILE after first use!
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin already exists",
        email: existingAdmin.email,
        hint: "Login at /login with this email, then go to /admin",
      });
    }

    // Create admin user
    const passwordHash = await bcrypt.hash("Admin@2026", 12);

    const admin = await prisma.user.create({
      data: {
        name: "BIBAZ Admin",
        email: "admin@bibaz.com",
        phone: "01860744181",
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully!",
      credentials: {
        email: admin.email,
        password: "Admin@2026",
      },
      nextSteps: [
        "1. Go to /login",
        "2. Login with admin@bibaz.com / Admin@2026",
        "3. Go to /admin",
        "4. DELETE this file (app/api/setup-admin/route.ts) for security!",
      ],
    });
  } catch (error) {
    console.error("[SETUP-ADMIN] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create admin" },
      { status: 500 }
    );
  }
}
