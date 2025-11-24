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
        relative w-full max-w-md rounded-3xl p-6
        bg-white/5 backdrop-blur-2xl
        border border-white/10 
        shadow-[0_8px_32px_rgba(0,0,0,0.16)]
        text-white
      "
    >
      {children}
    </motion.div>
  );
}
