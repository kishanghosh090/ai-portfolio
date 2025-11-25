"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderKanban, Layers, Code2, Mail } from "lucide-react";
import VoiceButton from "./VoiceButton";
import SiriFluid from "./SiriFluid";
import { useState } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const items = [
    // { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/skills", label: "Skills", icon: Layers },
    // AI button - no icon here to avoid mixing component prop types
    { href: "#", label: "AI", icon: null },
    { href: "/dsa", label: "DSA", icon: Code2 },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <div className="fixed top-5 right-1/2 -translate-x-1/2 z-50">
        {isOpen && <SiriFluid active={true} />}
      </div>
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <nav
          className="
          flex items-center gap-6 px-4 py-1
          bg-black/40 backdrop-blur-xl
          border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]
          rounded-full
        "
        >
          {items.map((item) => {
            const active = pathname === item.href;
            // For the special AI item (href === "#") render the mic button without a Link
            if (item.href === "#") {
              return (
                <div
                  key={item.href}
                  className={`flex flex-col items-center text-[10px] transition ${
                    active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full transition ${
                      active ? "bg-white text-black" : ""
                    }`}
                  >
                    <VoiceButton setIsOpen={setIsOpen} />
                  </div>
                </div>
              );
            }

            const Icon = item.icon!;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-[10px] transition ${
                  active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <div
                  className={`p-2 rounded-full transition ${
                    active ? "bg-white text-black" : ""
                  }`}
                >
                  <Icon size={18} />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
