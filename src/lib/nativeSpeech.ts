// src/lib/nativeSpeech.ts
/**
 * Fast lane in the installed apps: the phone's own streaming speech recognizer
 * (Android SpeechRecognizer / iOS SFSpeechRecognizer, Arabic) through
 * @capacitor-community/speech-recognition. The web view has no Web Speech API,
 * so without this the apps marked words with Whisper alone (1–3 s behind).
 * Like StreamingRecognizer, it only turns words green quickly; Whisper still
 * judges mistakes.
 */

import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import type { PluginListenerHandle } from "@capacitor/core";
import { isNative } from "@/lib/platform";
import { log, warn } from "@/lib/logger";

export class NativeSpeechRecognizer {
  private running = false;
  /** Text of earlier listening sessions (the recognizer stops at pauses and is restarted) */
  private doneText: string[] = [];
  private sessionText = "";
  private handles: PluginListenerHandle[] = [];
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private watchdog: ReturnType<typeof setInterval> | null = null;
  /** When the current start() was issued (a start in progress is not interrupted) */
  private startedAt = 0;
  /**
   * Whether the recognizer is really listening, from its own events. (The
   * plugin's isListening() is a flag it does not reset after errors.)
   */
  private active = false;
  /** Last words from the recognizer: a "listening" session silent this long is stuck */
  private lastWordsAt = 0;

  constructor(
    private onText: (text: string) => void,
    private language = "ar-SA"
  ) {}

  /** In the native app, with a recognizer available and permission granted (asks once) */
  static async prepare(): Promise<boolean> {
    if (!isNative()) return false;
    try {
      const { available } = await SpeechRecognition.available();
      if (!available) return false;
      let perm = await SpeechRecognition.checkPermissions();
      if (perm.speechRecognition !== "granted") perm = await SpeechRecognition.requestPermissions();
      return perm.speechRecognition === "granted";
    } catch (err) {
      warn("[native-lane] unavailable:", err);
      return false;
    }
  }

  /** Restarts so far (also inspectable on device as window.__nativeLane, for debugging) */
  restarts = 0;

  async start(): Promise<void> {
    this.running = true;
    (window as unknown as { __nativeLane?: NativeSpeechRecognizer }).__nativeLane = this;
    this.handles.push(
      await SpeechRecognition.addListener("partialResults", ({ matches }) => {
        this.active = true;
        this.lastWordsAt = Date.now();
        this.sessionText = (matches?.[0] ?? "").trim();
        const all = [...this.doneText, this.sessionText].filter(Boolean).join(" ");
        log("[native-lane]", all.split(" ").slice(-6).join(" "));
        this.onText(all);
      }),
      await SpeechRecognition.addListener("listeningState", ({ status }) => {
        this.active = status === "started";
        // Phone recognizers stop at a pause: keep what was heard and listen again
        if (status === "stopped" && this.running) {
          if (this.sessionText) this.doneText.push(this.sessionText);
          this.sessionText = "";
          this.scheduleRestart();
        }
      })
    );
    await this.listen();
    // Phone recognizers end on silence or errors (Android "No match", "Client
    // side error") without always reporting it: check every second and start
    // listening again whenever it has stopped
    this.watchdog = setInterval(async () => {
      const now = Date.now();
      const stopped = !this.active && now - this.startedAt > 2500;
      // Android sometimes reports "started" and then never ends a silent session
      const stuck = now - this.startedAt > 8000 && now - this.lastWordsAt > 8000;
      if (!this.running || !(stopped || stuck)) return;
      this.active = false;
      if (this.sessionText) this.doneText.push(this.sessionText);
      this.sessionText = "";
      this.startedAt = Date.now(); // no second restart while this one runs
      // stop() never answers for a session that died silently: wait at most 0.5 s
      await Promise.race([SpeechRecognition.stop().catch(() => {}), new Promise((r) => setTimeout(r, 500))]);
      await new Promise((r) => setTimeout(r, 300)); // let Android release the recognizer
      void this.listen();
    }, 1000);
  }

  private async listen() {
    if (!this.running) return;
    this.restarts++;
    this.startedAt = Date.now();
    try {
      await SpeechRecognition.start({ language: this.language, partialResults: true, popup: false, maxResults: 1 });
    } catch (err) {
      // A session ended (silence, error): the watchdog starts the next one
      this.active = false;
      log("[native-lane] session ended:", err);
    }
  }

  private scheduleRestart(delayMs = 150) {
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null;
      void this.listen();
    }, delayMs);
  }

  stop(): void {
    this.running = false;
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = null;
    if (this.watchdog) clearInterval(this.watchdog);
    this.watchdog = null;
    SpeechRecognition.stop().catch(() => {});
    this.handles.forEach((h) => void h.remove());
    this.handles = [];
  }
}
