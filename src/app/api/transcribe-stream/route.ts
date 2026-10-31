// src/app/api/transcribe-stream/route.ts
import { withCors, corsPreflight } from "@/lib/cors";
export const maxDuration = 30;
export const runtime = "nodejs";

/**
 * Transcribes one audio window for live recitation (and voice search).
 *
 * Form fields:
 *   audio   – WAV, 8-bit µ-law (live recitation) or WebM (voice search)
 *   quality – "fast" (default, whisper-large-v3-turbo) or "accurate"
 *             (whisper-large-v3); each has its own Groq rate limit
 *   final   – "1" when this window is a finished segment (deterministic decoding)
 *   prompt  – optional priming text (avoid for recitation, see DEFAULT_PROMPT)
 */

const MODELS = {
  fast: "whisper-large-v3-turbo",
  accurate: "whisper-large-v3",
} as const;

// Requests/minute Groq allows PER MODEL (free tier: 20). The client paces itself
// with this, so set GROQ_RPM_PER_MODEL after upgrading the Groq plan.
const RPM_PER_MODEL = Number(process.env.GROQ_RPM_PER_MODEL) || 20;

// No prompt by default. Tested on real recitation: with "بسم الله الرحمن الرحيم"
// Whisper silently DROPS a recited Bismillah, and with ANY prompt (even
// "القرآن الكريم") whisper-large-v3 sometimes answers clear recitation with
// subtitle hallucinations ("ترجمة نانسي قنقر"). Without one it transcribes them.
const DEFAULT_PROMPT = "";

// Phrases Whisper invents on silence/noise in Arabic (YouTube subtitle residue)
const HALLUCINATIONS = [
  "اشتركوا في القناة",
  "اشترك في القناة",
  "لا تنسوا الاشتراك",
  "ترجمة", // subtitle credits ("ترجمة نانسي قنقر" ...) — not a Quran word
  "نانسي",
  "شكرا للمشاهدة",
  "شكراً للمشاهدة",
  "شكرا على المشاهدة",
  "شكراً على المشاهدة",
  "المترجم للقناة",
  "موسيقى",
];

// Whole-segment hallucinations (only dropped when they are the ENTIRE segment:
// "شكرا" alone is noise, but شُكْرًا is also a Quran word inside a verse)
const HALLUCINATION_SEGMENTS = new Set([
  "شكرا",
  "شكراً",
  "شكرا لكم",
  "شكراً لكم",
  "شكرا جزيلا",
  "شكراً جزيلاً",
  // Video sign-offs; the Quran's رحمت الله وبركاته (11:73) never stands alone like this
  "ورحمة الله وبركاته",
  "السلام عليكم ورحمة الله وبركاته",
  "والسلام عليكم ورحمة الله وبركاته",
]);

interface Segment {
  text?: string;
  no_speech_prob?: number;
  avg_logprob?: number;
  compression_ratio?: number;
}

/** Why a segment should be dropped, or null to keep it. */
function dropReason(seg: Segment): string | null {
  const text = (seg.text || "").trim();
  if (!text) return "empty";
  // Whisper's own no-speech rule (no_speech > 0.6 AND avg_logprob < -1). Melodic
  // recitation often gets a high no_speech_prob, so confidence must be low too.
  if ((seg.no_speech_prob ?? 0) > 0.6 && (seg.avg_logprob ?? 0) < -1) return "no-speech";
  // Repetition loops ("الله الله الله ...") compress extremely well
  if ((seg.compression_ratio ?? 0) > 2.6) return "repetition";
  if (HALLUCINATIONS.some((h) => text.includes(h))) return "hallucination";
  if (HALLUCINATION_SEGMENTS.has(text.replace(/[.,!؟،]/g, "").trim())) return "hallucination";
  return null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: withCors({ "Content-Type": "application/json" }),
  });
}

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return json({ error: "GROQ_API_KEY is not set" }, 500);
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    if (!audioFile) return json({ error: "No audio file" }, 400);

    const quality = formData.get("quality") === "accurate" ? "accurate" : "fast";
    const rawPrompt = String(formData.get("prompt") || "").trim();
    // Groq caps prompts at 224 tokens; the last few words are all Whisper needs
    const prompt = rawPrompt
      ? rawPrompt.split(/\s+/).slice(-30).join(" ")
      : DEFAULT_PROMPT;

    const isWav = (audioFile.type || "").includes("wav") || audioFile.name?.endsWith(".wav");
    const groqFormData = new FormData();
    groqFormData.append("file", audioFile, isWav ? "chunk.wav" : "chunk.webm");
    groqFormData.append("model", MODELS[quality]);
    groqFormData.append("language", "ar");
    groqFormData.append("response_format", "verbose_json");
    // Finalized segments: temperature 0 so the same audio always gives the same
    // verdict (silence never reaches here; loops are dropped by compression_ratio).
    // Live previews keep 0.2, which loops less on very short windows.
    const isFinal = formData.get("final") === "1";
    groqFormData.append("temperature", isFinal ? "0" : "0.2");
    if (prompt) groqFormData.append("prompt", prompt);

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: groqFormData,
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      const retryAfter = Number(groqResponse.headers.get("retry-after")) || undefined;
      return json(
        {
          error: `Groq error (${groqResponse.status}): ${errorText.slice(0, 200)}`,
          retryAfter,
        },
        groqResponse.status
      );
    }

    const data = await groqResponse.json();

    let finalText: string = data.text || "";
    // Whisper answered speech with invented text (subtitle credits, loops):
    // tell the client, which retries the window on the other model.
    let hallucinated = false;

    if (Array.isArray(data.segments) && data.segments.length > 0) {
      const kept: string[] = [];
      for (const seg of data.segments as Segment[]) {
        const why = dropReason(seg);
        if (!why) kept.push((seg.text || "").trim());
        else {
          if (why === "hallucination" || why === "repetition") hallucinated = true;
          if (process.env.NODE_ENV === "development" && why !== "empty") {
            console.log(`[transcribe] ${MODELS[quality]} dropped (${why}) ns=${seg.no_speech_prob?.toFixed(2)} lp=${seg.avg_logprob?.toFixed(2)} cr=${seg.compression_ratio?.toFixed(2)}: ${seg.text}`);
          }
        }
      }
      finalText = kept.join(" ");
    } else if (HALLUCINATIONS.some((h) => finalText.includes(h))) {
      finalText = "";
      hallucinated = true;
    }

    return json({
      text: finalText.trim(),
      hallucinated: hallucinated && !finalText.trim(),
      model: MODELS[quality],
      rpm: RPM_PER_MODEL,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Failed" },
      500
    );
  }
}

export async function OPTIONS() {
  return corsPreflight();
}
