/**
 * BIBAZ — Collection Filters (Premium v2.0)
 * Clean, functional filters — works on both desktop sidebar and mobile drawer
 */

"use client";

import { useState } from "react";

const sizes = ["S", "M", "L", "XL", "XXL", "Free Size"];

const priceRanges = [
  { label: "Under ৳2,000", value: "0-2000" },
  { label: "৳2,000 - ৳3,000", value: "2000-3000" },
  { label: "৳3,000 - ৳5,000", value: "3000-5000" },
  { label: "Above ৳5,000", value: "5000-99999" },
];

export function CollectionFilters() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const hasFilters = selectedSizes.length > 0 || selectedPrice !== null;

  return (
    <div className="space-y-6">
      {/* Size Filter */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-9 min-w-[40px] px-3 text-xs border transition-all ${selectedSizes.includes(size)
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-foreground hover:border-foreground"
                }`}
              aria-pressed={selectedSizes.includes(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Price Range Filter */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Price</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="price-range"
                checked={selectedPrice === range.value}
                onChange={() =>
                  setSelectedPrice(
                    selectedPrice === range.value ? null : range.value
                  )
                }
                className="h-4 w-4 border-border text-foreground focus:ring-foreground"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <>
          <div className="border-t border-border" />
          <button
            onClick={() => {
              setSelectedSizes([]);
              setSelectedPrice(null);
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Clear all filters
          </button>
        </>
      )}
    </div>
  );
}
