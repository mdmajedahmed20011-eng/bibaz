/**
 * BIBAZ — Contact Page (Premium v2.0)
 * Clean, organized, 2-column editorial dashboard with near-black form elements
 * Design Guide: 10x advanced luxury brand contact dashboard
 */

import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us — BIBAZ",
  description: "Have a question? Contact the BIBAZ customer experience team. We are here to help.",
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* 1. Header Section — Clean Editorial */}
      <section className="relative py-16 md:py-24 bg-surface-warm/40 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold animate-[slideDown_0.5s_ease-out]">
              Connect with us
            </p>
            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-[-0.03em] leading-tight text-foreground animate-[fadeInUp_0.6s_ease-out]">
              We Would Love <br />
              <span className="italic font-normal">to Hear From You</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto pt-2 animate-[fadeIn_0.8s_ease-out]">
              Have a query regarding sizing, fabrics, custom orders, or delivery? Reach out to our
              dedicated customer experience team.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Content Dashboard — 2-Column Split */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Form Panel (7 cols) */}
              <div className="lg:col-span-7 space-y-8 reveal">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-foreground font-heading">
                    Send Us a Message
                  </h2>
                  <div className="w-10 h-[1.5px] bg-accent/60" />
                </div>

                <form className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Your first and last name"
                      className="w-full h-11 px-4 border border-border/80 bg-background text-sm rounded-sm placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground focus:ring-0 transition-colors uppercase tracking-wide"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="customer@email.com"
                      className="w-full h-11 px-4 border border-border/80 bg-background text-sm rounded-sm placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground focus:ring-0 transition-colors uppercase tracking-wide"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-subject"
                      className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                    >
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      placeholder="Sizing, order status, custom tailoring..."
                      className="w-full h-11 px-4 border border-border/80 bg-background text-sm rounded-sm placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground focus:ring-0 transition-colors uppercase tracking-wide"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={6}
                      placeholder="Please details your request..."
                      className="w-full px-4 py-3 border border-border/80 bg-background text-sm rounded-sm placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground focus:ring-0 resize-none transition-colors uppercase tracking-wide leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-11 bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-all active:scale-[0.98] rounded-sm cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Right Column: Business Info Card (5 cols) */}
              <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 reveal [transition-delay:200ms]">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-foreground font-heading">
                    Business Information
                  </h2>
                  <div className="w-10 h-[1.5px] bg-accent/60" />
                </div>

                {/* Info Card with gold border & cream backdrop */}
                <div className="p-8 rounded-sm bg-surface-warm/40 border border-accent/20 space-y-6 shadow-sm">
                  <div className="space-y-5">
                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                          Phone Support
                        </p>
                        <a
                          href={`tel:${BUSINESS.PHONE}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium mt-1 inline-block"
                        >
                          {BUSINESS.PHONE}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                          Email Support
                        </p>
                        <a
                          href={`mailto:${BUSINESS.EMAIL}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium mt-1 inline-block"
                        >
                          {BUSINESS.EMAIL}
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                          Flagship Atelier
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium mt-1">
                          {BUSINESS.ADDRESS}
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-4">
                      <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                          Business Hours
                        </p>
                        <div className="text-xs text-muted-foreground leading-relaxed font-medium mt-1 space-y-0.5">
                          <p>Saturday - Thursday: 10:00 AM - 8:00 PM</p>
                          <p>Friday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-accent/15 pt-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-3">
                      Follow our Journey
                    </p>
                    <div className="flex gap-4">
                      <a
                        href={BUSINESS.FACEBOOK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
                      >
                        <svg
                          className="h-3.5 w-3.5 text-accent"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </a>
                      <a
                        href={BUSINESS.INSTAGRAM}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
                      >
                        <svg
                          className="h-3.5 w-3.5 text-accent"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
