import axios from 'axios';

// Crear una instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar respuestas de la API
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Verificar si la petición es para el endpoint de refresco de token
    const isRefreshRequest = originalRequest.url.includes('/auth/refresh');

    // Si la respuesta es un 401 y no es la petición de refresco
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el token de acceso
        await api.post('/auth/refresh');

        // Reintentar la petición original con el nuevo token
        return api(originalRequest);
      } catch (refreshError) {
        // Si la renovación falla, redirigir a la página de inicio de sesión
        window.location.href = '/auth-denegado';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;