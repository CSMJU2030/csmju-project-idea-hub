import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material 3 Core Hub tokens
        background: "#F8F9FA",
        surface: "#F8F9FA",
        "surface-dim": "#D9DADB",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F3F4F5",
        "surface-container": "#EDEEEF",
        "surface-container-high": "#E7E8E9",
        "surface-container-highest": "#E1E3E4",
        "surface-variant": "#E1E3E4",
        "on-surface": "#191C1D",
        "on-surface-variant": "#434654",
        outline: "#747686",
        "outline-variant": "#C4C5D7",
        primary: "#003CB4",
        "on-primary": "#FFFFFF",
        "primary-container": "#2154D9",
        "on-primary-container": "#D2DAFF",
        "primary-fixed": "#DCE1FF",
        secondary: "#4E5D87",
        tertiary: "#003DAF",
        accent: "#3B80F2",
        "brand-navy": "#16264D",
        "brand-blue": "#0D4FA8",
        "brand-amber": "#F59E0B",
        sso: "#2D8A61",
        "sso-container": "#E8F5EE",
        success: "#10B981",
        error: "#BA1A1A",
        "error-container": "#FFDAD6",
        "on-error-container": "#93000A",

        // Backward compatibility tokens mapped to Core Hub palette
        csmju: {
          primary: "#003CB4",
          "primary-container": "#2154D9",
          "primary-hover": "#002E5C",
          "primary-active": "#16264D",
          "primary-soft": "#DCE1FF",
          "primary-soft-hover": "#D2DAFF",
          "focus-ring": "#3B80F2",
          canvas: "#F8F9FA",
          surface: "#FFFFFF",
          "surface-muted": "#F8F9FA",
          "surface-inverse": "#191C1D",
          text: "#191C1D",
          "text-body": "#434654",
          "text-muted": "#747686",
          "text-inverse": "#F8F9FA",
          border: "#C4C5D7",
          "border-strong": "#747686",
        },
      },
      fontFamily: {
        display: [
          "var(--font-jakarta)",
          "var(--font-noto-thai)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "var(--font-noto-thai)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "1.2", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};

export default config;
