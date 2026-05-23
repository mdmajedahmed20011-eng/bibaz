/**
 * BIBAZ — Collection Filters (Sidebar)
 * Category, Size, Color, Price Range filters
 * SOP §২ — Frontend Plan F3.2
 *
 * Desktop: Sidebar | Mobile: Drawer (separate component)
 */

"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Red", value: "#dc2626" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gold", value: "#d4a574" },
  { name: "Green", value: "#16a34a" },
  { name: "Maroon", value: "#7f1d1d" },
];

const priceRanges = [
  { label: "Under ৳2,000", min: 0, max: 2000 },
  { label: "৳2,000 - ৳4,000", min: 2000, max: 4000 },
  { label: "৳4,000 - ৳6,000", min: 4000, max: 6000 },
  { label: "৳6,000 - ৳10,000", min: 6000, max: 10000 },
  { label: "Above ৳10,000", min: 10000, max: Infinity },
];

export function CollectionFilters() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Filters</h3>
        <Separator />
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                selectedSizes.includes(size)
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
              aria-pressed={selectedSizes.includes(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Color Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={`relative h-7 w-7 rounded-full border-2 transition-all ${
                selectedColors.includes(color.name)
                  ? "border-foreground scale-110"
                  : "border-border hover:border-foreground/50"
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={`Filter by ${color.name}`}
              aria-pressed={selectedColors.includes(color.name)}
              title={color.name}
            >
              {selectedColors.includes(color.name) && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={
                      color.value === "#FFFFFF" || color.value === "#d4a574" ? "#000" : "#fff"
                    }
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Price</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price-range"
                checked={selectedPrice === range.label}
                onChange={() =>
                  setSelectedPrice(selectedPrice === range.label ? null : range.label)
                }
                className="h-4 w-4 rounded-full border-border text-foreground focus:ring-foreground"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedPrice) && (
        <button
          onClick={() => {
            setSelectedSizes([]);
            setSelectedColors([]);
            setSelectedPrice(null);
          }}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
