import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        csmju: {
          primary: "#004C99",
          "primary-hover": "#003B77",
          "primary-active": "#002E5C",
          "primary-soft": "#E6F2FF",
          "primary-soft-hover": "#D5E8FC",
          "focus-ring": "#93C5FD",
          canvas: "#F1F5FB",
          surface: "#FFFFFF",
          "surface-muted": "#F8FAFC",
          "surface-inverse": "#0F172A",
          text: "#0F172A",
          "text-body": "#334155",
          "text-muted": "#64748B",
          "text-inverse": "#F8FAFC",
          border: "#E2E8F0",
          "border-strong": "#CBD5E1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
