// src/components/activity/TimeChart.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  labels: string[];
  values: number[];
  kind: "bar" | "area";
  /** Tooltip value text, e.g. "12 pages" */
  format: (v: number) => string;
  /** Accessible summary of the chart */
  title: string;
}

const HEIGHT = 190;
const PAD = { top: 12, right: 8, bottom: 28, left: 34 };
// Single series: one hue; text stays in neutral ink
const SERIES = "#34d399"; // emerald-400 on the dark surface
const GRID = "rgba(255,255,255,0.07)";
const INK_MUTED = "rgb(148 163 184)"; // surface-400

/** Rounded "nice" maximum for the y axis */
function niceMax(v: number): number {
  if (v <= 0) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

/**
 * One series over time (bars or an area line) with a recessive grid, sparse
 * date labels and a hover / touch tooltip. Width follows the container.
 */
export default function TimeChart({ labels, values, kind, format, title }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const n = values.length;
  const max = niceMax(Math.max(...values, 0));
  const plotW = Math.max(10, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const step = plotW / Math.max(1, n);
  const x = (i: number) => PAD.left + step * i + step / 2;
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, max / 2, max];
  // At most ~5 date labels so they never collide
  const labelEvery = Math.max(1, Math.ceil(n / 5));

  const onMove = (clientX: number) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const i = Math.floor((clientX - r.left - PAD.left) / step);
    setHover(i >= 0 && i < n ? i : null);
  };

  const barW = Math.max(2, Math.min(28, step - 2)); // 2px surface gap between bars
  const linePath = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const areaPath = `${linePath} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  return (
    <div
      ref={wrap}
      className="relative w-full select-none"
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseLeave={() => setHover(null)}
      onTouchStart={(e) => onMove(e.touches[0].clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
    >
      <svg width={width} height={HEIGHT} role="img" aria-label={title}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={GRID} />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill={INK_MUTED}>
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </text>
          </g>
        ))}

        {kind === "bar"
          ? values.map((v, i) => {
              if (v <= 0) return null;
              const h = Math.max(2, y(0) - y(v));
              const r = Math.min(4, barW / 2, h);
              const left = x(i) - barW / 2;
              const top = y(0) - h;
              // Rounded data end, square at the baseline
              const d = `M${left},${y(0)} V${top + r} Q${left},${top} ${left + r},${top} H${left + barW - r} Q${left + barW},${top} ${left + barW},${top + r} V${y(0)} Z`;
              return <path key={i} d={d} fill={SERIES} opacity={hover === null || hover === i ? 1 : 0.55} />;
            })
          : n > 0 && (
              <>
                <path d={areaPath} fill={SERIES} opacity={0.15} />
                <path d={linePath} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" />
              </>
            )}

        {kind === "area" && hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={y(0)} stroke="rgba(255,255,255,0.25)" />
            <circle cx={x(hover)} cy={y(values[hover])} r={4.5} fill={SERIES} stroke="rgb(2 6 23)" strokeWidth={2} />
          </>
        )}

        {labels.map((l, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill={INK_MUTED}>
              {l.length > 5 && n > 7 ? l.slice(0, 5) : l}
            </text>
          ) : null
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 px-2.5 py-1.5 rounded-lg bg-surface-800 border border-white/[0.1] text-xs shadow-xl whitespace-nowrap"
          style={{ left: Math.min(Math.max(0, x(hover) - 60), width - 130) }}
        >
          <p className="text-surface-400">{labels[hover]}</p>
          <p className="font-semibold text-surface-50">{format(values[hover])}</p>
        </div>
      )}
    </div>
  );
}
