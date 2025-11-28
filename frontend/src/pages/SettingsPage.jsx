import React, { useState } from 'react';
import { saveApiKey } from '../services/api';
import { FiKey, FiAlertTriangle, FiServer, FiSave, FiX, FiCheck } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import { useApiConfig } from '../contexts/ApiConfigContext';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { apiUrl, saveApiUrl, isNative } = useApiConfig();
  const [newApiUrl, setNewApiUrl] = useState('');
  const [showApiUrlForm, setShowApiUrlForm] = useState(false);
  const [apiUrlMessage, setApiUrlMessage] = useState(null);

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
      setMessage({ type: 'success', text: 'API key guardada exitosamente' });
      setApiKey('');
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar la API key' });
      console.error(error);
    }
  };

  const handleSaveApiUrl = async (e) => {
    e.preventDefault();
    setApiUrlMessage(null);
    
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
      setApiUrlMessage({ type: 'success', text: 'URL guardada. Reiniciando...' });
      setNewApiUrl('');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setApiUrlMessage({ type: 'error', text: 'Error al guardar la URL' });
      console.error(error);
    }
  };

  // Clases comunes para inputs y botones
  const inputClasses = "mt-1 block w-full rounded-lg border border-light-text-secondary/20 bg-light-bg px-4 py-3 text-light-text placeholder-light-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary dark:border-dark-text-secondary/20 dark:bg-dark-bg dark:text-dark-text dark:focus:border-accent1 dark:focus:ring-accent1 transition-colors outline-none";
  const btnPrimaryClasses = "inline-flex justify-center items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-95 shadow-md dark:bg-accent1 dark:hover:bg-accent1/90";
  const btnSecondaryClasses = "inline-flex justify-center items-center gap-2 rounded-lg bg-light-bg px-6 py-3 text-sm font-medium text-light-text-secondary transition-all hover:bg-gray-200 active:scale-95 dark:bg-dark-bg dark:text-dark-text-secondary dark:hover:bg-gray-700";

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <header className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">
            Configuración
            </h1>
            <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
            Gestiona tus preferencias y conexiones.
            </p>
        </header>
        
        {/* Sección: Configuración del Servidor (Solo Móvil/Nativo) */}
        {isNative && (
          <section className="mb-8 overflow-hidden rounded-xl bg-light-card shadow-lg border border-black/5 dark:bg-dark-card dark:border-white/5">
            <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-light-text dark:text-dark-text">
                        <FiServer className="text-accent1" />
                        Servidor API
                        </h2>
                        <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Configura la dirección del servidor backend.
                        </p>
                    </div>
                </div>

                <div className="bg-light-bg/50 dark:bg-dark-bg/50 p-4 rounded-lg border border-black/5 dark:border-white/5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="overflow-hidden">
                        <span className="text-xs font-bold uppercase tracking-wider text-light-text-secondary/70 dark:text-dark-text-secondary/70 block mb-1">URL Actual</span>
                        <code className="text-sm font-mono text-primary dark:text-accent1 block truncate" title={apiUrl}>{apiUrl}</code>
                    </div>
                    {!showApiUrlForm && (
                        <button
                            onClick={() => setShowApiUrlForm(true)}
                            className="text-sm font-medium text-primary hover:text-primary/80 dark:text-accent1 dark:hover:text-accent1/80 whitespace-nowrap"
                        >
                            Cambiar URL
                        </button>
                    )}
                </div>

                {showApiUrlForm && (
                <form onSubmit={handleSaveApiUrl} className="animate-fade-in bg-light-bg dark:bg-dark-bg p-6 rounded-xl border border-primary/20 dark:border-accent1/20">
                    <div className="mb-4">
                    <label htmlFor="newApiUrl" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                        Nueva URL del Servidor
                    </label>
                    <input
                        type="text"
                        id="newApiUrl"
                        value={newApiUrl}
                        onChange={(e) => setNewApiUrl(e.target.value)}
                        className={inputClasses}
                        placeholder="http://192.168.1.100:8080/api"
                        autoFocus
                    />
                    </div>
                    
                    {apiUrlMessage && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${apiUrlMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {apiUrlMessage.type === 'success' ? <FiCheck /> : <FiAlertTriangle />}
                            {apiUrlMessage.text}
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => {
                            setShowApiUrlForm(false);
                            setNewApiUrl('');
                            setApiUrlMessage(null);
                            }}
                            className={btnSecondaryClasses}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={btnPrimaryClasses}
                        >
                            <FiSave /> Guardar URL
                        </button>
                    </div>
                </form>
                )}
            </div>
          </section>
        )}

        {/* Sección: API Key de Gemini */}
        <section className="rounded-xl bg-light-card shadow-lg border border-black/5 dark:bg-dark-card dark:border-white/5 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary shrink-0">
                    <FiKey size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                        API Key de Inteligencia Artificial
                    </h2>
                    <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                        Para utilizar las funciones de investigación y autocompletado con IA, necesitas configurar tu clave personal de Gemini. Esta clave se almacena de forma segura en tu dispositivo.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSaveClick} className="w-full">
                <div className="mb-6">
                <label htmlFor="apiKey" className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                    Ingresar Clave API
                </label>
                <div className="relative">
                    <input
                        type="password"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className={inputClasses}
                        placeholder="sk-..."
                    />
                </div>
                </div>
                
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'}`}>
                        {message.type === 'success' ? <FiCheck size={18} /> : <FiAlertTriangle size={18} />}
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!apiKey}
                        className={`${btnPrimaryClasses} ${!apiKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <FiSave /> Guardar Configuración
                    </button>
                </div>
            </form>
          </div>
        </section>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-2xl p-6 md:p-8 max-w-sm w-full border border-black/10 dark:border-white/10 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                  <FiAlertTriangle className="text-3xl text-yellow-600 dark:text-yellow-500" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">¿Confirmar guardado?</h3>
              
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
                La API key se guardará localmente. Asegúrate de que nadie más tenga acceso a este dispositivo.
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className={btnSecondaryClasses}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSave}
                  className={btnPrimaryClasses}
                >
                  Confirmar
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