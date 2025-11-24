"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { askGemini } from "@/lib/gemini";
import SiriMicButton from "./SiriMicButton";
import SiriFluid from "./SiriFluid";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceButton() {
  const [listening, setListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  const startSpeech = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    // Mic permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Please allow microphone permission.");
      return;
    }

    // Clear previous instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-IN";
    recognition.continuous = true;          // ANDROID-FRIENDLY
    recognition.interimResults = true;      // ANDROID-FRIENDLY

    let finalTranscript = "";

    recognition.onstart = () => {
      setListening(true);
      setErrorMsg(null);
    };

    recognition.onerror = (e: any) => {
      console.log("SR error:", e);

      if (e.error === "no-speech") {
        setErrorMsg("No speech detected. Try again.");
      } else if (e.error === "not-allowed") {
        setErrorMsg("Speech permission blocked.");
      } else if (e.error === "network") {
        setErrorMsg("Speech service unreachable. Try again.");
      } else {
        setErrorMsg("Speech error: " + e.error);
      }

      setListening(false);
    };

    recognition.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript + " ";
      }
      finalTranscript = text.trim();
    };

    recognition.onend = async () => {
      setListening(false);

      if (!finalTranscript) {
        setErrorMsg("No speech detected.");
        return;
      }

      // SEND TO GEMINI
      try {
        const ai = await askGemini(finalTranscript);

        if (ai.type === "navigate") {
          router.push(ai.route);
        } else {
          alert(ai.text);
        }
      } catch {
        alert("AI error. Try again.");
      }
    };

    recognition.start();

    // 🔥 Android fix: force-stop after 5 seconds
    setTimeout(() => {
      try {
        recognition.stop();
      } catch {}
    }, 5000);
  };

  return (
    <div>
      <SiriMicButton
        listening={listening}
        onClick={() => {
          setErrorMsg(null);
          startSpeech();
        }}
      />

      {listening && <SiriFluid active={listening} />}

      {errorMsg && (
        <div className="text-red-500 mt-2 text-sm">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
