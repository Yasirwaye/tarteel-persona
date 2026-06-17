// src/components/quran/SurahBanner.tsx
"use client";

import { cn } from "@/lib/utils";

interface SurahBannerProps {
  surahName: string;
  surahNameArabic: string;
  isDark: boolean;
}

export default function SurahBanner({
  surahNameArabic,
  isDark,
}: SurahBannerProps) {
  const stroke = isDark ? "#e5d9b6" : "#6b4226";
  const fill = isDark ? "#1a1a1a" : "#fdfaf3";
  const accent = isDark ? "#d4af37" : "#8b6914";
  const textColor = isDark ? "text-[#e5d9b6]" : "text-[#6b4226]";

  return (
    <div className="my-8 w-full px-2" dir="ltr">
      <div className="relative w-full">
        <svg
          viewBox="0 0 1000 140"
          className="w-full h-auto"
          preserveAspectRatio="none"
          style={{ filter: isDark ? "none" : "none" }}
        >
          {/* ── Outer decorative double-frame ── */}
          <rect
            x="4"
            y="4"
            width="992"
            height="132"
            fill={fill}
            stroke={stroke}
            strokeWidth="2.5"
            rx="2"
          />
          <rect
            x="12"
            y="12"
            width="976"
            height="116"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
            rx="1"
          />
          <rect
            x="18"
            y="18"
            width="964"
            height="104"
            fill="none"
            stroke={stroke}
            strokeWidth="0.5"
            opacity="0.5"
          />

          {/* ── Corner ornaments (4 corners) ── */}
          {[
            { x: 22, y: 22, rot: 0 },
            { x: 978, y: 22, rot: 90 },
            { x: 978, y: 118, rot: 180 },
            { x: 22, y: 118, rot: 270 },
          ].map((corner, i) => (
            <g
              key={i}
              transform={`translate(${corner.x}, ${corner.y}) rotate(${corner.rot})`}
            >
              <path
                d="M 0,0 L 20,0 Q 25,0 25,5 L 25,15 Q 20,12 15,8 Q 8,4 0,3 Z"
                fill={accent}
                opacity="0.6"
              />
              <circle cx="3" cy="3" r="1.5" fill={accent} />
            </g>
          ))}

          {/* ── LEFT MEDALLION — Star within circles ── */}
          <g transform="translate(80, 70)">
            {/* Outer ring */}
            <circle r="40" fill="none" stroke={stroke} strokeWidth="1.5" />
            <circle r="38" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.4" />

            {/* Middle ring */}
            <circle r="32" fill={accent} opacity="0.08" />
            <circle r="32" fill="none" stroke={stroke} strokeWidth="0.8" />

            {/* 8-pointed star */}
            <g>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <path
                  key={angle}
                  d="M 0,-28 L 6,-10 L 0,0 L -6,-10 Z"
                  fill={accent}
                  opacity="0.7"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>

            {/* Inner ring */}
            <circle r="14" fill={fill} stroke={stroke} strokeWidth="1" />

            {/* Center 6-petal flower */}
            <g>
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-7"
                  rx="2"
                  ry="5"
                  fill={accent}
                  opacity="0.8"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle r="2.5" fill={accent} />
            </g>

            {/* Outer petals around the medallion */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <g key={`outer-${angle}`} transform={`rotate(${angle})`}>
                <path
                  d="M 0,-44 Q 3,-50 0,-54 Q -3,-50 0,-44 Z"
                  fill={stroke}
                  opacity="0.5"
                />
              </g>
            ))}
          </g>

          {/* ── RIGHT MEDALLION — Mirror of left ── */}
          <g transform="translate(920, 70)">
            <circle r="40" fill="none" stroke={stroke} strokeWidth="1.5" />
            <circle r="38" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.4" />
            <circle r="32" fill={accent} opacity="0.08" />
            <circle r="32" fill="none" stroke={stroke} strokeWidth="0.8" />

            <g>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <path
                  key={angle}
                  d="M 0,-28 L 6,-10 L 0,0 L -6,-10 Z"
                  fill={accent}
                  opacity="0.7"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>

            <circle r="14" fill={fill} stroke={stroke} strokeWidth="1" />

            <g>
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-7"
                  rx="2"
                  ry="5"
                  fill={accent}
                  opacity="0.8"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle r="2.5" fill={accent} />
            </g>

            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <g key={`outer-${angle}`} transform={`rotate(${angle})`}>
                <path
                  d="M 0,-44 Q 3,-50 0,-54 Q -3,-50 0,-44 Z"
                  fill={stroke}
                  opacity="0.5"
                />
              </g>
            ))}
          </g>

          {/* ── Connecting arabesque from left medallion ── */}
          <g>
            <path
              d="M 130,70 Q 180,55 230,70 Q 270,82 310,70"
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              opacity="0.7"
            />
            <path
              d="M 130,70 Q 180,85 230,70 Q 270,58 310,70"
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              opacity="0.7"
            />
            {/* Small flourish dots */}
            <circle cx="180" cy="70" r="2" fill={accent} />
            <circle cx="230" cy="70" r="1.5" fill={accent} opacity="0.7" />
            <circle cx="280" cy="70" r="2" fill={accent} />
          </g>

          {/* ── Connecting arabesque from right medallion ── */}
          <g>
            <path
              d="M 870,70 Q 820,55 770,70 Q 730,82 690,70"
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              opacity="0.7"
            />
            <path
              d="M 870,70 Q 820,85 770,70 Q 730,58 690,70"
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              opacity="0.7"
            />
            <circle cx="820" cy="70" r="2" fill={accent} />
            <circle cx="770" cy="70" r="1.5" fill={accent} opacity="0.7" />
            <circle cx="720" cy="70" r="2" fill={accent} />
          </g>

          {/* ── Center cartouche where the name will sit ── */}
          <g>
            {/* Decorative cartouche frame */}
            <path
              d="M 340,40 Q 320,40 320,60 L 320,80 Q 320,100 340,100 L 660,100 Q 680,100 680,80 L 680,60 Q 680,40 660,40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.2"
            />
            {/* Inner cartouche line */}
            <path
              d="M 348,46 Q 332,46 332,62 L 332,78 Q 332,94 348,94 L 652,94 Q 668,94 668,78 L 668,62 Q 668,46 652,46 Z"
              fill="none"
              stroke={stroke}
              strokeWidth="0.5"
              opacity="0.6"
            />
            {/* Tiny dots inside cartouche corners */}
            <circle cx="340" cy="50" r="1" fill={accent} />
            <circle cx="660" cy="50" r="1" fill={accent} />
            <circle cx="340" cy="90" r="1" fill={accent} />
            <circle cx="660" cy="90" r="1" fill={accent} />
          </g>
        </svg>

        {/* ── Surah name text overlay ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p
            className={cn(
              "font-arabic text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide",
              textColor
            )}
            dir="rtl"
            style={{
              textShadow: isDark
                ? "0 1px 2px rgba(0,0,0,0.5)"
                : "0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            سُورَةُ {surahNameArabic}
          </p>
        </div>
      </div>
    </div>
  );
}
