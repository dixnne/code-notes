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

// Notas
export const getNotesForNotebook = (notebookId) => apiClient.get(`/notebooks/${notebookId}/notes`);
export const createNote = (title, notebookId, type = 'markdown', folderId = null, language = 'javascript') => {
  return apiClient.post('/notes', { title, notebookId, type, folderId, language });
};
export const updateNote = (noteId, data) => apiClient.patch(`/notes/${noteId}`, data);
export const deleteNote = (noteId) => apiClient.delete(`/notes/${noteId}`);

// Carpetas
export const getFoldersForNotebook = (notebookId) => apiClient.get(`/notebooks/${notebookId}/folders`);

// --- ACTUALIZADO: createFolder acepta parentId ---
export const createFolder = (name, notebookId, parentId = null) => apiClient.post('/folders', { name, notebookId, parentId });

export const deleteFolder = (folderId) => apiClient.delete(`/folders/${folderId}`);

export default apiClient;