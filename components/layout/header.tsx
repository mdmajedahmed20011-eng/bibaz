/**
 * BIBAZ — Header (Premium v2.0)
 * Clean, minimal, luxury feel
 * Design Guide: 64px height, subtle border, backdrop-blur
 */

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { CartButton } from "./cart-button";
import { SearchBar } from "./search-bar";

const navLinks = [
  { href: "/collections/borka", label: "Borka" },
  { href: "/collections/saree", label: "Saree" },
  { href: "/collections/boutique", label: "Boutique" },
  { href: "/collections/three-piece", label: "Three Piece" },
  { href: "/collections/new-arrivals", label: "New Arrivals" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      {/* Announcement Bar — subtle */}
      <div className="bg-foreground text-background text-center text-[11px] tracking-wide py-2 px-4">
        <p>Free delivery on orders above ৳10,000 &nbsp;|&nbsp; Cash on Delivery available</p>
      </div>

      {/* Main Header — 64px */}
      <div className="border-b border-border/60">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-4">
              <MobileNav links={navLinks} />
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo/348254398_927747708509948_4192295653740697805_n.jpg"
                  alt="BIBAZ"
                  width={36}
                  height={36}
                  className="h-9 w-auto"
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-foreground/70 tracking-[0.01em] hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Search + Cart + User */}
            <div className="flex items-center gap-0.5">
              <SearchBar />
              <CartButton />
              <Link
                href="/account"
                className="flex items-center justify-center size-10 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="My account"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
