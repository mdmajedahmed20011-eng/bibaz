import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Premium sans-serif font — self-hosted via next/font (0 CLS)
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

// Global metadata (SOP §৭ — SEO)
export const metadata: Metadata = {
    title: {
        default: "BIBAZ — Premium Women's Fashion",
        template: "%s — BIBAZ",
    },
    description:
        "Discover premium women's fashion at BIBAZ. Shop elegant borka, saree, boutique collections with nationwide delivery across Bangladesh.",
    keywords: ["women's fashion", "borka", "saree", "boutique", "Bangladesh", "BIBAZ"],
    authors: [{ name: "BIBAZ" }],
    creator: "BIBAZ",
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "BIBAZ",
        title: "BIBAZ — Premium Women's Fashion",
        description:
            "Discover premium women's fashion at BIBAZ. Shop elegant borka, saree, boutique collections.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
            <body className="min-h-full flex flex-col font-sans antialiased bg-background text-foreground">
                {/* Skip to main content — Accessibility (WCAG AA) */}
                <a href="#main-content" className="skip-link">
                    Skip to main content
                </a>
                {children}
            </body>
        </html>
    );
}
