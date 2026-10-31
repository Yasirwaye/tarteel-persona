// src/lib/streamingRecognizer.ts
/**
 * The browser's own streaming speech recognizer (Web Speech API).
 *
 * In Chrome it streams to Google's recognizer and returns words ~0.2–0.4 s
 * after they are said — far faster than any per-window Whisper request can be.
 * We use it only to turn words green quickly; Whisper still judges mistakes.
 *
 * Not available everywhere (e.g. Android WebView): callers fall back to
 * Whisper alone when isSupported() is false.
 */

import { log } from "@/lib/logger";

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(track?: MediaStreamTrack): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechResultEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export class StreamingRecognizer {
  private rec: SpeechRecognitionLike | null = null;
  private running = false;
  private track: MediaStreamTrack | undefined;
  private doneText: string[] = []; // finalized text of earlier recognition sessions
  private sessionText = "";
  private restarts: number[] = [];

  constructor(
    private onText: (text: string) => void,
    private lang = "ar-SA"
  ) {}

  static isSupported(): boolean {
    return getCtor() !== null;
  }

  /** Listen to `track` when the browser supports it, else the default microphone. */
  start(track?: MediaStreamTrack): boolean {
    const Ctor = getCtor();
    if (!Ctor) return false;
    this.running = true;
    this.track = track;
    this.open(Ctor);
    return true;
  }

  stop(): void {
    this.running = false;
    try {
      this.rec?.abort();
    } catch {
      /* already stopped */
    }
    this.rec = null;
  }

  private open(Ctor: SpeechRecognitionCtor): void {
    const rec = new Ctor();
    rec.lang = this.lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += " " + e.results[i][0].transcript;
      this.sessionText = text.trim();
      const all = [...this.doneText, this.sessionText].filter(Boolean).join(" ");
      log("[fast-lane]", (performance.now() / 1000).toFixed(1), all.split(" ").slice(-6).join(" "));
      this.onText(all);
    };
    rec.onerror = (e) => {
      log("[fast-lane] error", e.error);
      // Permission/service problems are permanent; others end and restart
      if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "language-not-supported") {
        this.running = false;
      }
    };
    rec.onend = () => {
      log("[fast-lane] session ended at", (performance.now() / 1000).toFixed(1), this.running ? "→ restarting" : "");
      // Chrome ends sessions on long silence or network hiccups: keep listening
      if (this.sessionText) this.doneText.push(this.sessionText);
      this.sessionText = "";
      if (!this.running) return;
      const now = Date.now();
      this.restarts = this.restarts.filter((t) => now - t < 60_000);
      if (this.restarts.length >= 20) {
        this.running = false; // something is wrong; Whisper keeps working alone
        return;
      }
      this.restarts.push(now);
      setTimeout(() => this.running && this.open(Ctor), 100);
    };
    this.rec = rec;
    try {
      if (this.track) rec.start(this.track);
      else rec.start();
    } catch {
      // Older browsers: start() takes no track — listen to the default microphone
      try {
        this.track = undefined;
        rec.start();
      } catch {
        this.running = false;
      }
    }
  }
}
