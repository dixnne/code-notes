// frontend/src/pages/HomePage.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">¡Bienvenido a CodeNotes!</h1>
        <p className="text-gray-700 mb-6">Esta es tu página principal segura.</p>
        <button
          onClick={logout}
          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default HomePage;
