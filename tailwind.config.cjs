/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
