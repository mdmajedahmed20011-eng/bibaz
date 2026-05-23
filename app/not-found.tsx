/**
 * BIBAZ — 404 Not Found Page
 * Branded, friendly error page
 * SOP §২ — Frontend Plan F6.5
 */

import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="text-center space-y-6 max-w-md">
        {/* Large 404 */}
        <div className="space-y-2">
          <p className="text-7xl md:text-9xl font-bold text-muted-foreground/20">404</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved
            or doesn&apos;t exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/collections/new-arrivals"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
