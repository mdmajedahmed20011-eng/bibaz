/**
 * BIBAZ — Search Bar Component
 * Product search with suggestions dropdown
 * SOP §২ — Frontend Plan F1.7
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

// Placeholder suggestions — will be replaced with real search (Phase 3 / Meilisearch)
const popularSearches = [
  "Borka",
  "Silk Saree",
  "Three Piece",
  "Black Borka",
  "Party Wear",
  "Boutique",
  "Wedding Collection",
  "New Arrivals",
];

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredSuggestions = query.trim()
    ? popularSearches.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : popularSearches.slice(0, 5);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="hidden sm:block relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-56 lg:w-72 h-9 pl-9 pr-8 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search products"
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setQuery("");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Close search"
        >
          <X className="h-4 w-4" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {filteredSuggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-lg border border-border bg-background shadow-lg z-50 py-2">
          <p className="px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            {query.trim() ? "Suggestions" : "Popular Searches"}
          </p>
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
