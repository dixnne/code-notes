// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilita el modo oscuro mediante la clase 'dark'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Fuente principal para títulos y marca
        display: ['"Epunda Slab"', 'serif'],
        // Fuente para el cuerpo del texto
        sans: ['"Roboto"', 'sans-serif'],
      },
      colors: {
        // --- COLORES DE MARCA ---
        primary: '#00809D',   // Teal principal
        secondary: '#FCECdd', // Crema claro
        accent1: '#FF7601',   // Naranja vibrante
        accent2: '#F3A26D',   // Naranja suave

        // --- COLORES SEMÁNTICOS (MODO CLARO) ---
        'light-bg': '#FCECdd',       // Fondo principal (Crema)
        'light-card': '#FFFFFF',     // Fondo de tarjetas/paneles (Blanco)
        'light-text': '#1A212D',     // Texto principal (Oscuro)
        'light-text-secondary': '#5A6477', // Texto secundario (Gris azulado)

        // --- COLORES SEMÁNTICOS (MODO OSCURO) ---
        'dark-bg': '#1A212D',        // Fondo principal (Azul muy oscuro)
        'dark-card': '#2A3447',      // Fondo de tarjetas/paneles (Azul grisáceo)
        'dark-text': '#FCECdd',      // Texto principal (Crema)
        'dark-text-secondary': '#A0A0A0', // Texto secundario (Gris claro)
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Necesario para renderizar Markdown correctamente
  ],
}