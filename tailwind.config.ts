// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0f1115",
        primary: "#1f1f23",
        accent: "#ef4444",
        mute: "#6b7280",
      },
      boxShadow: { soft: "0 10px 20px -10px rgba(0,0,0,.15)" },
      borderRadius: { "2xl": "1rem" },
    },
  },
  plugins: [], // لا تستخدم أي line-clamp هنا
};
export default config;
