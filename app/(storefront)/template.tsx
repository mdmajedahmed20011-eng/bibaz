"use client";

import { motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 flex flex-col w-full h-full"
    >
      {children}
    </motion.div>
  );
}
