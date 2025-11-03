// frontend/src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Creamos el contexto
const ThemeContext = createContext();

// 2. Creamos el Proveedor del tema
export const ThemeProvider = ({ children }) => {
  // Leemos del localStorage o usamos 'light' por defecto
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Eliminamos la clase anterior
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    // Añadimos la clase actual
    root.classList.add(theme);

    // Guardamos la preferencia en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Creamos el hook personalizado para consumir el contexto
export const useTheme = () => useContext(ThemeContext);

