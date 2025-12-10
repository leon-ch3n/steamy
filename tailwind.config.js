/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "sans-serif",
        ],
      },
      colors: {
        primary: "#1e293b",
        // New pastel palette
        lavender: {
          veil: "#F0DCFE",
          DEFAULT: "#D4E2FF",
        },
        thistle: {
          DEFAULT: "#F3CCFC",
          alt: "#F8CEF7",
        },
        mauve: "#EBBDFB",
        cyan: {
          light: "#C8F6FF",
        },
        sky: {
          pale: "#D7ECFF",
        },
        // Accent for buttons/interactions
        accent: {
          DEFAULT: "#9333ea",
          hover: "#7e22ce",
          light: "#c084fc",
        },
        // Semantic design tokens (mapped to existing colors)
        surface: {
          DEFAULT: "#ffffff",
          muted: "rgba(255, 255, 255, 0.7)",
          elevated: "#ffffff",
        },
        border: {
          DEFAULT: "rgba(226, 232, 240, 0.5)",
          muted: "rgba(255, 255, 255, 0.5)",
        },
        text: {
          primary: "#1e293b",
          secondary: "#64748b",
          muted: "#94a3b8",
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
