"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppButton({ phoneNumber = "8801700000000" }: { phoneNumber?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Delay appearance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -5, filter: "blur(2px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-14 whitespace-nowrap bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-md border border-border/40 text-[11px] font-semibold text-foreground pointer-events-none hidden md:block"
              >
                Chat with us on WhatsApp
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition-transform duration-300"
            aria-label="Contact on WhatsApp"
          >
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-whatsapp-pulse pointer-events-none" />

            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
