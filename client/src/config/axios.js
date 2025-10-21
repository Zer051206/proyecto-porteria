/**
 * @file axios.js
 * @module Config
 * @description Configuración de la instancia de Axios con interceptores para el manejo de tokens.
 * @requires axios
 */
import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // Se mantiene por si se usan cookies para otras cosas en el futuro
  timeout: 10000,
});

/**
 * @description Interceptor de Petición: Añade el accessToken del localStorage a la cabecera 'Authorization'.
 */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @description Interceptor de Respuesta: Maneja los errores 401 para renovar el token de acceso.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        // --- ¡CORRECCIÓN CLAVE! ---
        // Se envía el refreshToken en el cuerpo de la petición POST.
        const res = await api.post("/auth/refresh", { refreshToken });
        const { accessToken: newAccessToken } = res.data;

        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
