import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useApiConfig } from './contexts/ApiConfigContext';
import { useEffect } from 'react';
import { setApiBaseUrl } from './services/api';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotebookDetailPage from './pages/NotebookDetailPage';
import TagsPage from './pages/TagsPage';
import SettingsPage from './pages/SettingsPage';
import ApiUrlPrompt from './components/ApiUrlPrompt';

function App() {
  const { isAuthenticated } = useAuth();
  const { apiUrl, isLoading, showPrompt } = useApiConfig();

  useEffect(() => {
    if (apiUrl) {
      setApiBaseUrl(apiUrl);
    }
  }, [apiUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="text-light-text dark:text-white">Cargando...</div>
      </div>
    );
  }

  if (showPrompt) {
    return <ApiUrlPrompt />;
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      
      {/* Rutas Protegidas */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/notebooks/:notebookId" element={<ProtectedRoute><NotebookDetailPage /></ProtectedRoute>} />
      
      <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;