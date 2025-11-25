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
      animation: {
        'ai-shimmer': 'ai-shimmer 3s ease-in-out infinite',
        'ai-pulse': 'ai-pulse 1.5s ease-in-out infinite',
        'ai-fade-in': 'ai-fade-in 0.6s ease-out',
        'ai-glow': 'ai-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'ai-shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'ai-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'ai-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ai-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Necesario para renderizar Markdown correctamente
  ],
}