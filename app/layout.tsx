import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import SmoothScroll from "@/components/SmoothScroll";
import SiriFluid from "@/components/SiriFluid";



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
        <SmoothScroll />
        <div className="min-h-screen flex flex-col overflow-x-hidden ">
          <TopNav />
          <SiriFluid active={true} />
          <main className="flex-1">{children}</main>
          <BottomNav />
          <Footer />
        </div>
      </body>
    </html>
  );
}
