// frontend/src/components/Header.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaBookOpen } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo y Nombre */}
      <div className="flex items-center gap-3">
        <FaBookOpen className="text-3xl text-teal-dark" />
        <h1 className="text-2xl font-bold text-teal-dark font-display">CodeNotes</h1>
      </div>

      {/* Menú de Usuario - Se renderiza solo si el usuario existe */}
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hola, {user.username || user.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-white bg-teal-dark rounded-lg hover:bg-orange-accent transition-colors duration-300"
            title="Cerrar Sesión"
          >
            <FiLogOut />
            <span>Salir</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

