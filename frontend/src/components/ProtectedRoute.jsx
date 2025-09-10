// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Si no hay token, redirigir al usuario a la página de login
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
