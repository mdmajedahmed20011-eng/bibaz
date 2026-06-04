"use client";

/**
 * BIBAZ — Hero Slider (Extracted from home-client.tsx)
 * Cinematic hero with Ken Burns, parallax, and progress dots.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ──────────────── Image With Skeleton ──────────────── */

function ImageWithSkeleton({
  src,
  alt,
  fill = true,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer z-[1]" />}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

/* ──────────────── Types ──────────────── */

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  link: string;
  overline: string;
  color: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

/* ──────────────── Component ──────────────── */

export function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroReady, setHeroReady] = useState(false);

  // Parallax depth
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 80]);

  // Hero entrance animation
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNextSlide = useCallback(
    () => setCurrentSlide((prev) => (prev + 1) % slides.length),
    [slides.length]
  );
  const handlePrevSlide = useCallback(
    () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length),
    [slides.length]
  );

  return (
    <section className="relative w-full h-[65vh] md:h-[88vh] overflow-hidden bg-neutral-950 group border-b border-border/20">
      {/* Decorative vertical lines */}
      <div className="absolute inset-0 z-20 pointer-events-none border-x-[1px] border-white/5 max-w-7xl mx-auto flex justify-between">
        <div className="w-[1px] h-full bg-white/5" />
        <div className="w-[1px] h-full bg-white/5" />
      </div>

      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <motion.div
              style={{ y: parallaxY }}
              className={`absolute inset-0 transition-transform duration-[8500ms] cubic-bezier(0.1, 1, 0.1, 1) ${
                isActive ? "scale-105" : "scale-100"
              }`}
            >
              <ImageWithSkeleton
                src={slide.image}
                alt={slide.title}
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/30 to-transparent`}
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
            </motion.div>

            {/* Hero Content with staggered entrance */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <div
                  className={`max-w-2xl transition-all duration-[1000ms] delay-300 transform ${
                    isActive && heroReady
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  {/* Overline with animated line */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`h-[1px] bg-accent transition-all duration-700 delay-500 ${
                        isActive && heroReady ? "w-8" : "w-0"
                      }`}
                    />
                    <p
                      className={`text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent font-bold transition-all duration-700 delay-500 ${
                        isActive && heroReady
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4"
                      }`}
                    >
                      {slide.overline}
                    </p>
                  </div>

                  {/* Title */}
                  <h1
                    className={`text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-bold text-white leading-[1.05] tracking-tight mb-5 font-heading transition-all duration-[800ms] delay-[400ms] ${
                      isActive && heroReady
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    {slide.title}
                  </h1>

                  <p
                    className={`text-xs sm:text-sm md:text-base text-neutral-200 max-w-md leading-relaxed mb-8 md:mb-10 font-medium font-sans transition-all duration-[800ms] delay-[600ms] ${
                      isActive && heroReady
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {slide.subtitle}
                  </p>

                  <div
                    className={`flex flex-wrap gap-4 transition-all duration-[800ms] delay-[800ms] ${
                      isActive && heroReady
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <Link
                      href={slide.link}
                      className="inline-flex items-center justify-center gap-2 h-12 md:h-13 px-8 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm shadow-lg hover:shadow-xl active:scale-[0.97] group/btn cursor-pointer"
                    >
                      Shop Collection
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation arrows */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-10 md:size-13 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer backdrop-blur-[2px]"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center size-10 md:size-13 rounded-full border border-white/10 bg-black/20 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer backdrop-blur-[2px]"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              index === currentSlide ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
