// frontend/src/services/auth.js
import { apiClient, setApiBaseUrl } from './api';

// Esta función ahora será la única responsable de configurar la URL base.
export const initializeApi = (apiUrl) => {
  setApiBaseUrl(apiUrl);
};

export const registerUser = (username, email, password) => {
  return apiClient.post('/auth/register', { username, email, password });
};

export const loginUser = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const fetchProfile = () => {
  return apiClient.get('/auth/profile');
};
