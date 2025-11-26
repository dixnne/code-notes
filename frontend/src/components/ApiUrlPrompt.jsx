// frontend/src/components/ApiUrlPrompt.jsx
import React, { useState } from 'react';
import { useApiConfig } from '../contexts/ApiConfigContext';
import { FaNoteSticky } from 'react-icons/fa6';
import { FiServer } from 'react-icons/fi';

const ApiUrlPrompt = () => {
  const { saveApiUrl } = useApiConfig();
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!url.trim()) {
      setError('Por favor ingresa una URL válida');
      return;
    }

    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url.trim())) {
      setError('La URL debe comenzar con http:// o https://');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveApiUrl(url);
    } catch (err) {
      setError('Error al guardar la URL. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-gradient-to-br from-dark-bg to-[#111620] p-4">
      <div className="w-full max-w-md">
        <div className="bg-light-card dark:bg-dark-card/60 shadow-xl rounded-lg p-8 backdrop-blur-sm border border-black/10 dark:border-white/10">
          <div className="flex justify-center items-center mb-6">
            <FaNoteSticky className="text-primary text-4xl" />
            <h1 className="text-3xl font-bold font-display text-light-text dark:text-white ml-2">
              Code<span className="text-primary">Notes</span>
            </h1>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-light-text dark:text-white mb-2">
            Configuración API
          </h2>
          
          <p className="text-center text-light-text-secondary dark:text-gray-400 mb-6 text-sm">
            Ingresa la URL de tu servidor API para conectarte
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiServer className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-gray-400" />
              <input
                type="text"
                placeholder="http://192.168.1.100:8080/api"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2 bg-light-bg dark:bg-dark-bg border border-black/20 dark:border-white/20 rounded-md text-light-text dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
            
            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-accent1 hover:bg-accent1/90 text-dark-bg font-bold rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Continuar'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-light-bg dark:bg-dark-bg/50 rounded-md border border-black/10 dark:border-white/10">
            <p className="text-xs text-light-text-secondary dark:text-gray-400">
              <strong>Ejemplo:</strong> Si tu servidor está en la misma red local, usa algo como:
              <br />
              <code className="text-primary">http://192.168.1.10:8080/api</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiUrlPrompt;
