/**
 * BIBAZ — Proxy (Next.js 16)
 * 
 * ONLY protects /admin routes.
 * All other routes (including /account) handle their own auth via session checks.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// ONLY run on admin routes — nothing else
export const config = {
  matcher: ["/admin/:path*"],
};
