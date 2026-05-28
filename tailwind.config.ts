import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#e2e8f0",
        accent: "#22d3ee",
        border: "#1e293b"
      },
      boxShadow: {
        card: "0 20px 40px rgba(2, 6, 23, 0.75)"
      }
    }
  },
  plugins: []
};

export default config;