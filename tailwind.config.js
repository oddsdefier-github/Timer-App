/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./js/**/*.js",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        'darkPrimary': "#22272e",
        'orangePrimary': "#f06d06",
      }
    },
  },
  plugins: [require('tailwindcss-font-inter')],
}

