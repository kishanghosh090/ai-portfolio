"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SiriMicButton from "./SiriMicButton";
import SiriFluid from "./SiriFluid";
import { askGemini } from "@/lib/gemini";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function VoiceButton() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  // Detect mobile browsers where Web Speech API is BLOCKED
  const isMobile = /Android|iPhone|iPad|iPod/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  );

  // -------------------------------
  // 🔊 Text-to-Speech
  // -------------------------------
  function speak(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 1;
    utter.pitch = 1;
    speechSynthesis.speak(utter);
  }

  // -------------------------------
  // 🎤 DESKTOP SpeechRecognition
  // -------------------------------
  const startWebSpeech = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    // Ask for mic permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone permission denied.");
      return;
    }

    // Clear old instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;

    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onstart = () => setListening(true);
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setError("Speech recognition error: " + e.error);
      setListening(false);
    };

    rec.onresult = async (e: any) => {
      const text = e.results[0][0].transcript;
      handleTranscript(text);
    };

    try {
      rec.start();
    } catch {}
  };

  // -------------------------------
  // 📱 MOBILE fallback recording
  // -------------------------------
  // Mobile fallback recorder (fixed)
  const startRecordingFallback = async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/mp4", // 🔥 FIX 1 — works on Android/iOS
      });

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.start(200); // 🔥 FIX 2 — give browser time

      setListening(true);

      // Record 4 seconds
      await new Promise((res) => setTimeout(res, 4000));
      recorder.stop();

      await new Promise((res) => (recorder.onstop = res));
      setListening(false);

      const blob = new Blob(chunks, { type: "audio/mp4" }); // 🔥 FIX 3

      const formData = new FormData();
      formData.append("audio", blob, "voice.mp4");

      const res = await fetch("/api/ask", { method: "POST", body: formData });

      const json = await res.json();

      if (!json?.text || json.text.trim() === "") {
        setError("No speech detected — try again.");
        return;
      }

      handleTranscript(json.text);
    } catch (err) {
      console.error(err);
      setError("Recording failed: " + (err as any).message);
      setListening(false);
    }
  };

  // -------------------------------
  // 🤖 Send voice text to Gemini
  // -------------------------------
  const handleTranscript = async (text: string) => {
    try {
      const raw = await askGemini(text);
      const ai = typeof raw === "string" ? JSON.parse(raw) : raw;

      if (ai.type === "navigate") {
        speak("Opening " + ai.route.replace("/", ""));
        router.push(ai.route);
      } else if (ai.text) {
        speak(ai.text);
      } else {
        speak("I did not understand that.");
      }
    } catch (err) {
      console.error(err);
      setError("AI error, please try again.");
    }
  };

  // -------------------------------
  // 🎤 Main click handler
  // -------------------------------
  const handleClick = () => {
    setError(null);

    if (isMobile) {
      // Mobile → backend STT fallback
      startRecordingFallback();
      return;
    }

    // Desktop → native speech API
    startWebSpeech();
  };

  return (
    <div className="relative">
      <SiriMicButton listening={listening} onClick={handleClick} />

      {listening && <SiriFluid active={true} />}

      {error && (
        <div className="mt-3 text-red-400 text-sm">
          {error}
          <button className="ml-3 underline" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
