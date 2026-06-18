// src/app/api/transcribe-stream/route.ts
import { withCors, corsPreflight } from "@/lib/cors";
export const maxDuration = 30;
export const runtime = "nodejs";

/**
 * Receives audio chunks and returns transcription quickly.
 * Used during live recitation — called repeatedly with growing audio.
 */
export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY is not set" }),
        { status: 500, headers: withCors({ "Content-Type": "application/json" }) }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "No audio file" }),
        { status: 400, headers: withCors({ "Content-Type": "application/json" }) }
      );
    }

    const groqFormData = new FormData();
    groqFormData.append("file", audioFile, "chunk.webm");
    // whisper-large-v3-turbo is much faster for live use
    groqFormData.append("model", "whisper-large-v3-turbo");
    groqFormData.append("language", "ar");
    groqFormData.append("response_format", "verbose_json");
    // temperature 0 causes Whisper to hallucinate/repeat when audio is short/silent
    // 0.2 gives more honest "I only heard X words" behaviour
    groqFormData.append("temperature", "0.2");
    // Prompt primes Whisper to expect Quranic Arabic — reduces hallucination
    // and stops it from inventing words the user never said
    groqFormData.append(
      "prompt",
      "بسم الله الرحمن الرحيم"
    );

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
      return new Response(
        JSON.stringify({
          error: `Groq error (${groqResponse.status}): ${errorText.slice(0, 200)}`,
        }),
        {
          status: groqResponse.status,
          headers: withCors({ "Content-Type": "application/json" }),
        }
      );
    }

    const data = await groqResponse.json();

    // verbose_json gives us segments with no_speech_prob
    // If Whisper itself thinks there was no speech, return empty
    // This prevents hallucinated text from corrupting the score
    let finalText = data.text || "";

    if (data.segments && Array.isArray(data.segments)) {
      const allSilent = data.segments.every(
        (seg: { no_speech_prob?: number }) => (seg.no_speech_prob ?? 0) > 0.6
      );
      if (allSilent) {
        finalText = "";
      }
    }

    return new Response(
      JSON.stringify({ text: finalText }),
      { status: 200, headers: withCors({ "Content-Type": "application/json" }) }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed",
      }),
      { status: 500, headers: withCors({ "Content-Type": "application/json" }) }
    );
  }
}

export async function OPTIONS() {
  return corsPreflight();
}
