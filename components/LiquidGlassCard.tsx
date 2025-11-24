"use client";

import { motion } from "framer-motion";

export default function LiquidGlassCard({ children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="
        
      "
    >
      {children}
    </motion.div>
  );
}
