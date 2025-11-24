import type { GeminiResponse } from "@/lib/geminiTypes";
// or wherever your types live

export async function askGemini(query: string): Promise<GeminiResponse> {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error("AI request failed: " + (text || res.statusText));
    }

    let data: any;

    // Try safe JSON read
    try {
      data = await res.json();
    } catch {
      return { type: "answer", text: "Couldn't read AI response." };
    }

    // Validate navigation response
    if (
      data &&
      typeof data === "object" &&
      data.type === "navigate" &&
      typeof data.route === "string"
    ) {
      return { type: "navigate", route: data.route };
    }

    // Validate answer response
    if (
      data &&
      typeof data === "object" &&
      data.type === "answer" &&
      typeof data.text === "string"
    ) {
      return { type: "answer", text: data.text };
    }

    // 🛡 Fallback — everything else becomes a normal answer
    return {
      type: "answer",
      text: typeof data === "string" ? data : JSON.stringify(data),
    };
  } catch (err: any) {
    console.error("askGemini error:", err);
    return {
      type: "answer",
      text: "AI is unavailable right now. Please try again.",
    };
  }
}
