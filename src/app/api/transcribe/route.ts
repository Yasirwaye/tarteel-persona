// src/app/api/transcribe/route.ts
export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY is not set in .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "No audio file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Forward to Groq's Whisper Large v3 endpoint
    const groqFormData = new FormData();
    groqFormData.append("file", audioFile, "recording.webm");
    groqFormData.append("model", "whisper-large-v3");
    groqFormData.append("language", "ar");
    groqFormData.append("response_format", "verbose_json");
    groqFormData.append("temperature", "0");

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqFormData,
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: `Groq API error (${groqResponse.status}): ${errorText.slice(
            0,
            300
          )}`,
        }),
        {
          status: groqResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await groqResponse.json();

    return new Response(
      JSON.stringify({
        text: data.text || "",
        duration: data.duration,
        language: data.language,
        segments: data.segments,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Transcribe error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Transcription failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Transcribe API is running",
      apiKeySet: !!process.env.GROQ_API_KEY,
      model: "whisper-large-v3",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}