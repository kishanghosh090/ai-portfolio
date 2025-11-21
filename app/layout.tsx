import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

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
      <body className="bg-[#050509] text-zinc-100">
        <div className="min-h-screen flex flex-col">
          {/* <Navbar /> */}
          <main className="flex-1">{children}</main>
           <BottomNav />
          <Footer />
        </div>
      </body>
    </html>
  );
}
