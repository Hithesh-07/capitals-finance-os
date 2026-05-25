import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#e5e2e1",
        surface: "#0A0A0A",
        elevated: "#141414",
        "primary-fixed": "#63f7ff",
        "primary-fixed-dim": "#00dce5",
        secondary: "#dcb8ff",
        "secondary-fixed": "#efdbff",
        "secondary-fixed-dim": "#dcb8ff",
        "secondary-container": "#7701d0",
        tertiary: "#eeffe6",
        "tertiary-fixed": "#72ff70",
        "tertiary-fixed-dim": "#00e639",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#b9caca",
        "outline-variant": "#3a494a",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        unit: "8px",
        gutter: "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "container-max": "1280px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Geist", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
