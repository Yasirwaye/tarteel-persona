// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================
      // COLOR PALETTE - Spiritual, Premium, Elegant
      // ============================================
      colors: {
        // Primary - Deep Spiritual Teal (Tarteel-inspired)
        primary: {
          50: "#effefb",
          100: "#c8fff4",
          200: "#91ffea",
          300: "#52f5dc",
          400: "#1edeca",
          500: "#06c2b0",
          600: "#019d91",
          700: "#067d75",
          800: "#0a635e",
          900: "#0d524e",
          950: "#003332",
        },
        // Secondary - Warm Gold (Islamic aesthetic)
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#d4a017",
          600: "#b8860b",
          700: "#92400e",
          800: "#78350f",
          900: "#5c2d0e",
          950: "#3d1f0a",
        },
        // Background - Deep Dark (Premium feel)
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          850: "#172033",
          900: "#0f172a",
          950: "#020617",
        },
        // Quran-specific semantic colors
        quran: {
          ayah: "#e2e8f0",
          "ayah-highlight": "#06c2b0",
          sajdah: "#f59e0b",
          hizb: "#8b5cf6",
          juz: "#3b82f6",
          "rub-hizb": "#ec4899",
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        // Arabic text (Quran)
        arabic: ['"Amiri Quran"', '"Amiri"', '"Traditional Arabic"', "serif"],
        // Arabic headers
        "arabic-display": ['"Amiri"', '"Traditional Arabic"', "serif"],
        // English / UI
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        // Mono for verse numbers
        mono: ['"JetBrains Mono"', "monospace"],
      },

      fontSize: {
        // Arabic text sizes
        "arabic-sm": ["1.375rem", { lineHeight: "2.5" }],
        "arabic-base": ["1.75rem", { lineHeight: "2.8" }],
        "arabic-lg": ["2.125rem", { lineHeight: "3.2" }],
        "arabic-xl": ["2.5rem", { lineHeight: "3.5" }],
        "arabic-2xl": ["3rem", { lineHeight: "4" }],
        "arabic-3xl": ["3.5rem", { lineHeight: "4.5" }],
      },

      // ============================================
      // SPACING & SIZING
      // ============================================
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },

      maxWidth: {
        "8xl": "88rem",
        quran: "52rem",
      },

      // ============================================
      // BORDERS & RADIUS
      // ============================================
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ============================================
      // SHADOWS (Glassmorphism & Depth)
      // ============================================
      boxShadow: {
        glow: "0 0 20px rgba(6, 194, 176, 0.15)",
        "glow-lg": "0 0 40px rgba(6, 194, 176, 0.2)",
        "glow-gold": "0 0 20px rgba(212, 160, 23, 0.15)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
        premium:
          "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)",
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(6, 194, 176, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(6, 194, 176, 0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      // ============================================
      // BACKDROP BLUR
      // ============================================
      backdropBlur: {
        xs: "2px",
      },

      // ============================================
      // BACKGROUND IMAGE (Patterns)
      // ============================================
      backgroundImage: {
        "islamic-pattern": "url('/images/bg-pattern.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-spiritual":
          "linear-gradient(135deg, #0f172a 0%, #003332 50%, #0f172a 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(6,194,176,0.05) 0%, rgba(6,194,176,0) 100%)",
        "gradient-gold":
          "linear-gradient(135deg, rgba(212,160,23,0.1) 0%, rgba(212,160,23,0) 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;