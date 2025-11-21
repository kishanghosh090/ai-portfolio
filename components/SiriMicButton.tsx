"use client";

import { IoMicOutline } from "react-icons/io5";


export default function SiriMicButton({ listening, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300
        ${listening ? "scale-110" : "scale-100"}
      `}
    >
      {/* Background liquid wave */}
      <div
        className={`absolute inset-0 rounded-full overflow-hidden
          ${listening ? "animate-siri-wave" : ""}
        `}
      >
        <div className="absolute w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-70 blur-xl animate-siri-gradient"></div>
      </div>

      {/* Inner glowing circle */}
      <div
        className={`absolute inset-2 rounded-full 
          ${listening ? "bg-white/30 animate-siri-pulse" : "bg-white/10"}
        `}
      ></div>

      {/* Mic icon */}
      <div className={`relative z-10 text-2xl`}><IoMicOutline /></div>
      {/* <SiriLottieButton listening={listening} onClick={onClick} /> */}

      {/* Outer ring pulse */}
      {listening && (
        <span className="absolute inset-0 rounded-full border border-white/30 animate-siri-ring"></span>
      )}
    </button>
  );
}
