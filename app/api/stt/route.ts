import { NextResponse } from "next/server";

// This route requires the Node.js runtime (Buffer, Blob, FormData usage)
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const audio = form.get("audio") as any;
    if (!audio) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing API key" },
        { status: 500 }
      );
    }

    // Convert uploaded File to Buffer
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use direct fetch to OpenAI's transcription endpoint to avoid SDK stream issues
    const formData = new FormData();
    // Create a Blob from the buffer
    const blob = new Blob([buffer]);
    formData.append("file", blob, "audio.webm");
    formData.append("model", "whisper-1");

    const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData as any,
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      return NextResponse.json(
        { error: txt || resp.statusText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    // The Whisper response includes a `text` field with the transcript
    const text = data?.text ?? "";

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("/api/stt error", err);
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
