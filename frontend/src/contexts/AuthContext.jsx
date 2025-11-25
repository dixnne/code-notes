// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importamos nuestro cliente API

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Leemos el token de localStorage al iniciar
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      // 2. Guardamos el token en localStorage y en el estado
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Obtenemos el perfil del usuario inmediatamente después del login
      await fetchUserProfile(access_token);
      
      navigate('/');
      return null; // Éxito
    } catch (error) {
      console.error('Error en el login:', error.response?.data);
      return error.response?.data?.message || 'Error al iniciar sesión';
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/login');
      return null; // Éxito
    } catch (error) {
      console.error('Error en el registro:', error.response?.data);
      return error.response?.data?.message || 'Error al registrarse';
    }
  };

  const logout = () => {
    // 3. Limpiamos localStorage y el estado
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const fetchUserProfile = async (currentToken) => {
    if (!currentToken) return;
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      logout(); // Si el token es inválido, cerramos sesión
    }
  };

  // 4. Efecto para cargar el perfil del usuario si hay un token al recargar la página
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        logout();
      } else {
        fetchUserProfile(token);
      }
    }
  }, [token]); // Se ejecuta cada vez que el token cambia

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

