/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17231f",
        canvas: "#f7f8f4",
        lime: "#c9f269",
        moss: "#2f5d50",
        "soft-blue": "#dcecf1"
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 70px -32px rgba(24, 42, 35, 0.32)",
        card: "0 12px 34px -22px rgba(24, 42, 35, 0.22)"
      }
    }
  },
  plugins: []
};
