import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, fetchProfile } from '../services/auth';
import { Preferences } from '@capacitor/preferences';

const AuthContext = createContext(null);
const TOKEN_KEY = 'token';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadToken = async () => {
      const { value } = await Preferences.get({ key: TOKEN_KEY });
      if (value) {
        try {
          const decoded = jwtDecode(value);
          if (decoded.exp * 1000 > Date.now()) {
            setToken(value);
            await fetchUserProfile(value);
          } else {
            await Preferences.remove({ key: TOKEN_KEY });
          }
        } catch (e) {
          await Preferences.remove({ key: TOKEN_KEY });
        }
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const { access_token } = response.data;
      await Preferences.set({ key: TOKEN_KEY, value: access_token });
      setToken(access_token);
      await fetchUserProfile(access_token);
      navigate('/');
      return null;
    } catch (error) {
      console.error('Error en el login:', error.response?.data);
      return error.response?.data?.message || 'Error al iniciar sesión';
    }
  };

  const register = async (username, email, password) => {
    try {
      await registerUser(username, email, password);
      navigate('/login');
      return null;
    } catch (error) {
      console.error('Error en el registro:', error.response?.data);
      return error.response?.data?.message || 'Error al registrarse';
    }
  };

  const logout = async () => {
    await Preferences.remove({ key: TOKEN_KEY });
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const fetchUserProfile = async (currentToken) => {
    if (!currentToken) return;
    try {
      const { data } = await fetchProfile();
      setUser(data);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      await logout();
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, register, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
