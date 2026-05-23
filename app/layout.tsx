import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/json-ld";

// Body font — clean, modern, highly readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Heading font — elegant, premium feel for fashion brand
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

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
    <html lang="en" className={cn("h-full", inter.variable, playfair.variable)}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-background text-foreground">
        {/* Skip to main content — Accessibility (WCAG AA) */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Structured Data — SEO (SOP §৭) */}
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {children}
      </body>
    </html>
  );
}
