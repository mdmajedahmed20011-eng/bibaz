/**
 * BIBAZ — Track Order Form
 * Order Number + Phone → Order Status
 * Guest-first: No login required
 */

"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderResult {
  orderNumber: string;
  status: string;
  date: string;
  estimatedDelivery: string;
  timeline: { status: string; date: string; active: boolean }[];
}

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError("Please fill in both fields");
      return;
    }

    setIsLoading(true);

    // TODO: Call server action to fetch order (Phase 3)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Placeholder result
      setResult({
        orderNumber: orderNumber.toUpperCase(),
        status: "SHIPPED",
        date: "May 22, 2026",
        estimatedDelivery: "May 24-25, 2026",
        timeline: [
          { status: "Order Placed", date: "May 22, 10:30 AM", active: true },
          { status: "Confirmed", date: "May 22, 11:00 AM", active: true },
          { status: "Processing", date: "May 22, 2:00 PM", active: true },
          { status: "Shipped", date: "May 23, 9:00 AM", active: true },
          { status: "Delivered", date: "Estimated: May 24-25", active: false },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="order-number" className="text-sm font-medium">
            Order Number
          </label>
          <input
            id="order-number"
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="ORD-2026-00001"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="track-phone" className="text-sm font-medium">
            Phone Number
          </label>
          <input
            id="track-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="01XXXXXXXXX"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {isLoading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="text-left space-y-4 p-5 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono font-medium">{result.orderNumber}</p>
              <p className="text-xs text-muted-foreground">Placed: {result.date}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              {result.status}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            Estimated delivery:{" "}
            <span className="font-medium text-foreground">{result.estimatedDelivery}</span>
          </p>

          <Separator />

          {/* Timeline */}
          <div className="space-y-0">
            {result.timeline.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      step.active ? "bg-foreground" : "bg-muted-foreground/20"
                    }`}
                  />
                  {index < result.timeline.length - 1 && (
                    <div
                      className={`w-0.5 h-7 ${
                        step.active ? "bg-foreground" : "bg-muted-foreground/20"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-5">
                  <p
                    className={`text-sm -mt-0.5 ${
                      step.active ? "font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step.status}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
