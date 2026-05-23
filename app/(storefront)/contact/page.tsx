/**
 * BIBAZ — Contact Page
 * Contact form + business info
 * SOP §২ — Frontend Plan F6.2
 */

import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with BIBAZ. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground">Have a question? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Send us a message</h2>
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-sm font-medium">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tell us more..."
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Business Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Business Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href={`tel:${BUSINESS.PHONE}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {BUSINESS.PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${BUSINESS.EMAIL}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {BUSINESS.EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{BUSINESS.ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Business Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Saturday - Thursday: 10:00 AM - 8:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">Friday: Closed</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href={BUSINESS.FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={BUSINESS.INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
