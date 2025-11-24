"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SiriMicButton from "./SiriMicButton";
import SiriFluid from "./SiriFluid";
import { askGemini } from "@/lib/gemini";
// @ts-ignore: No TypeScript types are available for 'opus-media-recorder'
import OpusMediaRecorder from "opus-media-recorder";

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
  



async function startRecordingFallback() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const options = {
      mimeType: "audio/ogg",
      audioBitsPerSecond: 48000,
      wasmPath: "/opus/opus-media-recorder.wasm",
      encoderPath: "/opus/worker.js",
    };

    const recorder = new OpusMediaRecorder(stream, options);

    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e: { data: BlobPart; }) => chunks.push(e.data);

    recorder.start();
    setListening(true);

    await new Promise((res) => setTimeout(res, 4000));
    recorder.stop();

    await new Promise((res) => (recorder.onstop = res));
    setListening(false);

    const blob = new Blob(chunks, { type: "audio/ogg" });

    const form = new FormData();
    form.append("audio", blob, "voice.ogg");

    const res = await fetch("/api/stt", { method: "POST", body: form });
    const json = await res.json();

    if (!json?.text) {
      setError("No speech detected.");
      return;
    }

    handleTranscript(json.text);
  } catch (e) {
    console.error("Android recorder error:", e);
    setError("Recording failed.");
  }
}

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
