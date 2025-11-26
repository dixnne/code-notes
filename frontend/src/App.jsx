import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useApiConfig } from './contexts/ApiConfigContext';
import { useEffect } from 'react';
import { initializeApi } from './services/auth'; // Importamos la nueva función
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotebookDetailPage from './pages/NotebookDetailPage';
import TagsPage from './pages/TagsPage';
import SettingsPage from './pages/SettingsPage';
import ApiUrlPrompt from './components/ApiUrlPrompt';
import { FaNoteSticky } from 'react-icons/fa6';

// Un componente de carga más atractivo
const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-light-bg dark:bg-gradient-to-br from-dark-bg to-[#111620]">
    <FaNoteSticky className="text-primary text-6xl animate-pulse" />
    <h1 className="text-4xl font-bold font-display text-light-text dark:text-white mt-4">
      Code<span className="text-primary">Notes</span>
    </h1>
    <p className="text-light-text-secondary dark:text-gray-400 mt-2">Cargando tu espacio de trabajo...</p>
  </div>
);

function App() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { apiUrl, isLoading: isApiLoading, showPrompt } = useApiConfig();

  useEffect(() => {
    if (apiUrl) {
      initializeApi(apiUrl); // Usamos la función centralizada
    }
  }, [apiUrl]);

  // Mostramos splash screen mientras se carga la config de API o la sesión del usuario
  if (isApiLoading || isAuthLoading) {
    return <SplashScreen />;
  }

  // Si no hay URL de API, forzamos la configuración
  if (showPrompt) {
    return <ApiUrlPrompt />;
  }
  
  // Lógica de enrutamiento principal
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/notebooks/:notebookId" element={<ProtectedRoute><NotebookDetailPage /></ProtectedRoute>} />
      <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;