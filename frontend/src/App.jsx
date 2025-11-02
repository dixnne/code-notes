// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotebookDetailPage from './pages/NotebookDetailPage'; // 1. Importar la nueva página

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
      />
      
      {/* Rutas Protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      {/* 2. Añadir la nueva ruta protegida para el detalle del notebook */}
      <Route
        path="/notebooks/:notebookId"
        element={
          <ProtectedRoute>
            <NotebookDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

