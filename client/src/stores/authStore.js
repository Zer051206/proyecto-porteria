/**
 * @file authStore.js
 * @module Stores
 * @description Store de Zustand para gestionar el estado y las acciones de autenticación global.
 * Se encarga de la persistencia de la sesión en localStorage y la revalidación.
 * @requires zustand
 * @requires ../config/axios.js
 */
import { create } from "zustand";
import api from "../config/axios.js";

/**
 * @function getInitialState
 * @description Lee el estado inicial desde localStorage para una carga instantánea de la sesión.
 * @returns {object} El estado inicial del store.
 */
const getInitialState = () => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      return { isAuthenticated: true, user: JSON.parse(user), isLoading: true };
    }
  } catch (error) {
    localStorage.clear();
  }
  return { isAuthenticated: false, user: null, isLoading: true };
};

/**
 * @const useAuthStore
 * @description Hook de Zustand que proporciona el estado y las acciones de autenticación.
 */
export const useAuthStore = create((set, get) => ({
  ...getInitialState(),

  /**
   * @function login
   * @description Guarda los datos del usuario y los tokens en el estado y en localStorage.
   * @param {object} userData - Datos del usuario.
   * @param {string} accessToken - Token de acceso.
   * @param {string} refreshToken - Token de refresco.
   */
  login: (userData, accessToken, refreshToken) => {
    set({ isAuthenticated: true, user: userData, isLoading: false });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  /**
   * @async
   * @function logout
   * @description Cierra la sesión, invalida el token en el backend y limpia el estado/localStorage.
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Error al cerrar sesión en el backend:", error);
    } finally {
      localStorage.clear();
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  /**
   * @async
   * @function checkAuthStatus
   * @description Revalida la sesión con el backend al cargar la aplicación.
   */
  checkAuthStatus: async () => {
    if (!localStorage.getItem("accessToken")) {
      return set({ isAuthenticated: false, user: null, isLoading: false });
    }
    try {
      const response = await api.get("/auth/me");
      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Fallo en la verificación de la sesión.");
      get().logout();
    }
  },
}));
