/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        light: {
          text: '#141414',
          background: '#fff8f5',
          green: {
            50: '#f2f7f3',
            100: '#e0ebe0',
            200: '#c3d7c6',
            300: '#9abba0',
            400: '#6e9977',
            500: '#4e7b59',
            600: '#3a6144',
            700: '#2f4d38',
            800: '#273e2e',
            900: '#203427',
            950: '#111d15',
          },
        },
      },
    },
  },
  plugins: [],
};
