/**
 * BIBAZ — Mobile Navigation (Sheet/Drawer)
 * Slide-out menu for mobile devices
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
    links: { href: string; label: string }[];
}

export function MobileNav({ links }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                className="lg:hidden flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                    <SheetTitle className="text-left text-2xl font-bold">BIBAZ</SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center py-3 px-2 text-base font-medium text-foreground rounded-md hover:bg-muted transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <Separator className="my-4" />
                <div className="flex flex-col gap-1">
                    <Link
                        href="/track-order"
                        onClick={() => setOpen(false)}
                        className="flex items-center py-3 px-2 text-sm text-muted-foreground rounded-md hover:bg-muted transition-colors"
                    >
                        Track Order
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setOpen(false)}
                        className="flex items-center py-3 px-2 text-sm text-muted-foreground rounded-md hover:bg-muted transition-colors"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="flex items-center py-3 px-2 text-sm text-muted-foreground rounded-md hover:bg-muted transition-colors"
                    >
                        Contact
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}
