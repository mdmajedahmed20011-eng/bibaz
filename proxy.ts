/**
 * BIBAZ — Proxy (Next.js 16)
 * Formerly middleware.ts — renamed in Next.js 16
 * 
 * Purpose:
 * - Protect admin routes (auth check)
 * - Add security headers
 * - Handle redirects
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
        // TODO: Check auth session token in cookies
        // For now, allow access (will be implemented with NextAuth)
        const sessionToken = request.cookies.get("next-auth.session-token")?.value
            || request.cookies.get("__Secure-next-auth.session-token")?.value;

        if (!sessionToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Routes that proxy should run on
export const config = {
    matcher: [
        // Admin routes (protected)
        "/admin/:path*",
        // Skip static files and API routes
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};
