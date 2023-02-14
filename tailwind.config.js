/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        secondary: colors.orange,
        warning: colors.yellow,
        error: colors.red,
        info: colors.gray,
        success: colors.teal,
      },
      screens: {
        laptop: { max: "1280px" },
        tablet: { max: "768px" },
        mobile: { max: "420px" },
      },
    },
  },
  plugins: [],
};
