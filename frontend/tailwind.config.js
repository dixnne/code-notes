// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'teal-dark': '#00809D',
        'teal-light': '#FCECDD',
        'orange-accent': '#FF7601',
        'yellow-accent': '#F3A26D',
      },
      // Añadimos la nueva familia de fuentes para usarla en la UI
      fontFamily: {
        'display': ['"Epunda Slab"', 'serif'],
      },
    },
  },
  plugins: [],
}

