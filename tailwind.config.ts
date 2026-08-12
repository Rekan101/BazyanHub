import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-vazirmatn)",
          "Noto Sans Arabic",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },

  plugins: [],
};

export default config;