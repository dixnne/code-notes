// frontend/src/services/api.js
import axios from 'axios';

// Creamos una instancia de axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Nuestra URL base de Nginx
});

// --- Interceptor de Petición ---
// Adjuntamos el token a CADA petición saliente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Servicios de Autenticación ---
export const login = (email, password) => apiClient.post('/auth/login', { email, password });
export const register = (username, email, password) => apiClient.post('/auth/register', { username, email, password });
export const getProfile = () => apiClient.get('/auth/profile');

// --- Servicios de Notebooks ---
export const getNotebooks = () => apiClient.get('/notebooks');
export const createNotebook = (title) => apiClient.post('/notebooks', { title });

// --- Servicios de Notas ---
export const getNotesForNotebook = (notebookId) => apiClient.get(`/notebooks/${notebookId}/notes`);
export const createNote = (title, notebookId) => apiClient.post('/notes', { title, notebookId });

// --- CORRECCIÓN AQUÍ ---
// Cambiamos .put() por .patch() para que coincida con el backend
export const updateNote = (id, data) => apiClient.patch(`/notes/${id}`, data);

export const deleteNote = (id) => apiClient.delete(`/notes/${id}`);

// Exportamos la instancia por defecto para el AuthContext
export default apiClient;

