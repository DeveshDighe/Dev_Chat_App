/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        try1 : ["Poppins", 'system-ui'],
        try2 : ["Outfit", 'system-ui'],
        try3 : ["DM Sans", 'system-ui'],
      }
    },
  },
  plugins: [],
}