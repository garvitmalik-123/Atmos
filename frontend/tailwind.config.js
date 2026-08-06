/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#09090B",
          deep: "#050505",
          raised: "#111111",
          card: "#141417",
        },
        ink: {
          100: "#F4F4F5",
          300: "#C4C4CB",
          400: "#9CA3AF",
          500: "#8B8B93",
          700: "#57575F",
        },
        line: "rgba(255,255,255,0.08)",
        brand: {
          violet: "#7C3AED",
          indigo: "#4F46E5",
          cyan: "#06B6D4",
          blue: "#3B82F6",
          purple: "#A855F7",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C3AED 0%, #4F46E5 45%, #06B6D4 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.15) 45%, rgba(6,182,212,0.15) 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.28), transparent 60%)",
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(168,85,247,0.35)",
        card: "0 8px 30px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blobA: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(6%, 8%) scale(1.08)" },
          "66%": { transform: "translate(-4%, 4%) scale(0.96)" },
        },
        blobB: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "40%": { transform: "translate(-8%, -6%) scale(1.1)" },
          "70%": { transform: "translate(5%, -3%) scale(0.94)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        twinkle: {
          "0%, 100%": { opacity: 0.15 },
          "50%": { opacity: 0.85 },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s infinite linear",
        marquee: "marquee 28s linear infinite",
        blobA: "blobA 18s ease-in-out infinite",
        blobB: "blobB 22s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        gradientMove: "gradientMove 6s ease infinite",
        twinkle: "twinkle 3.5s ease-in-out infinite",
      },
      backgroundSize: {
        "grid-sm": "42px 42px",
        "gradient-200": "200% 200%",
      },
    },
  },
  plugins: [],
};
