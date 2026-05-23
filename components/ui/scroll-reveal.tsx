"use client";

/**
 * BIBAZ — Scroll Reveal Animation Trigger
 * Global client component that registers an IntersectionObserver to trigger
 * smooth fade-up animations on elements with the 'reveal' class when scrolled into view.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Once visible, stop observing to keep CSS state permanent
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px", // Animates slightly before reaching the viewport
      }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
