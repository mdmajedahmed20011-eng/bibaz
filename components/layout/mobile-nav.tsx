"use client";

/**
 * BIBAZ — Mobile Navigation Overlay (Premium v2.0)
 * Full-screen visual experience with smooth animations, large touch targets,
 * expandable accordions, search integration, and persistent bag actions.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useCartStore } from "@/store/cart-store";

interface MobileNavProps {
    links: { href: string; label: string }[];
}

export function MobileNav({ links }: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    
    // Read cart items count dynamically from Zustand store
    const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

    // Prevent background body scroll when the overlay is active
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const toggleAccordion = (label: string) => {
        setActiveAccordion(activeAccordion === label ? null : label);
    };

    // Subcategories structured like desktop mega-menu for consistent mobile flows
    const categoriesWithSubs: Record<string, string[]> = {
        "Borka": ["Shop All Borka", "New Arrivals", "Party Abaya", "Daily Wear"],
        "Saree": ["Shop All Saree", "New Saree Designs", "Traditional Silk", "Printed Cotton"],
        "Boutique": ["Shop All Boutique", "New Boutique Suits", "Embroidered Luxury", "Casual Designer"],
        "Three Piece": ["Shop All Three Piece", "New Kurta Sets", "Zardozi Work Suits", "Printed Kurta Sets"]
    };

    return (
        <>
            {/* Minimal line trigger button */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden flex items-center justify-center size-10 text-foreground/80 hover:bg-neutral-100 rounded-full transition-all duration-200"
                aria-label="Open navigation menu"
            >
                <Menu className="h-6 w-6" strokeWidth={1.75} />
            </button>

            {/* Premium Full-Screen Navigation Panel Overlay */}
            {open && typeof document !== "undefined" && createPortal(
                <div className="fixed top-0 left-0 w-screen h-[100dvh] bg-white z-[9999] flex flex-col overflow-y-auto animate-slide-up">
                    {/* Header bar within overlay */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-border/50 bg-white">
                        <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
                            <Image
                                src="/images/logo/348254398_927747708509948_4192295653740697805_n.jpg"
                                alt="BIBAZ"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                            <span className="ml-2 font-heading text-lg font-bold tracking-tight">BIBAZ</span>
                        </Link>
                        
                        <button
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center size-10 text-foreground hover:bg-neutral-100 rounded-full transition-all duration-200"
                            aria-label="Close navigation menu"
                        >
                            <X className="h-6 w-6" strokeWidth={1.5} />
                        </button>
                    </div>



                    {/* Touch-Optimized Accordion Navigation Links */}
                    <nav className="flex-1 px-6 py-4" aria-label="Mobile navigation">
                        <div className="flex flex-col">
                            {links.map((link) => {
                                const hasSubCategories = link.label in categoriesWithSubs;
                                const isAccordionActive = activeAccordion === link.label;

                                return (
                                    <div key={link.href} className="border-b border-border/40">
                                        {hasSubCategories ? (
                                            <div>
                                                <button
                                                    onClick={() => toggleAccordion(link.label)}
                                                    className="w-full min-h-[56px] py-4 flex justify-between items-center text-[15px] font-semibold tracking-wide text-foreground hover:text-accent transition-colors"
                                                    aria-expanded={isAccordionActive}
                                                >
                                                    {link.label}
                                                    {isAccordionActive ? (
                                                        <ChevronUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                    )}
                                                </button>
                                                
                                                {/* Expandable Category Sub-menus */}
                                                {isAccordionActive && (
                                                    <div className="pl-4 pb-5 flex flex-col gap-4 animate-slide-down">
                                                        {(categoriesWithSubs[link.label] ?? []).map((subLabel) => {
                                                            const isShopAll = subLabel.toLowerCase().startsWith("shop all");
                                                            const urlParam = isShopAll ? "" : `?filter=${subLabel.toLowerCase().replace(/\s+/g, "-")}`;
                                                            return (
                                                                <Link
                                                                    key={subLabel}
                                                                    href={`${link.href}${urlParam}`}
                                                                    onClick={() => setOpen(false)}
                                                                    className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium py-1"
                                                                >
                                                                    {subLabel}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className="w-full min-h-[56px] py-4 flex items-center text-[15px] font-semibold tracking-wide text-foreground hover:text-accent transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Extra brand & utility links */}
                        <div className="flex flex-col gap-4 mt-8 pr-2">
                            <Link
                                href="/track-order"
                                onClick={() => setOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Track My Order
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Our Brand Story
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    </nav>

                    {/* Premium action cards in footer (native-app aesthetic) */}
                    <div className="px-6 py-6 border-t border-border bg-[#fcfbf9] grid grid-cols-2 gap-4 mt-auto">
                        <Link
                            href="/account"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center gap-2 h-12 bg-white border border-border text-sm font-medium text-foreground hover:border-foreground rounded-lg transition-colors shadow-sm"
                        >
                            <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            My Account
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center gap-2 h-12 bg-foreground text-background text-sm font-medium hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
                        >
                            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                            Bag ({cartCount})
                        </Link>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
