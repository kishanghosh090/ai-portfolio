import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Kishan Rana Ghosh | Portfolio",
  description: "Full-stack, mobile, and AI-focused developer portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#050509] text-zinc-100 overflow-x-hidden">
        <div className="min-h-screen flex flex-col">
          {/* <Navbar /> */}
          <TopNav />
          {/* <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.35),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),transparent_55%)] opacity-80" /> */}
          <main className="flex-1">{children}</main>
          <BottomNav />
          <Footer />
        </div>
      </body>
    </html>
  );
}
