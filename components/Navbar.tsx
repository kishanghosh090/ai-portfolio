"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/dsa", label: "DSA" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          KR<span className="text-violet-400">G</span>
        </Link>
        <div className="flex gap-4 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded-full transition
                  ${
                    active
                      ? "bg-white text-black"
                      : "text-zinc-300 hover:bg-white/10"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
