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
  },
  plugins: [],
};
