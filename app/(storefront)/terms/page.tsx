/**
 * BIBAZ — Terms & Conditions Page
 * SOP §২ — Frontend Plan F6.3
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "BIBAZ terms and conditions of service.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto prose prose-neutral prose-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Terms & Conditions</h1>

        <p className="text-muted-foreground">Last updated: May 2026</p>

        <h2 className="text-lg font-semibold mt-8 mb-3">1. General</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          By accessing and placing an order with BIBAZ, you confirm that you are in agreement with
          and bound by the terms and conditions contained herein. These terms apply to the entire
          website and any email or other type of communication between you and BIBAZ.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-3">2. Products</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All products displayed on our website are subject to availability. We reserve the right to
          discontinue any product at any time. Colors may vary slightly from what appears on screen
          due to monitor settings.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-3">3. Pricing</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All prices are listed in Bangladeshi Taka (৳/BDT). Prices are subject to change without
          notice. Delivery charges are additional and calculated at checkout based on your location.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-3">4. Orders</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Once an order is placed, you will receive a confirmation. We reserve the right to cancel
          any order if the product is unavailable or if there is a pricing error. In such cases, you
          will be notified and refunded if payment was already made.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-3">5. Delivery</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Delivery within Dhaka: ৳80 (2-3 business days). Delivery outside Dhaka: ৳150 (3-5 business
          days). Delivery times are estimates and may vary during peak seasons or due to unforeseen
          circumstances.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-3">6. Payment</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We currently accept Cash on Delivery (COD). Additional payment methods including bKash,
          Nagad, and card payments will be available soon.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-3">7. Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For any questions regarding these terms, please contact us at habiba13.hafiz@gmail.com or
          call +880 1860-744181.
        </p>
      </div>
    </div>
  );
}
