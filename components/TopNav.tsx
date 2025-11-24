"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔹 GLASS NAVBAR */}
      <div
        className="
          px-5 py-3
          flex items-center justify-between
          z-40
        "
      >
        {/* LEFT — Profile Thumbnail */}
        <div
          className="cursor-pointer flex items-center gap-3"
          onClick={() => setOpen(true)}
        >
          <span className="font-semibold text-white text-sm">Kishan</span>
        </div>

        {/* RIGHT — Social Icons */}
        <div className="flex gap-4 text-white">
          <a href="https://github.com/yourname" target="_blank">
            <Github className="hover:text-gray-300 transition" size={20} />
          </a>
          <a href="https://linkedin.com/in/yourname" target="_blank">
            <Linkedin className="hover:text-gray-300 transition" size={20} />
          </a>
          <a href="https://instagram.com/yourname" target="_blank">
            <Instagram className="hover:text-gray-300 transition" size={20} />
          </a>
        </div>
      </div>
    </>
  );
}
