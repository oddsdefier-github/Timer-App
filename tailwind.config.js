/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./js/**/*.js",
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-font-inter')],
}

