"use client";

import { useState, useRef, useEffect } from "react";
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
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [isAndroid, setIsAndroid] = useState(false);

  //on android

  // Detect Android
  useEffect(() => {
    // Detect Android
    setIsAndroid(/Android/i.test(navigator.userAgent));

    // Detect speech support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    setIsListening(true);

    let finalText = ""; // <--- FIX: local variable

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      finalText = transcript; // <--- FIX HERE
      console.log("Android transcript:", finalText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      alert("Error: " + event.error);
    };

    recognition.onend = async () => {
      setIsListening(false);

      if (!finalText.trim()) {
        // <--- FIX
        setErrorMsg("No speech detected.");
        return;
      }

      try {
        const ai = await askGemini(finalText);

        if (!ai) return;

        if (ai.type === "navigate") {
          speak(`opening ${ai.route.replace("/", "")}`);
          router.push(ai.route);
        } else {
          speak(ai.text);
        }
      } catch (e) {
        console.log("AI Error:", e);
        alert("AI error. Try again.");
      }
    };
  };

  /// desktop
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
    recognition.continuous = true; // ANDROID-FRIENDLY
    recognition.interimResults = true; // ANDROID-FRIENDLY

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
        console.log(text);

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
        if (ai == undefined) return;

        if (ai["type"] === "navigate") {
          speak(`opening ${ai["route"].replace("/", "")}`);
          router.push(ai["route"]);
        } else {
          speak(`${ai["text"]}`);

          // alert(ai["text"]);
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
  function speak(text: string) {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.pitch = 1;
    utter.rate = 1;
    utter.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
    if (englishVoices.length > 0) {
      utter.voice = englishVoices[0];
    }

    window.speechSynthesis.speak(utter);
  }

  return (
    <div>
      <SiriMicButton
        listening={listening || isListening}
        onClick={() => {
          setErrorMsg(null);

          if (isAndroid) {
            startListening();
          } else {
            console.log("lapotp");

            startSpeech();
          }
        }}
      />

      {listening && <SiriFluid active={listening} />}

      {errorMsg && <div className="text-red-500 mt-2 text-sm">{errorMsg}</div>}
    </div>
  );
}
