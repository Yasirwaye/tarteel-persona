// src/components/search/VoiceSearchButton.tsx
"use client";

import { apiUrl } from "@/lib/apiBase";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function VoiceSearchButton({ onTranscript, className }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Volume meter
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg =
          dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
        setVolumeLevel(Math.min(100, (avg / 128) * 100));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      mimeTypeRef.current = mimeType;

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(250);
      setIsRecording(true);
    } catch (err) {
      const msg = (err as Error).message;
      toast.error(
        msg.includes("Permission")
          ? "Microphone permission denied"
          : `Recording error: ${msg}`
      );
      cleanup();
    }
  }, [cleanup]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setVolumeLevel(0);

    // Wait briefly for final chunk
    await new Promise((r) => setTimeout(r, 300));

    if (chunksRef.current.length === 0) {
      cleanup();
      return;
    }

    setIsProcessing(true);

    try {
      const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });

      if (blob.size < 2000) {
        toast.info("Recording too short — try again");
        cleanup();
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append("audio", blob, "voice-search.webm");

      const res = await fetch(apiUrl("/api/transcribe-stream"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const transcript = (data.text || "").trim();

      if (transcript) {
        onTranscript(transcript);
        toast.success(`Searching: "${transcript.slice(0, 40)}${transcript.length > 40 ? "..." : ""}"`);
      } else {
        toast.info("Couldn't understand — try again");
      }
    } catch (err) {
      const msg = (err as Error).message;
      toast.error(`Voice search failed: ${msg}`);
    } finally {
      setIsProcessing(false);
      cleanup();
    }
  }, [cleanup, onTranscript]);

  const handleClick = () => {
    if (isProcessing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={cn(
          "p-2 rounded-xl transition-all flex items-center justify-center",
          isRecording
            ? "bg-red-600 text-white hover:bg-red-500 shadow-glow"
            : isProcessing
            ? "bg-surface-700 text-surface-400 cursor-wait"
            : "text-surface-400 hover:text-primary-400 hover:bg-primary-900/30",
          className
        )}
        title={
          isRecording
            ? "Stop recording"
            : isProcessing
            ? "Transcribing..."
            : "Voice search — recite part of an ayah"
        }
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <Square className="w-4 h-4 fill-white" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Recording overlay with volume meter */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-surface-900/95 backdrop-blur-xl border border-red-700/40 rounded-2xl px-5 py-3 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse" />
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-surface-100">
                    Recording...
                  </p>
                  <p className="text-[10px] text-surface-400">
                    Recite a few words of any ayah, then press stop
                  </p>
                </div>
              </div>

              {/* Volume meter */}
              <div className="flex items-center justify-center gap-0.5 h-4 mt-2">
                {Array.from({ length: 20 }).map((_, i) => {
                  const threshold = (i + 1) * 5;
                  const active = volumeLevel > threshold;
                  return (
                    <motion.div
                      key={i}
                      animate={{ height: active ? Math.min(16, 4 + i) : 2 }}
                      transition={{ duration: 0.1 }}
                      className={cn(
                        "w-0.5 rounded-full",
                        active
                          ? i < 12
                            ? "bg-emerald-400"
                            : i < 17
                            ? "bg-gold-400"
                            : "bg-red-400"
                          : "bg-surface-700"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}