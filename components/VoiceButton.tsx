"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { askGemini } from "@/lib/gemini";
import SiriMicButton from "./SiriMicButton";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceButton() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  const handleClick = async () => {
    if (typeof window === "undefined") return;

    // 1️⃣ Get correct SpeechRecognition engine
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported on this browser.");
      return;
    }

    // 2️⃣ Request mic permission BEFORE recognition
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert("Microphone is blocked. Please allow mic permission.");
      return;
    }

    // 3️⃣ Create recognition instance (reuse if already present)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("🎤 Mic started");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("❌ Mic stopped");
      setListening(false);
      recognitionRef.current = null;
    };

    // 4️⃣ Error handling
    recognition.onerror = (event: any) => {
      console.error("Speech Error:", event.error);

      if (event.error === "not-allowed") {
        alert("Please allow microphone access in browser settings.");
      }

      if (event.error === "network") {
        alert("SpeechRecognition requires HTTPS (Vercel is fine).");
      }

      setListening(false);
    };

    // 5️⃣ Speech result handler
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);

      try {
        const ai = await askGemini(transcript);
        console.log("Gemini response:", ai);

        if (ai.type === "navigate") {
          speakText("Opening " + ai.route.replace("/", ""));
          router.push(ai.route);
        } else {
          speakText(ai.text);
          alert(ai.text);
        }
      } catch (err) {
        console.error(err);
        alert("AI error — try again.");
      }
    };

    // 6️⃣ Final: start recognition (start immediately to retain user gesture)
    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      alert(
        "Could not start speech recognition. Try reloading the page or using a different browser."
      );
      setListening(false);
      recognitionRef.current = null;
    }
  };

  // 🔊 Speech output function
  function speakText(text: string) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  }

  return (
    <SiriMicButton
      listening={listening}
      onClick={() => {
        // Start/stop recognition via the handler. Do NOT navigate away — navigation interrupts the mic.
        handleClick();
      }}
    />
  );
}
