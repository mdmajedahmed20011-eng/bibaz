"use client";

/**
 * BIBAZ — Header (Premium v2.0)
 * Clean, minimal, luxury feel
 * Design Guide: 64px height, subtle border, backdrop-blur
 */

import Link from "next/link";
import Image from "next/image";
import { User, X } from "lucide-react";
import { useState } from "react";
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

const megaMenuData: Record<
  string,
  {
    categories: { label: string; href: string }[];
    styles: { label: string; href: string }[];
    featured: { title: string; subtitle: string; image: string; href: string };
  }
> = {
  Borka: {
    categories: [
      { label: "Shop All Borka", href: "/collections/borka" },
      { label: "New Arrivals", href: "/collections/borka?filter=new" },
      { label: "Party Abaya", href: "/collections/borka?filter=party" },
      { label: "Daily Wear", href: "/collections/borka?filter=daily" },
    ],
    styles: [
      { label: "Butterfly Abaya", href: "/collections/borka?style=butterfly" },
      { label: "Open Front Abaya", href: "/collections/borka?style=open" },
      { label: "Lace Trim Luxury", href: "/collections/borka?style=lace" },
      { label: "Satin Elegance", href: "/collections/borka?style=satin" },
    ],
    featured: {
      title: "Luxury Abaya Collection",
      subtitle: "Handcrafted detailing and fine fabrics.",
      image: "/images/products/borka/borka 3.jpg",
      href: "/collections/borka",
    },
  },
  Saree: {
    categories: [
      { label: "Shop All Saree", href: "/collections/saree" },
      { label: "New Saree Designs", href: "/collections/saree?filter=new" },
      { label: "Traditional Silk", href: "/collections/saree?filter=silk" },
      { label: "Printed Cotton", href: "/collections/saree?filter=cotton" },
    ],
    styles: [
      { label: "Paisley Block Print", href: "/collections/saree?style=paisley" },
      { label: "Mirror Work Special", href: "/collections/saree?style=mirror" },
      { label: "Floral Silk Saree", href: "/collections/saree?style=floral" },
      { label: "Sheer Geometric", href: "/collections/saree?style=sheer" },
    ],
    featured: {
      title: "Festive Silk Saree",
      subtitle: "Royal violet and golden patterns.",
      image: "/images/products/saree/shari 3.webp",
      href: "/collections/saree",
    },
  },
  Boutique: {
    categories: [
      { label: "Shop All Boutique", href: "/collections/boutique" },
      { label: "New Boutique Suits", href: "/collections/boutique?filter=new" },
      { label: "Embroidered Luxury", href: "/collections/boutique?filter=luxury" },
      { label: "Casual Designer", href: "/collections/boutique?filter=casual" },
    ],
    styles: [
      { label: "Sharara & Gharara", href: "/collections/boutique?style=sharara" },
      { label: "Designer Salwar", href: "/collections/boutique?style=salwar" },
      { label: "Blush Silk Suits", href: "/collections/boutique?style=blush" },
      { label: "Paisley Beige Suit", href: "/collections/boutique?style=beige" },
    ],
    featured: {
      title: "Exclusive Boutique Sets",
      subtitle: "Limited designer runs.",
      image: "/images/products/boutique/bouthik 3.webp",
      href: "/collections/boutique",
    },
  },
  "Three Piece": {
    categories: [
      { label: "Shop All Three Piece", href: "/collections/three-piece" },
      { label: "New Kurta Sets", href: "/collections/three-piece?filter=new" },
      { label: "Zardozi Work Suits", href: "/collections/three-piece?filter=zardozi" },
      { label: "Printed Kurta Sets", href: "/collections/three-piece?filter=printed" },
    ],
    styles: [
      { label: "Magenta Zardozi Suit", href: "/collections/three-piece?style=zardozi" },
      { label: "Yellow Floral Kurta", href: "/collections/three-piece?style=yellow" },
      { label: "Hot Pink Paisley", href: "/collections/three-piece?style=pink" },
      { label: "Golden Embellished", href: "/collections/three-piece?style=gold" },
    ],
    featured: {
      title: "Premium Three Piece",
      subtitle: "Artisanal block prints and zardozi.",
      image: "/images/products/three-piece/tree prices 1.webp",
      href: "/collections/three-piece",
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Header({ settings = {} }: { settings?: Record<string, any> }) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const freeShippingThreshold = Number(settings.free_shipping_threshold || 0);
  const announcementText =
    freeShippingThreshold > 0
      ? `Free delivery on orders above ৳${freeShippingThreshold.toLocaleString()} | Cash on Delivery available`
      : "Free delivery on orders above ৳10,000 | Cash on Delivery available";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 transition-shadow duration-300">
      {/* Announcement Bar — subtle */}
      {showAnnouncement && (
        <div className="bg-foreground text-background text-center text-[11px] tracking-wide py-2 px-4 relative">
          <p>{announcementText}</p>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background transition-colors"
            aria-label="Close announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Header — 64px */}
      <div className="border-b border-border/60 relative">
        <div className="container mx-auto px-6 md:px-8 static">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-4">
              <MobileNav links={navLinks} />
              <Link href="/" className="flex items-center">
                <Image
                  src={
                    settings.store_logo ||
                    "/images/logo/348254398_927747708509948_4192295653740697805_n.jpg"
                  }
                  alt="BIBAZ"
                  width={36}
                  height={36}
                  className="h-9 w-auto"
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation with Mega Menu */}
            <nav className="hidden lg:flex items-center gap-8 static" aria-label="Main navigation">
              {navLinks.map((link) => {
                const hasMegaMenu = link.label in megaMenuData;
                const menu = megaMenuData[link.label];

                return (
                  <div key={link.href} className="group static">
                    <Link
                      href={link.href}
                      prefetch={true}
                      className="text-[13px] font-medium text-foreground/70 tracking-[0.02em] hover:text-foreground py-6 block transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-accent after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300"
                    >
                      {link.label}
                    </Link>

                    {hasMegaMenu && menu && (
                      <div className="absolute top-full left-0 right-0 w-full bg-white border-t border-border/70 shadow-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
                        <div className="container mx-auto px-8 py-10 grid grid-cols-4 gap-8">
                          {/* Column 1: Subcategories */}
                          <div>
                            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground mb-4">
                              Explore
                            </h4>
                            <ul className="space-y-3">
                              {menu.categories.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Column 2: Styles */}
                          <div>
                            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground mb-4">
                              Styles & Details
                            </h4>
                            <ul className="space-y-3">
                              {menu.styles.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Column 3: Trust & Storytelling info (biba/aarong pattern) */}
                          <div>
                            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground mb-4">
                              Our Guarantee
                            </h4>
                            <div className="space-y-4 pr-4">
                              <div>
                                <p className="text-[12px] font-medium text-foreground">
                                  100% Handcrafted
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                  Every item is made by skilled local artisans using fine materials.
                                </p>
                              </div>
                              <div>
                                <p className="text-[12px] font-medium text-foreground">
                                  Easy Size Exchange
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                  Hassle-free size replacement within 7 days of delivery.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Column 4: Featured Promo */}
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden group/featured">
                            <Image
                              src={menu.featured.image}
                              alt={menu.featured.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover/featured:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                              <h5 className="text-[14px] font-bold tracking-tight">
                                {menu.featured.title}
                              </h5>
                              <p className="text-[11px] text-white/80 mt-0.5 leading-snug">
                                {menu.featured.subtitle}
                              </p>
                              <Link
                                href={menu.featured.href}
                                className="text-[11px] font-medium underline underline-offset-2 mt-2 inline-block text-accent hover:text-white transition-colors"
                              >
                                Shop Now &rarr;
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
