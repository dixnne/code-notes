// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotebookDetailPage from './pages/NotebookDetailPage';
import TagsPage from './pages/TagsPage'; // 1. Importar nueva página

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      
      {/* Rutas Protegidas */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/notebooks/:notebookId" element={<ProtectedRoute><NotebookDetailPage /></ProtectedRoute>} />
      
      {/* 2. Añadir ruta de Tags */}
      <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;