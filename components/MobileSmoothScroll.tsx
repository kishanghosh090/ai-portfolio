"use client";

import Scrollbar from "smooth-scrollbar";
import { useEffect } from "react";

export default function MobileSmoothScroll() {
  useEffect(() => {
    const scrollbar = Scrollbar.init(document.body, {
      damping: 0.08,       // smoothness
      alwaysShowTracks: false,
      continuousScrolling: true,
    });

    return () => {
      scrollbar.destroy();
    };
  }, []);

  return null;
}
