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

  const handleClick = async () => {
    if (typeof window === "undefined") return;

    // 1️⃣ Get correct SpeechRecognition engine (prefer standard name)
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    // Detect common unsupported environments (notably iOS Safari)
    const ua = navigator.userAgent || "";
    const isiOS = /iP(ad|hone|od)/i.test(ua);

    if (!SpeechRecognition) {
      if (isiOS) {
        alert(
          "Speech recognition is not supported on iOS browsers (Safari/Chrome on iOS). Try Chrome on Android or desktop Chrome/Edge."
        );
      } else if (!window.isSecureContext) {
        alert(
          "Speech recognition requires HTTPS. Please use a secure (HTTPS) site."
        );
      } else {
        alert("Voice input is not supported on this browser.");
      }
      return;
    }

    // Clear previous errors and 2️⃣ Request mic permission BEFORE recognition
    setErrorMsg(null);

    // Quick offline check — the browser-level speech service requires network/HTTPS
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setErrorMsg(
        "Offline: check your internet connection and click the mic to retry."
      );
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
      setErrorMsg(null);
    };

    recognition.onend = () => {
      console.log("❌ Mic stopped");
      setListening(false);
      recognitionRef.current = null;
    };

    // 4️⃣ Error handling
    recognition.onerror = (event: any) => {
      console.error("Speech Error:", event);

      const err = event?.error || "unknown";
      const message = event?.message || "";

      if (err === "not-allowed") {
        setErrorMsg(
          "Microphone access was blocked. Please allow mic permission in browser settings."
        );
      } else if (err === "network") {
        // Don't auto-retry; require user gesture. Show clear inline guidance instead.
        setErrorMsg(
          "Speech service unreachable — check your internet connection, disable VPN/proxy, or try another browser. Click the mic to retry."
        );
      } else {
        setErrorMsg(
          "Speech recognition error: " + err + (message ? " — " + message : "")
        );
      }

      setListening(false);
      recognitionRef.current = null;
    };

    // 5️⃣ Speech result handler
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);

        try {
        let aiRes = await askGemini(transcript);
        // console.log("Gemini response:", typeof(ai));
        // askGemini may return a parsed object or a JSON string depending on implementation,
        // so handle both cases safely.
        const ai = typeof aiRes === "string" ? JSON.parse(aiRes) : aiRes;


        // Safely handle navigate responses and textual responses using type guards
        if (ai && typeof ai === "object") {
          if (
            "type" in ai &&
            String((ai as any).type).toLowerCase() === "navigate" &&
            "route" in ai &&
            typeof (ai as any).route === "string"
          ) {
            const route = (ai as any).route.replace(/^\//, "");
            speakText("Opening " + route);
            router.push((ai as any).route);
          } else if ("text" in ai && typeof (ai as any).text === "string") {
            // Only access .text after checking it exists on the response
            speakText((ai as any).text);
            // alert((ai as any).text);
          } else {
            // Fallback for unexpected shapes
            const msg = typeof ai === "string" ? ai : JSON.stringify(ai);
            speakText(msg);
            // alert(msg);
          }
        } else {
          alert("Unexpected AI response.");
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
    <div>
      <SiriMicButton
        listening={listening}
        onClick={() => {
          // Start/stop recognition via the handler. Do NOT navigate away — navigation interrupts the mic.
          handleClick();
        }}
      />
      {listening && (<SiriFluid active={listening}/>)}

      {errorMsg ? (
        <div className="mt-2 text-sm text-red-600">
          <div>{errorMsg}</div>
          <div className="mt-1 flex gap-3">
            <button
              className="underline"
              onClick={() => {
                // Manual retry: this click is a user gesture so we can re-run recognition.
                setErrorMsg(null);
                try {
                  void handleClick();
                } catch (e) {
                  console.error("Retry failed:", e);
                }
              }}
            >
              Retry
            </button>

            <button
              className="underline"
              onClick={() => {
                setErrorMsg(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
