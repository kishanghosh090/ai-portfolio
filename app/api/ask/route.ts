import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing API key (set GEMINI_API_KEY)" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: "AIzaSyA_IkCzCYEj3-8YkcITFy18fmA5kVJqbx4",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    // Use the chat completions endpoint. The exact options may vary by package
    // version; this mirrors previous code used in the project.
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    });

    const choice = response.choices?.[0];
    let parsed: any = choice?.message?.content;
    console.log(parsed);
    

    // if (!parsed) {
    //   const raw = String(choice?.message?.content ?? "");
    //   try {
    //     parsed = JSON.parse(raw);
    //   } catch (e) {
    //     parsed = { type: "answer", text: raw };
    //   }
    // }

    // // Basic validation/shape enforcement
    // if (parsed?.type === "navigate" && typeof parsed.route === "string") {
    //   return NextResponse.json({ type: "navigate", route: parsed.route });
    // }

    // if (parsed?.type === "answer" && typeof parsed.text === "string") {
    //   return NextResponse.json({ type: "answer", text: parsed.text });
    // }

    // fallback
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("/api/ask error", err);
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
