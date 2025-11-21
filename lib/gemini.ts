import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./systemPrompt";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.warn("⚠️ NEXT_PUBLIC_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export type GeminiResponse =
  | { type: "navigate"; route: string }
  | { type: "answer"; text: string };

export async function askGemini(query: string): Promise<GeminiResponse> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: query },
  ]);

  const raw = result.response.text().trim();

  // Try to parse JSON
  try {
    const parsed = JSON.parse(raw);
    if (parsed.type === "navigate" && typeof parsed.route === "string") {
      return { type: "navigate", route: parsed.route };
    }
    if (parsed.type === "answer" && typeof parsed.text === "string") {
      return { type: "answer", text: parsed.text };
    }
  } catch (e) {
    // ignore and fall through
  }

  // Fallback: treat everything as plain text answer
  return {
    type: "answer",
    text: raw,
  };
}
