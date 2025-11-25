import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log(query);

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Google Gemini API key (set GOOGLE_API_KEY)" },
        { status: 500 }
      );
    }
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: ` ${query}`,
        },
      ],
    });

    console.log(response.choices[0].message.content);
    const responseText = response.choices[0].message.content;

    try {
      return NextResponse.json(responseText);
    } catch (e) {
      return NextResponse.json({
        type: "answer",
        text: responseText,
      });
    }
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: String((err as any)?.message ?? "Unknown error") },
      { status: 500 }
    );
  }
}
