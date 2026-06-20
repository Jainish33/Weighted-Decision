import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F2",
        ink: "#1C1814",
        burgundy: "#6B2737",
        taupe: "#D8CFC4",
        gold: "#B8975A",
        charcoal: "#211C18",
        // The physical card's palette: botanical greens, aged paper, kraft.
        forest: "#3E5C45",
        sage: "#8AA38D",
        cream: "#F3ECDD",
        paper: "#EBDCBE",
        kraft: "#C2A582",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
