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

// ═══════════════════════════════════════════
// FORGOT PASSWORD & RESET
// ═══════════════════════════════════════════

import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validators/auth";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { headers } from "next/headers";
import crypto from "crypto";

/**
 * Forgot Password — sends reset link via email
 * Rate limited: 3 requests per hour per email
 */
export async function forgotPasswordAction(email: string) {
  try {
    const validated = forgotPasswordSchema.safeParse({ email });
    if (!validated.success) {
      return { success: false, error: "Invalid email address." };
    }

    // Rate limit check
    const headersList = await headers();
    const ip = getClientIP(headersList);
    const rateLimit = await checkRateLimit(ip, "passwordReset");
    if (!rateLimit.success) {
      return { success: false, error: "Too many requests. Please try again later." };
    }

    const normalizedEmail = validated.data.email.toLowerCase();

    // Find user (don't reveal if email exists or not)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Generate reset token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token in verification_tokens table
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });

      // Send reset email
      const resetUrl = `${process.env.NEXTAUTH_URL || "https://majedahmed.space"}/reset-password?token=${token}&email=${normalizedEmail}`;

      await sendEmail({
        to: normalizedEmail,
        subject: "Reset Your Password — BIBAZ",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="text-align: center; letter-spacing: 2px;">BIBAZ</h1>
            <h2>Password Reset Request</h2>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: #111; color: #fff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    }

    // Always return success (don't reveal if email exists)
    return {
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    };
  } catch (err) {
    console.error("[AUTH] Forgot password error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Reset Password — validates token and sets new password
 */
export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    const validated = resetPasswordSchema.safeParse({ token, password: newPassword });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || "Invalid input." };
    }

    // Find valid token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return { success: false, error: "Invalid or expired reset link. Please request a new one." };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(validated.data.password, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete used token
    await prisma.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier },
    });

    return { success: true, message: "Password reset successfully. You can now login." };
  } catch (err) {
    console.error("[AUTH] Reset password error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
