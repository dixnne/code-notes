// frontend/src/services/api.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => Promise.reject(error)
);

export const apiRegister = (username, email, password) => apiClient.post('/auth/register', { username, email, password });
export const apiGetProfile = () => apiClient.get('/auth/profile');
export const getNotebooks = () => apiClient.get('/notebooks');
export const createNotebook = (title) => apiClient.post('/notebooks', { title });
export const updateNotebook = (id, title) => apiClient.patch(`/notebooks/${id}`, { title });
export const deleteNotebook = (id) => apiClient.delete(`/notebooks/${id}`);
export const shareNotebook = (id, email) => apiClient.post(`/notebooks/${id}/share`, { email });

export const getNotesForNotebook = (notebookId) => apiClient.get(`/notebooks/${notebookId}/notes`);
export const createNote = (title, notebookId, type = 'markdown', folderId = null, language = 'javascript', tags = []) => {
  return apiClient.post('/notes', { title, notebookId, type, folderId, language, tags });
};
export const updateNote = (noteId, data) => apiClient.patch(`/notes/${noteId}`, data);
export const deleteNote = (noteId) => apiClient.delete(`/notes/${noteId}`);
export const getFoldersForNotebook = (notebookId) => apiClient.get(`/notebooks/${notebookId}/folders`);
export const createFolder = (name, notebookId, parentId = null) => apiClient.post('/folders', { name, notebookId, parentId });
export const deleteFolder = (folderId) => apiClient.delete(`/folders/${folderId}`);

// --- NUEVOS SERVICIOS ---
export const getAllTags = () => apiClient.get('/tags');
export const getAllNotes = (tag) => apiClient.get('/notes', { params: { tag } }); // Soporta filtro ?tag=...

export const saveApiKey = (key) => apiClient.post('/ai/api-key', { key });
export const generateText = (prompt) => apiClient.post('/ai/generate-text', { prompt });
export const summarizeText = (text) => apiClient.post('/ai/summarize', { text });
export const rewriteText = (text, style) => apiClient.post('/ai/rewrite', { text, style });
export const autoTag = (text) => apiClient.post('/ai/auto-tag', { text });

export default apiClient;