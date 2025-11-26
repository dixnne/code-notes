import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaNoteSticky } from 'react-icons/fa6';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light-bg dark:bg-gradient-to-br from-dark-bg to-[#111620]">
        <FaNoteSticky className="text-primary text-6xl animate-pulse" />
        <h1 className="text-4xl font-bold font-display text-light-text dark:text-white mt-4">
          Code<span className="text-primary">Notes</span>
        </h1>
        <p className="text-light-text-secondary dark:text-gray-400 mt-2">Verificando tu sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
