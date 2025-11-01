// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 1. Habilitamos el modo oscuro basado en una clase en el tag <html>
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de colores principal
        primary: '#00809D',
        secondary: '#FCECdd',
        accent1: '#FF7601',
        accent2: '#F3A26D',

        // 2. Definimos colores semánticos para ambos modos
        // Modo Oscuro
        'dark-bg': '#1A212D',
        'dark-card': '#2A3447',
        'dark-text': '#FCECdd',
        'dark-text-secondary': '#a0a0a0',

        // Modo Claro
        'light-bg': '#FCECdd', // Usamos el secundario como fondo claro
        'light-card': '#FFFFFF',
        'light-text': '#1A212D',
        'light-text-secondary': '#5A6477',
      },
      fontFamily: {
        display: ['"Epunda Slab"', 'serif'],
        sans: ['"Roboto"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

