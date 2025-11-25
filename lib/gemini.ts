import type { GeminiResponse } from "@/lib/geminiTypes";
import axios from "axios";
// or wherever your types live

export async function askGemini(query: string): Promise<GeminiResponse | undefined > {
  try {
    const response = await axios.post("/api/ask", { query });
    console.log(response.data);
    // axios already parses JSON; response.data is typically the parsed object
    const data: GeminiResponse = typeof response.data === "string"
      ? JSON.parse(response.data)
      : response.data;
    return data;
  } catch (e) {
    return undefined;
  }
}
