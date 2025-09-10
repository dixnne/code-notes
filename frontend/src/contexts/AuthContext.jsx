// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Aquí podrías añadir una llamada para verificar el token y obtener los datos del usuario
      // Por ahora, asumimos que el token es válido si existe.
    }
  }, [token]);

  const register = async (username, email, password) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
      // Redirigir al login después de un registro exitoso
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error.response.data);
      // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      // Redirigir a la página principal después de un login exitoso
      navigate('/');
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response.data);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const value = {
    token,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
