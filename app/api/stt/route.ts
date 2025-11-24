import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // REQUIRED for audio parsing

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("audio") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file received" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    // Use the incoming File directly; OpenAI client accepts a File/Blob/stream
    const uploadable = file as any;

    // Whisper transcription
    // Whisper transcription
    const result = await client.audio.transcriptions.create({
      file: uploadable,
      model: "whisper-1", // WHISPER STT MODEL
      response_format: "json",
    });
    const text = result.text || "";

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("/api/stt error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
