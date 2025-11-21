// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { askGemini } from "@/lib/gemini";

// import SiriMicButton from "./SiriMicButton";

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// export default function VoiceButton() {
//   const [listening, setListening] = useState(false);
//   const router = useRouter();

//   const handleClick = async () => {
//     if (typeof window === "undefined") return;

//     // 1️⃣ Check SpeechRecognition support
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported in this browser.");
//       return;
//     }

//     // 2️⃣ Ask for mic permission FIRST
//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//     } catch (err) {
//       alert(
//         "Microphone permission is blocked. Please allow it in browser settings."
//       );
//       return;
//     }

//     // 3️⃣ Now safe to start actual Speech Recognition
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     // When recognition starts
//     recognition.onstart = () => {
//       console.log("Mic started");
//       setListening(true);
//     };

//     // When recognition ends
//     recognition.onend = () => {
//       console.log("Mic stopped");
//       setListening(false);
//     };

//     // 4️⃣ Handle mic errors properly
//     recognition.onerror = (event: any) => {
//       console.error("SpeechRecognition ERROR:", event.error);

//       if (event.error === "not-allowed") {
//         alert(
//           "Microphone access denied. Enable mic permission in browser settings."
//         );
//       }

//       if (event.error === "network") {
//         alert(
//           "SpeechRecognition requires HTTPS. Use https://localhost with mkcert."
//         );
//       }

//       setListening(false);
//     };

//     // 5️⃣ Handle user speech
//     recognition.onresult = async (event: any) => {
//       const transcript = event.results[0][0].transcript;
//       console.log("User said:", transcript);

//       try {
//         const res = await askGemini(transcript);
//         console.log("Gemini:", res);

//         if (res.type === "navigate") {
//           speakText("Opening " + res.route.replace("/", ""));
//           router.push(res.route);
//         } else {
//           speakText(res.text); // AI SPEAKS ITS OWN REPLY
//           alert(res.text);
//         }
//       } catch (err) {
//         alert("AI error, try again.");
//       }
//     };

//     // 6️⃣ Start the mic
//     recognition.start();
//   };
//   function speakText(text: string) {
//     const speech = new SpeechSynthesisUtterance(text);
//     speech.lang = "en-IN";
//     speech.rate = 1; // speed
//     speech.pitch = 1; // tone level
//     speech.volume = 1; // loudness
//     window.speechSynthesis.speak(speech);
//   }

//   return (
//     <>
//       <SiriMicButton
//         listening={listening}
//         onClick={() => {
//           setTimeout(() => {
//             router.replace("/");
//           }, 300);
//           handleClick();
//         }}
//       />

//       {/* Glow animation */}
//       {/* <SiriBorder active={listening} /> */}
//       {/* <SiriFluid active={listening} /> */}
//     </>
//   );
// }
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

    // 3️⃣ Create recognition instance
    const recognition = new SpeechRecognition();
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

    // 6️⃣ Final: start recognition
    setTimeout(() => {
      recognition.start();
    }, 200);
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
        // 🟢 FIXED: Navigation AFTER mic start (no interruption)
        handleClick();

        setTimeout(() => {
          router.replace("/");
        }, 500);
      }}
    />
  );
}
