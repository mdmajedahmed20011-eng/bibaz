/**
 * BIBAZ — Hero Section (Premium v2.0)
 * Cinematic, 85vh, Ken Burns effect, editorial typography
 * Design Guide: Cinematic hero with lifestyle feel
 */

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full h-[65vh] md:h-[85vh] overflow-hidden">
      {/* Background with Ken Burns animation */}
      <div className="absolute inset-0 animate-[kenBurns_20s_ease-in-out_infinite_alternate]">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,255,255,0.03),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-xl animate-[fadeInUp_1s_ease-out]">
            {/* Overline */}
            <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium mb-4 md:mb-6">
              New Season 2026
            </p>

            {/* Main heading — Display size, serif */}
            <h1 className="text-[40px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-bold text-white leading-[1.05] tracking-[-0.03em] mb-5 md:mb-6">
              Elegance
              <br />
              <span className="italic font-normal text-neutral-200">Redefined</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-neutral-400 max-w-sm leading-relaxed mb-8 md:mb-10">
              Discover premium borka, saree & boutique collections crafted for the modern woman.
            </p>

            {/* CTA — Single, clean */}
            <Link
              href="/collections/new-arrivals"
              className="inline-flex items-center justify-center h-12 md:h-13 px-8 md:px-10 bg-white text-black text-sm font-medium tracking-wide hover:bg-neutral-100 active:scale-[0.97] transition-all duration-200"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade — hints at next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
