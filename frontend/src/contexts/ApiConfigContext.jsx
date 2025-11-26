// frontend/src/contexts/ApiConfigContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const ApiConfigContext = createContext(null);

const API_URL_KEY = 'api_url';

export const ApiConfigProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    loadApiUrl();
  }, []);

  const loadApiUrl = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const { value } = await Preferences.get({ key: API_URL_KEY });
        console.log('[Debug] Loaded API URL from Preferences:', value);
        if (value) {
          setApiUrl(value);
        } else {
          setShowPrompt(true);
        }
      } catch (error) {
        console.error('Error loading API URL:', error);
        setShowPrompt(true);
      }
    } else {
      setApiUrl(import.meta.env.VITE_API_URL || 'http://localhost:8080/api');
    }
    setIsLoading(false);
  };

  const saveApiUrl = async (url) => {
    const formattedUrl = url.trim().replace(/\/+$/, '');
    
    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.set({ key: API_URL_KEY, value: formattedUrl });
        setApiUrl(formattedUrl);
        setShowPrompt(false);
      } catch (error) {
        console.error('Error saving API URL:', error);
        throw error;
      }
    } else {
      setApiUrl(formattedUrl);
    }
  };

  const clearApiUrl = async () => {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: API_URL_KEY });
    }
    setApiUrl(null);
    setShowPrompt(true);
  };

  return (
    <ApiConfigContext.Provider value={{ 
      apiUrl, 
      saveApiUrl, 
      clearApiUrl, 
      isLoading, 
      showPrompt,
      isNative: Capacitor.isNativePlatform()
    }}>
      {children}
    </ApiConfigContext.Provider>
  );
};

export const useApiConfig = () => {
  return useContext(ApiConfigContext);
};
