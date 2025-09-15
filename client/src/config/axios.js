import axios from 'axios';

// Configuración global
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 10000;

// Interceptor para manejar errores globalmente (opcional)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;