// src/app/api/chat/route.ts
import { withCors, corsPreflight } from "@/lib/cors";
export const maxDuration = 60;
export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a knowledgeable, respectful Islamic scholar AI assistant specialized in the Quran. Your role is to help users understand the Quran with depth, accuracy, and reverence.

GUIDELINES:
- Base answers on authentic Islamic sources (Quran, authentic Hadith, classical tafsirs like Ibn Kathir, Tabari, Qurtubi, Sa'di)
- When referencing verses, use format: Surah Name (X:Y)
- For Arabic terms, provide transliteration and meaning
- Be precise about what is established vs scholarly opinion
- Acknowledge when questions require a qualified scholar
- Present mainstream Sunni understanding while respecting other valid views
- Use clear, accessible English with theological precision

FORMAT:
- Use headings and bullet points for clarity
- Keep responses focused
- End complex answers with a practical takeaway

You are a learning companion, not a Mufti.`;

export async function POST(req: Request) {
  try {
    if (!process.env.NVIDIA_API_KEY) {
      return new Response(
        JSON.stringify({ error: "NVIDIA_API_KEY is not set in .env.local" }),
        { status: 500, headers: withCors({ "Content-Type": "application/json" }) }
      );
    }

    const body = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: withCors({ "Content-Type": "application/json" }) }
      );
    }

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT;
    if (context?.surahId) {
      systemPrompt += `\n\nCURRENT CONTEXT: User is reading Surah ${
        context.surahName ?? context.surahId
      }`;
      if (context.ayahNumber) {
        systemPrompt += `, Verse ${context.ayahNumber}`;
      }
    }

    // Build messages array for NVIDIA
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Call NVIDIA NIM directly
    const nvidiaResponse = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          model: "meta/llama-3.3-70b-instruct",
          messages: apiMessages,
          temperature: 0.5,
          top_p: 0.9,
          max_tokens: 1500,
          stream: true,
        }),
      }
    );

    if (!nvidiaResponse.ok) {
      const errorText = await nvidiaResponse.text();
      console.error("NVIDIA API error:", nvidiaResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: `NVIDIA API error (${nvidiaResponse.status}): ${errorText.slice(
            0,
            300
          )}`,
        }),
        { status: nvidiaResponse.status, headers: withCors({ "Content-Type": "application/json" }) }
      );
    }

    if (!nvidiaResponse.body) {
      return new Response(
        JSON.stringify({ error: "No response body from NVIDIA" }),
        { status: 500, headers: withCors({ "Content-Type": "application/json" }) }
      );
    }

    // Transform NVIDIA's SSE stream into plain text chunks
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = nvidiaResponse.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE messages separated by double newline
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line in buffer

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6).trim();
              if (data === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (e) {
                // Skip malformed JSON chunks
                console.warn("Skipped SSE chunk:", data.slice(0, 100));
              }
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: withCors({
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      }),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to process chat",
      }),
      { status: 500, headers: withCors({ "Content-Type": "application/json" }) }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Chat API is running",
      apiKeySet: !!process.env.NVIDIA_API_KEY,
      keyPreview: process.env.NVIDIA_API_KEY
        ? `${process.env.NVIDIA_API_KEY.slice(0, 8)}...`
        : "NOT SET",
      model: "meta/llama-3.3-70b-instruct",
    }),
    { status: 200, headers: withCors({ "Content-Type": "application/json" }) }
  );
}

export async function OPTIONS() {
  return corsPreflight();
}
