"use client";

import { motion } from "framer-motion";

/**
 * App Router templates remount on every navigation, which makes them a good
 * home for the site-wide page transition. Exit animations are intentionally
 * omitted because the App Router keeps the previous route mounted.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
