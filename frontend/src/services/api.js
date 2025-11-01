// frontend/src/services/api.js
import axios from 'axios';

// 1. Creamos una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Nuestra URL base de la API
});

// 2. Creamos un "interceptor"
// Esto es una función que se ejecuta ANTES de que se envíe cada petición
api.interceptors.request.use(
  (config) => {
    // 3. Obtenemos el token de localStorage
    const token = localStorage.getItem('token');
    
    // 4. Si el token existe, lo añadimos al header de autorización
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Manejamos errores en la petición
    return Promise.reject(error);
  }
);

export default api;
