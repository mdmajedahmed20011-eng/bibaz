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
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { loginSchema } from "./validators/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
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

        if (!user || !user.passwordHash) return null;

        // Verify password (bcrypt)
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.phone = (user as { phone: string | null }).phone;
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
