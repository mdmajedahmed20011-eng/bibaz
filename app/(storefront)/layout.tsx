/**
 * BIBAZ — Storefront Layout
 * Wraps all public-facing pages with Header + Footer
 */

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}
