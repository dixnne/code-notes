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
  const [loading, setLoading] = useState(true); // Estado para la carga inicial
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Llamamos al nuevo endpoint para obtener los datos del usuario
          const response = await axios.get('/api/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error("Token inválido o expirado, cerrando sesión.");
          // Si el token no es válido, limpiamos todo
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
          navigate('/login');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token, navigate]);

  const register = async (username, email, password) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error.response.data);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      // Al actualizar el token, el useEffect se ejecutará automáticamente
      // para obtener los datos del usuario.
      setToken(access_token);
      navigate('/');
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response.data);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const value = {
    user, // <-- AHORA EXPORTAMOS EL USUARIO
    token,
    loading,
    login,
    logout,
    register,
  };

  // Evitamos renderizar las rutas protegidas mientras se verifica el token
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

