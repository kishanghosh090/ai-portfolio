"use client";
import { useState } from "react";
import { Github, Linkedin } from "lucide-react";

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
          <span className="font-semibold text-white text-sm"><a href="/">Kishan</a></span>
        </div>

        {/* RIGHT — Social Icons */}
        <div className="flex gap-4 text-white">
          <a href="https://github.com/kishanghosh090" target="_blank">
            <Github className="hover:text-gray-300 transition" size={20} />
          </a>
          <a href="https://www.linkedin.com/in/kishan-rana-ghosh-8b95832b9/" target="_blank">
            <Linkedin className="hover:text-gray-300 transition" size={20} />
          </a>
       
        </div>
      </div>
    </>
  );
}
