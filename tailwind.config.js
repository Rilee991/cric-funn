/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  prefix: "tw-",
  important: true,
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite'
      },
      fontFamily: {
        noto: ["Noto Sans", "sans-serif"],
        autography: ["Mrs Saint Delafield", "cursive"]
      },
      colors: {
        'black-app': "#171616",
        'white-app': "#f5f7ff"
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
