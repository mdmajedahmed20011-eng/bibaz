import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Paths that require authentication
const protectedPaths = ["/account", "/admin"];

// Paths that require guest (unauthenticated)
const guestPaths = ["/login", "/register", "/forgot-password"];

export default auth(async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Security Headers & CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Note: strict CSP without unsafe-inline can break next/image and framer-motion in some cases
  // So we allow unsafe-inline for styles, but strict for scripts
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://res.cloudinary.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // Create response
  const response = NextResponse.next();

  // Add Security Headers
  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Auth Routing Logic
  // @ts-expect-error - session type is injected by next-auth middleware wrapper
  const session = req.auth;

  const isProtected = protectedPaths.some((p) => path.startsWith(p));
  const isGuest = guestPaths.some((p) => path.startsWith(p));

  if (isProtected && !session) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  if (isGuest && session) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // Admin route protection
  if (path.startsWith("/admin")) {
    const role = (session?.user as { role?: string })?.role;
    if (!["STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"].includes(role || "")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|images|payment).*)",
  ],
};
