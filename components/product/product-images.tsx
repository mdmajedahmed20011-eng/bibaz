"use client";

/**
 * BIBAZ — Product Images Gallery (Premium v2.0 — Aarong Inspired)
 * Editorial split layout: Vertical thumbnails left, main image right on desktop.
 * Includes a premium, high-resolution Full-Screen Lightbox Zoom Viewer.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const selectedImage = images[selectedIndex] ?? images[0] ?? "";

  // Prevent scroll when lightbox viewer is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop Asymmetric Flex Layout: Vertical Preview Left, Main Image Right */}
      <div className="flex flex-col-reverse md:flex-row gap-4">
        
        {/* 1. Vertical Thumbnail Strip (Desktop view) */}
        {images.length > 1 && (
          <div className="hidden md:flex flex-col gap-3 w-[72px] shrink-0">
            {images.map((image, index) => (
              <button
                key={`thumb-vert-${index}`}
                onClick={() => setSelectedIndex(index)}
                className={`relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 transition-all duration-300 rounded-sm cursor-pointer ${
                  selectedIndex === index
                    ? "ring-1.5 ring-accent ring-offset-1 opacity-100"
                    : "opacity-60 hover:opacity-100 border border-neutral-200/40"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* 2. Main Large Image Display Card */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="flex-1 relative aspect-[3/4] overflow-hidden bg-[#faf9f6] cursor-zoom-in group shadow-sm rounded-sm"
        >
          <Image
            src={selectedImage}
            alt={`${productName} - Main image view`}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            priority
          />
          
          {/* Subtle gold lighting overlay and hover zoom icon */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,169,110,0.05),transparent_40%)]" />
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Maximize2 className="h-4 w-4 text-foreground/75" strokeWidth={1.5} />
          </div>
        </div>

        {/* 3. Horizontal Thumbnails (Mobile-only scroll strip) */}
        {images.length > 1 && (
          <div className="flex md:hidden gap-2.5 overflow-x-auto pb-1 mt-1 scrollbar-thin">
            {images.map((image, index) => (
              <button
                key={`thumb-horiz-${index}`}
                onClick={() => setSelectedIndex(index)}
                className={`relative shrink-0 w-[54px] aspect-[3/4] overflow-hidden bg-neutral-100 transition-all duration-300 rounded-sm cursor-pointer ${
                  selectedIndex === index
                    ? "ring-1.5 ring-accent ring-offset-1 opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} mobile thumbnail ${index + 1}`}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Luxury Full-Screen Lightbox Viewer (Renders on Click) */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4 md:p-8 animate-fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 flex items-center justify-center size-12 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>

          {/* Cycling control arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 flex items-center justify-center size-12 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 flex items-center justify-center size-12 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* Active high-res image slide */}
          <div className="relative w-full max-w-4xl h-[75vh] md:h-[85vh] animate-slide-up select-none">
            <Image
              src={selectedImage}
              alt={`${productName} full resolution`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Counter info */}
          <div className="absolute bottom-6 text-white/60 text-xs font-semibold uppercase tracking-[0.2em]">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
