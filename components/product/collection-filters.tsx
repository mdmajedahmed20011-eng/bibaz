"use client";

/**
 * BIBAZ — Horizontal Collection Filters (Premium v2.0)
 * Biba-style horizontal sticky dropdown filters.
 * Connected to URL search params for instant, shareable, SEO-friendly filter states.
 */

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const sizes = ["S", "M", "L", "XL", "Free Size"];

const priceRanges = [
  { label: "Under ৳2,000", value: "0-2000" },
  { label: "৳2,000 - ৳3,000", value: "2000-3000" },
  { label: "৳3,000 - ৳5,000", value: "3000-5000" },
  { label: "Above ৳5,000", value: "5000-99999" },
];

export function CollectionFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Active dropdown panel states
  const [openDropdown, setOpenDropdown] = useState<"size" | "price" | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Read current URL filters
  const currentSizes = searchParams.getAll("size");
  const currentPrice = searchParams.get("price");

  // Helper to push new search parameters
  const updateFilters = (key: string, values: string[], removeKey?: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Always delete first to rebuild
    params.delete(key);
    values.forEach(v => params.append(key, v));

    if (removeKey) {
      params.delete(key);
    }

    setOpenDropdown(null);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleToggleSize = (size: string) => {
    const nextSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    updateFilters("size", nextSizes);
  };

  const handleSelectPrice = (value: string) => {
    if (currentPrice === value) {
      // Toggle off
      updateFilters("price", [], true);
    } else {
      updateFilters("price", [value]);
    }
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("size");
    params.delete("price");
    setOpenDropdown(null);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters = currentSizes.length > 0 || currentPrice !== null;

  return (
    <div ref={dropdownRef} className="w-full space-y-4">
      {/* 1. Horizontal Dropdown Bar */}
      <div className="flex flex-wrap items-center gap-3 py-3 border-y border-border/50 bg-white">
        
        {/* Size Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "size" ? null : "size")}
            className={`inline-flex items-center gap-1.5 h-10 px-4 text-xs font-semibold uppercase tracking-wider border rounded-sm transition-all cursor-pointer ${
              currentSizes.length > 0
                ? "bg-foreground text-background border-foreground"
                : "border-border text-foreground hover:border-foreground hover:bg-neutral-50"
            }`}
            aria-expanded={openDropdown === "size"}
          >
            Size {currentSizes.length > 0 && `(${currentSizes.length})`}
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openDropdown === "size" ? "rotate-180" : ""}`} />
          </button>

          {/* Size Absolute Panel */}
          {openDropdown === "size" && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-border shadow-xl rounded-md py-4 px-4 z-40 animate-slide-down">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Select Sizes</h5>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const isChecked = currentSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleToggleSize(size)}
                      className={`h-9 min-w-[40px] px-3 text-xs font-medium border rounded-sm transition-all cursor-pointer ${
                        isChecked
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-foreground hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Price Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
            className={`inline-flex items-center gap-1.5 h-10 px-4 text-xs font-semibold uppercase tracking-wider border rounded-sm transition-all cursor-pointer ${
              currentPrice
                ? "bg-foreground text-background border-foreground"
                : "border-border text-foreground hover:border-foreground hover:bg-neutral-50"
            }`}
            aria-expanded={openDropdown === "price"}
          >
            Price
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openDropdown === "price" ? "rotate-180" : ""}`} />
          </button>

          {/* Price Absolute Panel */}
          {openDropdown === "price" && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-border shadow-xl rounded-md py-4 px-4 z-40 animate-slide-down">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Price Range</h5>
              <div className="flex flex-col gap-2.5">
                {priceRanges.map((range) => {
                  const isChecked = currentPrice === range.value;
                  return (
                    <button
                      key={range.value}
                      onClick={() => handleSelectPrice(range.value)}
                      className={`w-full text-left h-9 px-3 text-xs font-medium border rounded-sm transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? "bg-foreground text-background border-foreground font-semibold"
                          : "border-border text-foreground hover:border-foreground hover:bg-neutral-50"
                      }`}
                    >
                      {range.label}
                      {isChecked && <X className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Active Clear Link inside bar */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer ml-auto"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 2. Active Filter Chips Display Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {currentSizes.map((size) => (
            <div
              key={`chip-size-${size}`}
              className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/50 rounded-full text-xs font-medium text-foreground transition-colors"
            >
              Size: {size}
              <button
                onClick={() => handleToggleSize(size)}
                className="size-4 rounded-full flex items-center justify-center hover:bg-neutral-300 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={`Remove size filter ${size}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}

          {currentPrice && (() => {
            const range = priceRanges.find(r => r.value === currentPrice);
            return range ? (
              <div
                key={`chip-price-${currentPrice}`}
                className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/50 rounded-full text-xs font-medium text-foreground transition-colors"
              >
                {range.label}
                <button
                  onClick={() => updateFilters("price", [], true)}
                  className="size-4 rounded-full flex items-center justify-center hover:bg-neutral-300 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Remove price filter"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
