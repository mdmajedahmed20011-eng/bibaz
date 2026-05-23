/**
 * BIBAZ — Hero Banner Section
 * Premium, smooth, modern visual with CTA
 * SOP §২ — Homepage Section 1
 *
 * Stage 7: Enhanced with subtle animations and better visual hierarchy
 */

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,165,116,0.06),transparent_40%)]" />

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36 relative z-10">
        <div className="max-w-2xl space-y-6 animate-[fadeInUp_0.8s_ease-out]">
          {/* Subtitle */}
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-neutral-400 font-medium">
            New Season Collection
          </p>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Elegance
            <br />
            <span className="text-neutral-300 italic">Redefined</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-md leading-relaxed">
            Discover premium borka, saree, and boutique collections crafted for the modern woman.
            Quality meets style.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <Link
              href="/collections/new-arrivals"
              className="inline-flex items-center justify-center h-11 sm:h-12 px-7 sm:px-8 rounded-lg bg-white text-black font-medium text-sm hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Shop Now
            </Link>
            <Link
              href="/collections/borka"
              className="inline-flex items-center justify-center h-11 sm:h-12 px-7 sm:px-8 rounded-lg border border-neutral-500 text-white font-medium text-sm hover:bg-white/5 hover:border-neutral-400 transition-all duration-200"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
