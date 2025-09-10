// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaUser, FaBookOpen } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(username, email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg w-96 border border-white text-center">
        {/* Logo de la aplicación */}
        <div className="flex justify-center mb-4">
            <FaBookOpen className="text-5xl text-teal-dark" />
        </div>
        
        {/* Título con la nueva fuente */}
        <h2 className="text-4xl font-bold text-teal-dark mb-2 font-display">
          CodeNotes
        </h2>
        <p className="text-gray-600 mb-6">Crea tu cuenta para empezar</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-left">Nombre de Usuario</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-dark"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-left">Correo Electrónico</label>
             <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MdEmail className="text-gray-400" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-dark"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1 text-left">Contraseña</label>
             <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <RiLockPasswordFill className="text-gray-400" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-dark"
                required
                minLength="8"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-teal-dark rounded-lg hover:bg-orange-accent transition-colors duration-300 font-semibold"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-teal-dark hover:text-orange-accent font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

