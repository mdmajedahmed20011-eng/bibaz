/**
 * BIBAZ — Authentication Server Actions
 * SOP §৪ — Authentication & Validation
 */

"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";

export async function registerUserAction(input: RegisterInput) {
  try {
    // 1. Zod schema validation (Mandatory under SOP)
    const validated = registerSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid registration inputs.",
      };
    }

    const { name, email, phone, password } = validated.data;

    // 2. Check if user already exists by email
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return {
        success: false,
        error: "An account with this email address already exists.",
      };
    }

    // 3. Check if user already exists by phone
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        return {
          success: false,
          error: "An account with this phone number already exists.",
        };
      }
    }

    // 4. Hash password with bcrypt (SOP: 12 salt rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Create user in database (Prisma client)
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    return {
      success: true,
      message: "Your account has been created successfully. Redirecting...",
    };
  } catch (err: unknown) {
    console.error("Registration error:", err);
    return {
      success: false,
      error: "Something went wrong on our end. Please try again later.",
    };
  }
}
