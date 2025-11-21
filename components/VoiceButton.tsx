"use client";

import { useState } from "react";
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
  const router = useRouter();

  const handleClick = async () => {
    if (typeof window === "undefined") return;

    // 1️⃣ Check SpeechRecognition support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    // 2️⃣ Ask for mic permission FIRST
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert(
        "Microphone permission is blocked. Please allow it in browser settings."
      );
      return;
    }

    // 3️⃣ Now safe to start actual Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // When recognition starts
    recognition.onstart = () => {
      console.log("Mic started");
      setListening(true);
    };

    // When recognition ends
    recognition.onend = () => {
      console.log("Mic stopped");
      setListening(false);
    };

    // 4️⃣ Handle mic errors properly
    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition ERROR:", event.error);

      if (event.error === "not-allowed") {
        alert(
          "Microphone access denied. Enable mic permission in browser settings."
        );
      }

      if (event.error === "network") {
        alert(
          "SpeechRecognition requires HTTPS. Use https://localhost with mkcert."
        );
      }

      setListening(false);
    };

    // 5️⃣ Handle user speech
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);

      try {
        const res = await askGemini(transcript);
        console.log("Gemini:", res);

        if (res.type === "navigate") {
          speakText("Opening " + res.route.replace("/", ""));
          router.push(res.route);
        } else {
          speakText(res.text); // AI SPEAKS ITS OWN REPLY
          alert(res.text);
        }
      } catch (err) {
        alert("AI error, try again.");
      }
    };

    // 6️⃣ Start the mic
    recognition.start();
  };
  function speakText(text: string) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1; // speed
    speech.pitch = 1; // tone level
    speech.volume = 1; // loudness
    window.speechSynthesis.speak(speech);
  }

  return (
    <>
      <SiriMicButton
        listening={listening}
        onClick={() => {
          setTimeout(() => {
            router.replace("/");
          }, 300);
          handleClick();
        }}
      />

      {/* Glow animation */}
      {/* <SiriBorder active={listening} /> */}
      {/* <SiriFluid active={listening} /> */}
    </>
  );
}
