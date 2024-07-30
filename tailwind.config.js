/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        light: {
          text: '#141414',
          background: '#fff8f5',
          accent: '#4d7a58',
        },
      },
    },
  },
  plugins: [],
};
