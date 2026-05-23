/**
 * BIBAZ — About Page
 * Brand story, mission, values
 * SOP §২ — Frontend Plan F6.1
 */

import type { Metadata } from "next";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about BIBAZ — Premium women's fashion brand in Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About BIBAZ</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Premium women&apos;s fashion crafted with passion, quality, and elegance for the modern
            Bangladeshi woman.
          </p>
        </div>

        {/* Story */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            BIBAZ was born from a simple belief — every woman deserves access to premium,
            beautifully crafted fashion without compromise. Since 2015, we have been curating and
            creating collections that blend traditional elegance with modern sensibility.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From our carefully selected borka and saree collections to our exclusive boutique
            designs, every piece at BIBAZ is chosen with care, ensuring the highest quality fabrics
            and craftsmanship.
          </p>
        </section>

        {/* Values */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                We handpick every fabric and inspect every stitch. No compromises on quality, ever.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Accessible Elegance</h3>
              <p className="text-sm text-muted-foreground">
                Premium fashion shouldn&apos;t break the bank. We offer luxury at fair prices.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Customer Love</h3>
              <p className="text-sm text-muted-foreground">
                Your satisfaction is our priority. Easy returns, fast delivery, and always here to
                help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4 p-6 rounded-xl bg-muted/30 border border-border">
          <h2 className="text-xl font-semibold">Get in Touch</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📞 {BUSINESS.PHONE}</p>
            <p>✉️ {BUSINESS.EMAIL}</p>
            <p>📍 {BUSINESS.ADDRESS}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
