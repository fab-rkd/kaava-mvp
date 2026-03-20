import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Kaava Design Tokens ───────────────────────────────────────────
      // These come directly from the design spec. Instead of memorising
      // hex codes, you use names like bg-forest or text-saffron everywhere.
      colors: {
        forest: {
          DEFAULT: "#2D6A4F",
          dark: "#1B4D3E",
          light: "#40916C",
          nav: "#245c44",
        },
        saffron: {
          DEFAULT: "#E85D04",
          light: "#F48C06",
        },
        gold: "#FFBA08",
        kaava: {
          dark: "#1B1B1B",
          border: "#F0F0F0",
          surface1: "#FAFAFA",
          surface2: "#F7F7F7",
          muted: "#888888",
          secondary: "#666666",
        },
      },
      // ─── Fonts ────────────────────────────────────────────────────────
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        devanagari: ["Noto Serif Devanagari", "serif"],
      },
      // ─── Max width for content sections ───────────────────────────────
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
