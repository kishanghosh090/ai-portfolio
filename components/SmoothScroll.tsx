"use client";

import Scrollbar from "smooth-scrollbar";
import OverscrollPlugin from "smooth-scrollbar/plugins/overscroll";
import { useEffect } from "react";

export default function MobileSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    Scrollbar.use(OverscrollPlugin);

    const container = document.querySelector("#scroll-container");

    const scrollbar = Scrollbar.init(container as HTMLElement, {
      damping: 0.08,
      continuousScrolling: true,
      plugins: {
        overscroll: { effect: "glow", damping: 0.15 },
      },
    });

    return () => scrollbar.destroy();
  }, []);

  return null;
}
