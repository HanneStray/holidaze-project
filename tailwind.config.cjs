/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease forwards",
        slideUp: "slideUp 0.3s ease forwards",
      },
      colors: {
        brand: {
          // Primary colors (backgrounds / sections)
          moss: "#869D7A",
          sage: "#A7CDBD",
          mint: "#DFF8EB",
          aqua: "#BDEFEA",
          sky: "#7FA3DC",

          // Secondary colors (CTA / highlights)
          rust: "#9C2F1F",
          terracotta: "#C65A3A",
          sand: "#FDD969",
          brown: "#5A3A2E",
          clay: "#E8D3C5",
        },
      },
    },
  },
  plugins: [],
};
