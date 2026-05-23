/**
 * BIBAZ — Search Bar Component
 * Sleek, full-screen luxury visual search overlay accessible on all viewports.
 * SOP §২ — Frontend Plan F1.7
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

const popularSearches = [
  "Borka",
  "Silk Saree",
  "Three Piece",
  "Daily Wear Abaya",
  "Boutique Suits",
  "Eid Collection",
];

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/collections/new-arrivals?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <>
      {/* Sleek Search Button (Visible on all viewports) */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center size-10 text-foreground/60 hover:text-foreground hover:bg-neutral-50 transition-all cursor-pointer"
        aria-label="Search products"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>

      {/* Luxury Full-Screen Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/98 backdrop-blur-md z-[99999] flex flex-col p-6 md:p-12 animate-fade-in">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-start">
            
            {/* Top Close Panel */}
            <div className="flex justify-end mb-8 md:mb-12">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
                className="flex items-center justify-center size-12 rounded-full border border-border/40 hover:border-foreground/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label="Close search overlay"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Large Search Input */}
            <form onSubmit={handleSubmit} className="border-b border-border/60 pb-4 flex items-center gap-4 animate-slide-up">
              <Search className="h-6 w-6 text-muted-foreground/60" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH FOR PRODUCTS..."
                className="flex-1 bg-transparent text-lg md:text-2xl font-heading tracking-wider placeholder:text-muted-foreground/30 focus:outline-none uppercase font-semibold text-foreground"
                aria-label="Search inputs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer font-bold"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Suggestions & Visual Trending Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pt-8 md:pt-12 animate-slide-up [animation-delay:100ms]">
              
              {/* Popular / Live Suggestions */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {query.trim() ? "Suggested Searches" : "Popular Searches"}
                </h3>
                
                <div className="flex flex-wrap gap-2.5">
                  {(query.trim()
                    ? popularSearches.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                    : popularSearches
                  ).map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="text-[11px] uppercase tracking-wider border border-border/80 hover:border-foreground hover:bg-neutral-50 px-4 py-2.5 transition-all duration-300 font-semibold text-foreground cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                  {query.trim() && popularSearches.filter((s) => s.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No suggestions found. Press enter to search for &quot;{query}&quot;.</p>
                  )}
                </div>
              </div>

              {/* Visual Recommendations (Trending categories with real images) */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  Trending Collections
                </h3>
                
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Borka Card */}
                  <Link
                    href="/collections/borka"
                    onClick={() => setIsOpen(false)}
                    className="relative aspect-[4/3] overflow-hidden group border border-border/20 shadow-sm"
                  >
                    <Image
                      src="/images/products/borka/borka 1.jpg"
                      alt="Borka collection"
                      fill
                      sizes="(max-width: 768px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/45">
                      <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/40 group-hover:border-white transition-all pb-0.5">Borka</span>
                    </div>
                  </Link>

                  {/* Saree Card */}
                  <Link
                    href="/collections/saree"
                    onClick={() => setIsOpen(false)}
                    className="relative aspect-[4/3] overflow-hidden group border border-border/20 shadow-sm"
                  >
                    <Image
                      src="/images/products/saree/shari 1.webp"
                      alt="Saree collection"
                      fill
                      sizes="(max-width: 768px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/45">
                      <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/40 group-hover:border-white transition-all pb-0.5">Saree</span>
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
