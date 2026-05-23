/**
 * BIBAZ — Hero Banner Section
 * Premium, smooth, modern visual with CTA
 * SOP §২ — Homepage Section 1
 */

import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
            {/* Background pattern/overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

            <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36 relative z-10">
                <div className="max-w-2xl space-y-6">
                    {/* Subtitle */}
                    <p className="text-sm uppercase tracking-[0.2em] text-neutral-400 font-medium">
                        New Season Collection
                    </p>

                    {/* Main heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                        Elegance
                        <br />
                        <span className="text-neutral-300">Redefined</span>
                    </h1>

                    {/* Description */}
                    <p className="text-base md:text-lg text-neutral-400 max-w-md leading-relaxed">
                        Discover premium borka, saree, and boutique collections crafted for
                        the modern woman. Quality meets style.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            href="/collections/new-arrivals"
                            className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-colors"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/collections"
                            className="inline-flex items-center justify-center h-11 px-8 rounded-lg border border-neutral-600 text-white font-medium text-sm hover:bg-neutral-800 transition-colors"
                        >
                            Explore Collections
                        </Link>
                    </div>
                </div>
            </div>

            {/* Subtle bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
