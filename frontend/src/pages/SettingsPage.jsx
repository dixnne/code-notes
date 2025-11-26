import React, { useState } from 'react';
import { saveApiKey } from '../services/api';
import { FiKey, FiAlertTriangle, FiServer } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import { useApiConfig } from '../contexts/ApiConfigContext';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { apiUrl, saveApiUrl, isNative, clearApiUrl } = useApiConfig();
  const [newApiUrl, setNewApiUrl] = useState('');
  const [showApiUrlForm, setShowApiUrlForm] = useState(false);
  const [apiUrlMessage, setApiUrlMessage] = useState('');

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (apiKey) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    setShowConfirmation(false);
    try {
      await saveApiKey(apiKey);
      setMessage({ type: 'success', text: '¡API key guardada exitosamente!' });
      setApiKey('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar la API key.' });
      console.error(error);
    }
  };

  const handleSaveApiUrl = async (e) => {
    e.preventDefault();
    setApiUrlMessage('');
    
    if (!newApiUrl.trim()) {
      setApiUrlMessage({ type: 'error', text: 'Por favor ingresa una URL válida' });
      return;
    }

    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(newApiUrl.trim())) {
      setApiUrlMessage({ type: 'error', text: 'La URL debe comenzar con http:// o https://' });
      return;
    }

    try {
      await saveApiUrl(newApiUrl);
      setApiUrlMessage({ type: 'success', text: '¡URL guardada! La app se recargará...' });
      setNewApiUrl('');
      setShowApiUrlForm(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setApiUrlMessage({ type: 'error', text: 'Error al guardar la URL.' });
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-light-text dark:text-dark-text">Configuración</h1>
        
        {/* API URL Configuration (Mobile Only) */}
        {isNative && (
          <div className="max-w-2xl mx-auto bg-light-card dark:bg-dark-card rounded-lg shadow-lg p-8 border border-black/5 dark:border-white/10 mb-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-light-text dark:text-dark-text">
              <FiServer className="mr-3 text-primary dark:text-secondary" />
              Configuración del Servidor API
            </h2>

            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
              URL actual del servidor:
            </p>
            <div className="bg-light-bg dark:bg-dark-bg p-3 rounded-lg mb-6 border border-black/10 dark:border-white/10">
              <code className="text-sm text-primary dark:text-secondary break-all">{apiUrl}</code>
            </div>

            {!showApiUrlForm ? (
              <button
                onClick={() => setShowApiUrlForm(true)}
                className="w-full py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-secondary dark:hover:bg-secondary-dark dark:focus:ring-secondary transition-all duration-300"
              >
                Cambiar URL del Servidor
              </button>
            ) : (
              <form onSubmit={handleSaveApiUrl}>
                <div className="mb-4">
                  <label htmlFor="newApiUrl" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    Nueva URL del Servidor
                  </label>
                  <input
                    type="text"
                    id="newApiUrl"
                    value={newApiUrl}
                    onChange={(e) => setNewApiUrl(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-black/10 dark:border-white/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary sm:text-sm text-light-text dark:text-dark-text"
                    placeholder="http://192.168.1.100:8080/api"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowApiUrlForm(false);
                      setNewApiUrl('');
                      setApiUrlMessage('');
                    }}
                    className="flex-1 py-3 px-6 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text dark:text-dark-text transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark dark:bg-secondary dark:hover:bg-secondary-dark transition-all"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}

            {apiUrlMessage && (
              <div className={`mt-6 p-4 rounded-lg text-sm ${apiUrlMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                {apiUrlMessage.text}
              </div>
            )}
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-light-card dark:bg-dark-card rounded-lg shadow-lg p-8 border border-black/5 dark:border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-light-text dark:text-dark-text">
            <FiKey className="mr-3 text-primary dark:text-secondary" />
            Administrar API Key de Gemini
          </h2>

          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Tu API key se guarda de forma segura y encriptada. Se utilizará para todas las funciones de IA dentro de la aplicación.
          </p>

          <form onSubmit={handleSaveClick}>
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Nueva API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-black/10 dark:border-white/10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary sm:text-sm text-light-text dark:text-dark-text"
                placeholder="Introduce tu API key aquí..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-secondary dark:hover:bg-secondary-dark dark:focus:ring-secondary transition-all duration-300"
              >
                Guardar
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl p-8 max-w-md w-full m-4 border border-black/10 dark:border-white/10">
            <div className="flex flex-col items-center text-center">
              <FiAlertTriangle className="text-5xl text-yellow-500 dark:text-yellow-400 mb-6" />
              <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">¿Estás seguro?</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
                Por motivos de seguridad, tu API key será encriptada y **no podrás recuperarla**. Si la pierdes, deberás generar una nueva y guardarla aquí de nuevo.
              </p>
              <div className="flex justify-center gap-4 w-full">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="py-3 px-6 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text dark:text-dark-text transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSave}
                  className="py-3 px-6 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:bg-secondary dark:hover:bg-secondary-dark transition-all shadow-md"
                >
                  Sí, guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
