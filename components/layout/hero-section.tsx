"use client";

/**
 * BIBAZ — Hero Section (Premium v2.0)
 * Cinematic rotating slideshow with lifestyle imagery, slow Ken Burns zoom,
 * responsive typography, and tactile dot indicators.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/homebanner/Biba_NXT-D.jpg",
    title: "Elegance Redefined",
    subtitle: "Discover modern abayas, borkas and boutique wear.",
    link: "/collections/borka",
    overline: "New Season 2026",
  },
  {
    image: "/images/homebanner/Flat-50-D.jpg",
    title: "Seasonal Refresh",
    subtitle: "Premium cotton & designer sarees.",
    link: "/collections/saree",
    overline: "Special Promotion",
  },
  {
    image: "/images/homebanner/Flat-50_Girls-D.jpg",
    title: "Curated Classics",
    subtitle: "Complete coordinated three-piece sets.",
    link: "/collections/three-piece",
    overline: "Exclusive Range",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  // Automatic slide rotation every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-neutral-900 group">
      {/* Active and Inactive Slides Container */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background image container with active scale multiplier (Ken Burns) */}
            <div
              className={`absolute inset-0 transition-transform duration-[6500ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              {/* Radial and horizontal dark gradients to improve text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent md:from-black/50" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(0,0,0,0.4),transparent_60%)]" />
            </div>

            {/* Overlaid Editorial Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-6 md:px-8">
                <div
                  className={`max-w-lg transition-all duration-700 delay-300 transform ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  {/* Subtle Accent Overline */}
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-accent font-bold mb-3">
                    {slide.overline}
                  </p>

                  {/* Headline in Serif Display typography */}
                  <h1 className="text-[34px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-bold text-white leading-[1.1] tracking-tight mb-4 font-heading">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-neutral-200 max-w-sm leading-relaxed mb-6 md:mb-8 font-medium">
                    {slide.subtitle}
                  </p>

                  {/* Sleek CTA Button */}
                  <Link
                    href={slide.link}
                    className="inline-flex items-center justify-center h-11 md:h-12 px-6 md:px-8 bg-white hover:bg-neutral-100 text-black text-xs font-semibold uppercase tracking-[0.1em] transition-all rounded-sm shadow-md active:scale-[0.98]"
                  >
                    Shop Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Manual Sliding Arrow controls — visible on hover */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-10 md:size-12 rounded-full border border-white/10 bg-black/10 text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-10 md:size-12 rounded-full border border-white/10 bg-black/10 text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Bottom Progress/Dot indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-accent" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}
