// src/lib/pcmRecorder.ts
/**
 * Microphone capture as raw 16 kHz mono PCM.
 *
 * Why not MediaRecorder: WebM/Opus is not supported on iOS Safari / WKWebView,
 * and a compressed stream can't be cut at arbitrary points. With raw PCM we can
 * send any time window as a small WAV, detect pauses (end of ayah) and only
 * transcribe the audio that hasn't been finalized yet.
 */

export const TARGET_SAMPLE_RATE = 16000;
const FRAME_SAMPLES = 320; // 20 ms at 16 kHz

const WORKLET_SOURCE = `
class PcmCapture extends AudioWorkletProcessor {
  constructor() { super(); this.buf = new Float32Array(2048); this.len = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.len++] = ch[i];
        if (this.len === this.buf.length) { this.port.postMessage(this.buf.slice(0)); this.len = 0; }
      }
    }
    return true;
  }
}
registerProcessor("pcm-capture", PcmCapture);
`;

export interface PcmRecorderOptions {
  /** Called with a 0–100 level for the volume meter. */
  onLevel?: (level: number) => void;
}

export class PcmRecorder {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private nodes: AudioNode[] = [];
  private analyser: AnalyserNode | null = null;
  private raf: number | null = null;

  // 16 kHz output buffer (grows by doubling)
  private data = new Float32Array(TARGET_SAMPLE_RATE * 60);
  private length = 0;
  // Streaming box-filter resampler state
  private ratio = 1;
  private acc = 0;
  private accCount = 0;
  private phase = 0;
  // Per-20 ms RMS energy, for pause detection
  private frameRms: number[] = [];
  private frameAcc = 0;
  private frameCount = 0;

  constructor(private options: PcmRecorderOptions = {}) {}

  /** Must be called from a user gesture (tap) so iOS lets audio start. */
  async start(): Promise<void> {
    const Ctx: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    // Create + resume before awaiting the mic, while still inside the gesture
    this.ctx = new Ctx();
    const resumePromise = this.ctx.resume().catch(() => {});

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    await resumePromise;

    const ctx = this.ctx;
    this.ratio = ctx.sampleRate / TARGET_SAMPLE_RATE;
    const source = ctx.createMediaStreamSource(this.stream);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);

    // Silent sink: some engines only pull audio through nodes connected to the destination
    const sink = ctx.createGain();
    sink.gain.value = 0;
    sink.connect(ctx.destination);
    this.nodes.push(source, this.analyser, sink);

    let usedWorklet = false;
    if (ctx.audioWorklet && typeof AudioWorkletNode !== "undefined") {
      try {
        const url = URL.createObjectURL(
          new Blob([WORKLET_SOURCE], { type: "application/javascript" })
        );
        await ctx.audioWorklet.addModule(url);
        URL.revokeObjectURL(url);
        const node = new AudioWorkletNode(ctx, "pcm-capture", {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          channelCount: 1,
        });
        node.port.onmessage = (e: MessageEvent<Float32Array>) => this.push(e.data);
        source.connect(node);
        node.connect(sink);
        this.nodes.push(node);
        usedWorklet = true;
      } catch {
        usedWorklet = false;
      }
    }
    if (!usedWorklet) {
      // Fallback for older WebViews
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      proc.onaudioprocess = (e) => this.push(e.inputBuffer.getChannelData(0));
      source.connect(proc);
      proc.connect(sink);
      this.nodes.push(proc);
    }

    this.startMeter();
  }

  stop(): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
    for (const n of this.nodes) {
      try {
        n.disconnect();
      } catch {
        /* already disconnected */
      }
    }
    this.nodes = [];
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.ctx && this.ctx.state !== "closed") this.ctx.close().catch(() => {});
    this.ctx = null;
    this.analyser = null;
    this.options.onLevel?.(0);
  }

  /** The live microphone track (for a streaming recognizer to listen to as well). */
  get audioTrack(): MediaStreamTrack | null {
    return this.stream?.getAudioTracks()[0] ?? null;
  }

  /** Total captured samples at 16 kHz. */
  get sampleCount(): number {
    return this.length;
  }

  seconds(samples = this.length): number {
    return samples / TARGET_SAMPLE_RATE;
  }

  private thresholdCache = { frames: -1, value: 0.01 };

  /** Noise-adaptive energy threshold separating speech from silence. */
  private speechThreshold(): number {
    const n = this.frameRms.length;
    if (n === 0) return 0.01;
    // Recompute at most every ~200 ms of audio (sorting is the costly part)
    if (n - this.thresholdCache.frames < 10) return this.thresholdCache.value;
    // Noise floor = 10th percentile over the last ~30 s
    const recent = this.frameRms.slice(Math.max(0, n - 1500)).sort((a, b) => a - b);
    const floor = recent[Math.floor(recent.length * 0.1)] ?? 0;
    this.thresholdCache = { frames: n, value: Math.max(0.006, floor * 3) };
    return this.thresholdCache.value;
  }

  /**
   * Lengths (seconds) of the reciter's pauses in [from, to): silent runs of at
   * least `minSec` with voice on both sides. Used to learn the reciter's pace.
   */
  pauseLengths(from: number, to: number = this.length, minSec = 0.2): number[] {
    const th = this.speechThreshold();
    const need = Math.ceil((minSec * TARGET_SAMPLE_RATE) / FRAME_SAMPLES);
    const f0 = Math.floor(from / FRAME_SAMPLES);
    const f1 = Math.min(this.frameRms.length, Math.floor(to / FRAME_SAMPLES));
    const out: number[] = [];
    let run = 0;
    let seenSpeech = false;
    for (let f = f0; f < f1; f++) {
      if (this.frameRms[f] > th) {
        if (seenSpeech && run >= need) out.push((run * FRAME_SAMPLES) / TARGET_SAMPLE_RATE);
        seenSpeech = true;
        run = 0;
      } else {
        run++;
      }
    }
    return out;
  }

  /** Seconds of silence at the end of the audio (looking back no further than `from`). */
  trailingSilenceSec(from = 0): number {
    const th = this.speechThreshold();
    const f0 = Math.floor(from / FRAME_SAMPLES);
    let f = this.frameRms.length - 1;
    let frames = 0;
    while (f >= f0 && this.frameRms[f] <= th) {
      frames++;
      f--;
    }
    return (frames * FRAME_SAMPLES) / TARGET_SAMPLE_RATE;
  }

  /** Seconds of speech-level audio in [from, to). */
  speechSeconds(from: number, to: number = this.length): number {
    const th = this.speechThreshold();
    const f0 = Math.floor(from / FRAME_SAMPLES);
    const f1 = Math.min(this.frameRms.length, Math.floor(to / FRAME_SAMPLES));
    let frames = 0;
    for (let f = f0; f < f1; f++) if (this.frameRms[f] > th) frames++;
    return (frames * FRAME_SAMPLES) / TARGET_SAMPLE_RATE;
  }

  /**
   * Find a pause to cut at, searching backwards from `to` down to `from`.
   * Returns the sample index in the middle of the latest pause of at least
   * `minPauseSec`, or null if there is none.
   */
  findPause(from: number, to: number, minPauseSec = 0.35): number | null {
    const th = this.speechThreshold();
    const need = Math.ceil((minPauseSec * TARGET_SAMPLE_RATE) / FRAME_SAMPLES);
    const f0 = Math.floor(from / FRAME_SAMPLES);
    const f1 = Math.min(this.frameRms.length, Math.floor(to / FRAME_SAMPLES));
    let run = 0;
    for (let f = f1 - 1; f >= f0; f--) {
      if (this.frameRms[f] <= th) {
        run++;
      } else {
        if (run >= need) return (f + 1 + Math.floor(run / 2)) * FRAME_SAMPLES;
        run = 0;
      }
    }
    if (run >= need) return (f0 + Math.floor(run / 2)) * FRAME_SAMPLES;
    return null;
  }

  /** Quietest 100 ms point in [from, to) — last resort cut when nobody pauses. */
  quietestPoint(from: number, to: number): number {
    const f0 = Math.floor(from / FRAME_SAMPLES);
    const f1 = Math.min(this.frameRms.length, Math.floor(to / FRAME_SAMPLES));
    let best = f1 - 1;
    let bestE = Infinity;
    for (let f = f0; f + 5 <= f1; f++) {
      let e = 0;
      for (let k = 0; k < 5; k++) e += this.frameRms[f + k];
      if (e < bestE) {
        bestE = e;
        best = f + 2;
      }
    }
    return Math.max(from, best * FRAME_SAMPLES);
  }

  /**
   * Encode [from, to) as a mono WAV blob.
   * `mulaw` (default) = 8-bit G.711 µ-law: half the upload size of 16-bit PCM,
   * with no measurable effect on Whisper's transcripts.
   */
  toWav(from: number, to: number = this.length, encoding: "mulaw" | "pcm16" = "mulaw"): Blob {
    const start = Math.max(0, Math.min(from, this.length));
    const end = Math.max(start, Math.min(to, this.length));
    return encodeWav(this.data.subarray(start, end), encoding);
  }

  // ── internals ──────────────────────────────────────────

  private push(input: Float32Array): void {
    for (let i = 0; i < input.length; i++) {
      this.acc += input[i];
      this.accCount++;
      this.phase += 1;
      if (this.phase >= this.ratio) {
        this.phase -= this.ratio;
        this.append(this.acc / this.accCount);
        this.acc = 0;
        this.accCount = 0;
      }
    }
  }

  private append(sample: number): void {
    if (this.length === this.data.length) {
      const next = new Float32Array(this.data.length * 2);
      next.set(this.data);
      this.data = next;
    }
    this.data[this.length++] = sample;
    this.frameAcc += sample * sample;
    this.frameCount++;
    if (this.frameCount === FRAME_SAMPLES) {
      this.frameRms.push(Math.sqrt(this.frameAcc / FRAME_SAMPLES));
      this.frameAcc = 0;
      this.frameCount = 0;
    }
  }

  private startMeter(): void {
    const analyser = this.analyser;
    if (!analyser || !this.options.onLevel) return;
    const bins = new Uint8Array(analyser.frequencyBinCount);
    let last = 0;
    const tick = (t: number) => {
      if (!this.analyser) return;
      // ~20 updates/s is plenty for the meter and avoids re-rendering every frame
      if (t - last > 50) {
        last = t;
        analyser.getByteFrequencyData(bins);
        let sum = 0;
        for (let i = 0; i < bins.length; i++) sum += bins[i];
        this.options.onLevel?.(Math.min(100, (sum / bins.length / 128) * 100));
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
}

// ── WAV encoding ───────────────────────────────────────────

function linearToMulaw(sample: number): number {
  const BIAS = 0x84;
  const CLIP = 32635;
  let s = Math.round(Math.max(-1, Math.min(1, sample)) * 32767);
  const sign = s < 0 ? 0x80 : 0;
  if (s < 0) s = -s;
  if (s > CLIP) s = CLIP;
  s += BIAS;
  let exponent = 7;
  for (let mask = 0x4000; (s & mask) === 0 && exponent > 0; exponent--, mask >>= 1);
  const mantissa = (s >> (exponent + 3)) & 0x0f;
  return ~(sign | (exponent << 4) | mantissa) & 0xff;
}

/** Encode 16 kHz mono float samples as a WAV file. */
export function encodeWav(samples: Float32Array, encoding: "mulaw" | "pcm16" = "mulaw"): Blob {
  const mulaw = encoding === "mulaw";
  const bytesPerSample = mulaw ? 1 : 2;
  const fmtSize = mulaw ? 18 : 16; // non-PCM formats carry a cbSize field
  const headerSize = 12 + 8 + fmtSize + 8;
  const dataSize = samples.length * bytesPerSample;
  const buf = new ArrayBuffer(headerSize + dataSize);
  const v = new DataView(buf);
  const str = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  v.setUint32(4, headerSize - 8 + dataSize, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, fmtSize, true);
  v.setUint16(20, mulaw ? 7 : 1, true); // 7 = µ-law, 1 = PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, TARGET_SAMPLE_RATE, true);
  v.setUint32(28, TARGET_SAMPLE_RATE * bytesPerSample, true);
  v.setUint16(32, bytesPerSample, true);
  v.setUint16(34, bytesPerSample * 8, true);
  let o = 36;
  if (mulaw) {
    v.setUint16(36, 0, true);
    o = 38;
  }
  str(o, "data");
  v.setUint32(o + 4, dataSize, true);
  o += 8;
  if (mulaw) {
    for (let i = 0; i < samples.length; i++) v.setUint8(o + i, linearToMulaw(samples[i]));
  } else {
    for (let i = 0; i < samples.length; i++, o += 2) {
      const x = Math.max(-1, Math.min(1, samples[i]));
      v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7fff, true);
    }
  }
  return new Blob([buf], { type: "audio/wav" });
}
