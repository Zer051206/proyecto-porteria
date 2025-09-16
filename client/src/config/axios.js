import axios from 'axios';

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Importante para cookies
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de respuesta para manejar refresh token automático
api.interceptors.response.use(
  // Respuesta exitosa, pasarla tal como está
  (response) => response,
  
  // Error en la respuesta
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest._noRetry) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el token
        await api.post('/auth/refresh', null, { _noRetry: true });
        
        // Reintentar la petición original
        return api(originalRequest);
        
      } catch (refreshError) {
        // Si no se puede renovar, redirigir al login
         return Promise.reject({
          status: 401,
          needsLogin: true 
        });
      }
    }

    // Si es otro tipo de error, o ya intentamos renovar, rechazar
    return Promise.reject(error);
  }
);

// Interceptor de petición para debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Haciendo petición ${config.method?.toUpperCase()} a ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;