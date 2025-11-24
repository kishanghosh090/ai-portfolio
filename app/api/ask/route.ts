import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    });

    const raw = response.choices?.[0]?.message?.content ?? "";

    let parsed: any;

    // 🛠 SAFE JSON PARSE
    try {
      parsed = JSON.parse(raw);
    } catch {
      // If Gemini fails, fallback to basic response
      parsed = { type: "answer", text: raw };
    }

    // 🛡 validate structure
    if (parsed?.type === "navigate" && typeof parsed.route === "string") {
      return NextResponse.json({
        type: "navigate",
        route: parsed.route,
      });
    }

    if (parsed?.type === "answer" && typeof parsed.text === "string") {
      return NextResponse.json({
        type: "answer",
        text: parsed.text,
      });
    }

    // fallback generic text
    return NextResponse.json({
      type: "answer",
      text: typeof raw === "string" ? raw : JSON.stringify(raw),
    });
  } catch (err: any) {
    console.error("/api/ask error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
