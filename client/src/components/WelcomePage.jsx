/**
 * @file WelcomePage.jsx
 * @module Components
 * @description Componente que sirve como la página de inicio de la aplicación.
 * Redirige a los usuarios autenticados al dashboard y, para los no autenticados,
 * presenta la aplicación y ofrece enlaces para Iniciar Sesión o Registrarse.
 * @requires react
 * @requires react-router-dom
 * @requires ../stores/authStore.js
 * @requires @fortawesome/react-fontawesome
 */
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faUserPlus,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @function WelcomePage
 * @description Renderiza la interfaz de bienvenida. Es "inteligente": si el usuario ya está
 * autenticado, lo redirige al dashboard. De lo contrario, muestra las opciones de navegación.
 * @returns {JSX.Element}
 */
export function WelcomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Muestra un estado de carga mientras se verifica la sesión.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Verificando sesión...
        </div>
      </div>
    );
  }

  // Si el usuario ya está autenticado, lo redirige directamente al dashboard.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-gray-100 animate-fade-in">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center w-8/10 border border-gray-200">
        <div className="w-20 h-20 mb-6 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <FontAwesomeIcon
            icon={faBuilding}
            className="text-3xl text-blue-600"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Sistema de Portería
        </h1>

        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Gestión centralizada de visitas y paquetes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mt-10 w-full">
          <Link
            to="/auth/login"
            className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-gray-50 hover:bg-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            aria-label="Ir a la página de inicio de sesión"
          >
            <FontAwesomeIcon
              icon={faDoorOpen}
              className="text-4xl text-blue-600 mb-3"
            />
            <span className="text-lg font-semibold text-gray-800">
              Iniciar Sesión
            </span>
          </Link>

          <Link
            to="/auth/register"
            className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-gray-50 hover:bg-green-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-green-500"
            aria-label="Ir a la página de registro"
          >
            <FontAwesomeIcon
              icon={faUserPlus}
              className="text-4xl text-green-600 mb-3"
            />
            <span className="text-lg font-semibold text-gray-800">
              Registrarse
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
