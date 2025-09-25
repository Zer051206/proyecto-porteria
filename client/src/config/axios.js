import axios from "axios";
import Cookies from "js-cookie";

// Crear una instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const csrfRequiredMethods = ["post", "put", "patch", "delete"];
    const method = config.method ? config.method.toLowerCase() : "get";

    if (csrfRequiredMethods.includes(method)) {
      // Usa la librería 'js-cookie' para leer la cookie
      const csrfToken = Cookies.get("csrf-token");

      if (csrfToken) {
        // Inyecta el token en el header que el backend espera
        config.headers["X-CSRF-Token"] = csrfToken;
      } else {
        console.warn(
          "CSRF token missing. This request might be rejected by the server."
        );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de la API
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Verificar si la petición es para el endpoint de refresco de token
    const isRefreshRequest = originalRequest.url.includes("/auth/refresh");

    // Si la respuesta es un 401 y no es la petición de refresco
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el token de acceso
        await api.post("/auth/refresh");

        // Reintentar la petición original con el nuevo token
        return api(originalRequest);
      } catch (refreshError) {
        // Si la renovación falla, redirigir a la página de inicio de sesión
        window.location.href = "/auth-denegado";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
