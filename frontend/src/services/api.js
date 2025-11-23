// frontend/src/services/api.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiRegister = (username, email, password) => apiClient.post('/auth/register', { username, email, password });
export const apiGetProfile = () => apiClient.get('/auth/profile');
export const getNotebooks = () => apiClient.get('/notebooks');
export const createNotebook = (title) => apiClient.post('/notebooks', { title });
export const getNotesForNotebook = (notebookId) => apiClient.get(`/notebooks/${notebookId}/notes`);

// --- ACTUALIZADO: createNote ahora acepta 'type' ---
export const createNote = (title, notebookId, type = 'markdown') => {
  return apiClient.post('/notes', { title, notebookId, type });
};

export const updateNote = (noteId, data) => apiClient.patch(`/notes/${noteId}`, data);
export const deleteNote = (noteId) => apiClient.delete(`/notes/${noteId}`);

export default apiClient;