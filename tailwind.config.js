/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  prefix: "tw-",
  important: true,
  theme: {
    extend: {
      fontFamily: {
        noto: ["Noto Sans", "sans-serif"]
      }
    },
    screens: {
      'xs': '0px',
      'sm': '600px',
      'md': '960px',
      'lg': '1280px',
      'xl': '1540px',
      '2xl': '1920px'
    }
  },
  plugins: [],
};
