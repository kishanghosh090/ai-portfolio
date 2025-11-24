import { SYSTEM_PROMPT } from "./systemPrompt";

export type GeminiResponse =
  | { type: "navigate"; route: string }
  | { type: "answer"; text: string };

// Client-safe askGemini: calls the server API route which holds the secret key.
// This file no longer creates any API client at module import time so it is
// safe to import from client components.
export async function askGemini(query: string): Promise<GeminiResponse> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("AI request failed: " + (text || res.statusText));
  }

  const data = (await res.json()) as GeminiResponse;
  return data;
}
