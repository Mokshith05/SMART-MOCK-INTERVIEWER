/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top, rgba(59,130,246,0.35), transparent 60%), radial-gradient(circle at bottom, rgba(139,92,246,0.25), transparent 55%)",
      },
    },
  },
  plugins: [],
};

