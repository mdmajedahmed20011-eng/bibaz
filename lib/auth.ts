/**
 * BIBAZ — NextAuth.js v5 Configuration
 * SOP §৪A — Authentication & Authorization
 *
 * Strategy: JWT in HttpOnly Secure Cookies
 * Password: Bcrypt (salt rounds: 12)
 * Roles: CUSTOMER, STAFF, MANAGER, ADMIN, SUPER_ADMIN
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { loginSchema } from "./validators/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Note: adapter removed for JWT strategy compatibility
  // PrismaAdapter is only needed for database sessions, not JWT
  // OAuth account linking handled manually in jwt callback
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.error("[AUTH] Zod validation failed:", parsed.error.issues);
          return null;
        }

        const { email, password } = parsed.data;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            passwordHash: true,
            role: true,
            image: true,
            emailVerified: true,
          },
        });

        if (!user) {
          console.error("[AUTH] User not found for email:", email.toLowerCase());
          return null;
        }

        if (!user.passwordHash) {
          console.error("[AUTH] User has no password (OAuth-only account):", email);
          return null;
        }

        // Verify password (bcrypt)
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          console.error("[AUTH] Password mismatch for:", email);
          return null;
        }

        console.log("[AUTH] Login successful for:", email);
        // Return user (without password hash)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // Facebook({...}),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign in, add user data to token
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role || "CUSTOMER";
        token.phone = (user as { phone: string | null }).phone || null;
      }
      // For OAuth users, fetch role from DB
      if (account && account.provider !== "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          select: { id: true, role: true, phone: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.phone = dbUser.phone;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { phone: string | null }).phone = token.phone as string | null;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        const role = (auth?.user as { role?: string })?.role;
        const adminRoles = ["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"];
        return adminRoles.includes(role || "");
      }

      return true;
    },
  },
});
