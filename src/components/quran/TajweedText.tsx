// src/components/quran/TajweedText.tsx
"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { analyzeTajweed, TAJWEED_INFO, type TajweedSpan } from "@/lib/tajweed";

interface Props {
  text: string;
  enabled: boolean;
  className?: string;
}

export default function TajweedText({ text, enabled, className }: Props) {
  const spans = useMemo(
    () => (enabled ? analyzeTajweed(text) : []),
    [text, enabled]
  );

  if (!enabled || spans.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Build segments
  const segments: { text: string; rule: TajweedSpan["rule"] | null }[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.start > cursor) {
      segments.push({ text: text.slice(cursor, span.start), rule: null });
    }
    segments.push({ text: text.slice(span.start, span.end), rule: span.rule });
    cursor = span.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), rule: null });
  }

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (!seg.rule) {
          return <span key={i}>{seg.text}</span>;
        }
        const info = TAJWEED_INFO[seg.rule];
        return (
          <span
            key={i}
            className={cn(info.color)}
            title={`${info.label}: ${info.description}`}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
}