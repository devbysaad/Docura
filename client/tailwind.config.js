/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        surface: "#1A1A1A",
        accent: {
          DEFAULT: "#E8C547",
          hover: "#d4b33e",
          muted: "rgba(232, 197, 71, 0.15)",
        },
        bg: "#0F0F0F",
      },
    },
  },
  plugins: [],
};
