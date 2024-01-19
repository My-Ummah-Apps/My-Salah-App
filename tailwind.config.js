/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "card-bg-color": "var(--card-bg-color)",
      },
    },
  },
  plugins: [],
};
