/**
 * BIBAZ — Product Images (Premium v2.0)
 * Large main image + thumbnail strip
 * Mobile: swipeable, Desktop: click thumbnails
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
    <div className="space-y-3">
      {/* Main Image — large, clean */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Image
          src={selectedImage}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails — horizontal strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden bg-[#f5f5f5] transition-all ${selectedIndex === index
                  ? "ring-2 ring-foreground ring-offset-1"
                  : "opacity-60 hover:opacity-100"
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
    </div>
  );
}
