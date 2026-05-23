/**
 * BIBAZ — Header Component
 * Desktop: Logo | Navigation | Search | Cart | User
 * Mobile: Logo | Cart | Hamburger Menu
 */

import Link from "next/link";
import { User } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { CartButton } from "./cart-button";
import { SearchBar } from "./search-bar";

// Navigation links
const navLinks = [
  { href: "/collections/borka", label: "Borka" },
  { href: "/collections/saree", label: "Saree" },
  { href: "/collections/boutique", label: "Boutique" },
  { href: "/collections/three-piece", label: "Three Piece" },
  { href: "/collections/new-arrivals", label: "New Arrivals" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar — announcement */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 px-4">
        <p>Free delivery on orders above ৳10,000 | Cash on Delivery available</p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4">
            <MobileNav links={navLinks} />
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo/348254398_927747708509948_4192295653740697805_n.jpg"
                alt="BIBAZ"
                className="h-9 w-auto rounded"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Cart + User */}
          <div className="flex items-center gap-1">
            <SearchBar />

            <CartButton />

            <Link
              href="/account"
              className="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="My account"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
