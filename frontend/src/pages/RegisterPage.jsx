// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaNoteSticky } from 'react-icons/fa6';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const RegisterPage = () => {
  // ... (estado y lógica de registro se mantienen igual) ...
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setError(null);
    const regError = await register(username, email, password);
    if (regError) {
      setError(regError);
    }
  };

  return (
    // Usamos los nuevos colores semánticos
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-gradient-to-br from-dark-bg to-[#111620] p-4">
      <div className="w-full max-w-md">
        <div className="bg-light-card dark:bg-dark-card/60 shadow-xl rounded-lg p-8 backdrop-blur-sm border border-black/10 dark:border-white/10">
          {/* ... (Logo se mantiene igual) ... */}
          <div className="flex justify-center items-center mb-6">
            <FaNoteSticky className="text-primary text-4xl" />
            <h1 className="text-3xl font-bold font-display text-light-text dark:text-white ml-2">
              Code<span className="text-primary">Notes</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-center text-light-text dark:text-white mb-6">
            Crear Cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (Inputs actualizados con colores de tema) ... */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-gray-400" />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-light-bg dark:bg-dark-bg border border-black/20 dark:border-white/20 rounded-md text-light-text dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-gray-400" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-light-bg dark:bg-dark-bg border border-black/20 dark:border-white/20 rounded-md text-light-text dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-gray-400" />
              <input
                type="password"
                placeholder="Contraseña (mín. 8 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-light-bg dark:bg-dark-bg border border-black/20 dark:border-white/20 rounded-md text-light-text dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-accent1 hover:bg-accent1/90 text-dark-bg font-bold rounded-md transition-colors duration-300"
            >
              Registrarse
            </button>
          </form>

          <p className="text-sm text-center text-light-text-secondary dark:text-gray-400 mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

