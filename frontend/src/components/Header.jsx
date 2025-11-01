// frontend/src/components/Header.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext'; // 1. Importar useTheme
import { FaNoteSticky } from 'react-icons/fa6';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi'; // 2. Importar iconos de sol/luna

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // 3. Usar el contexto del tema

  const renderUserMenu = () => {
    if (!user) {
      return (
        <div className="w-24 h-6 bg-light-text/10 dark:bg-dark-card/50 rounded animate-pulse" />
      );
    }
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-light-text-secondary dark:text-secondary hidden sm:block">
          {user.username}
        </span>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-light-text-secondary dark:text-gray-400 hover:text-light-text dark:hover:text-white transition-colors"
          title="Cerrar sesión"
        >
          <FiLogOut />
        </button>
      </div>
    );
  };

  return (
    // 4. Header distinguible: con fondo sólido, borde y sombra
    <header className="w-full p-4 md:p-6 mb-8 bg-light-card dark:bg-dark-card shadow-md border-b border-black/10 dark:border-white/10">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo y Título */}
        <div className="flex items-center space-x-2">
          <FaNoteSticky className="text-primary text-3xl" />
          <span className="text-2xl font-bold font-display text-light-text dark:text-white">
            Code<span className="text-primary">Notes</span>
          </span>
        </div>

        {/* Menú de Usuario y Toggle de Tema */}
        <div className="flex items-center space-x-4">
          {renderUserMenu()}

          {/* 5. Botón para cambiar el tema */}
          <button
            onClick={toggleTheme}
            className="text-xl text-light-text-secondary dark:text-gray-400 hover:text-light-text dark:hover:text-white transition-colors"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

