/**
 * BIBAZ — Product Images Component
 * Main image + thumbnails, zoom on hover (desktop), swipe (mobile)
 * SOP §২ — Frontend Plan F3.8
 */

"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex] ?? images[0] ?? "";

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted group">
        <Image
          src={selectedImage}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-foreground"
                  : "border-transparent hover:border-border"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
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
    </div>
  );
}
