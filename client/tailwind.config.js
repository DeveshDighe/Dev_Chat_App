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
      },
      screens: {
        'custom-lg': '1100px',
        'custom-mdb' : '900px',
        'custom-md' : '800px',
        'custom-xsm' : '600px',
        'custom-xSmall' : '400px',
        'custom-lastSmall' : '300px',
      },
    },
  },
  plugins: [],
}


