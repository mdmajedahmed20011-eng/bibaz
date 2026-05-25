import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CartSyncManager } from "@/components/cart/cart-sync-manager";
import { unstable_cache } from "next/cache";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id;

  const getFavicon = unstable_cache(
    async () => {
      try {
        const setting = await prisma.siteSetting.findUnique({
          where: { key: "favicon_url" },
        });
        if (setting && setting.value) {
          return String(setting.value).replace(/['"]/g, "");
        }
      } catch {
        console.error("Failed to load favicon setting");
      }
      return "/favicon.ico";
    },
    ["favicon_setting"],
    { revalidate: 3600, tags: ["site_settings"] }
  );

  const faviconUrl = await getFavicon();

  return (
    <html
      lang="en"
      className={cn("h-full", inter.variable, playfair.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href={faviconUrl} />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-background text-foreground">
        <CartSyncManager userId={userId} />
        {/* Skip to main content — Accessibility (WCAG AA) */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <NextTopLoader
          color="#1a1a1a"
          height={2}
          showSpinner={false}
          shadow="0 0 10px #1a1a1a,0 0 5px #1a1a1a"
        />
        {/* Structured Data — SEO (SOP §৭) */}
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
