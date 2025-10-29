/**
 * @file WelcomePage.jsx
 * @module components/WelcomePage.jsx
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
 * @function WelcomePageSkeleton
 * @description Componente de esqueleto de carga que imita la estructura de WelcomePage.
 * @returns {JSX.Element}
 */
const WelcomePageSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-background animate-pulse">
    <div className="bg-surface p-8 sm:p-12 rounded-xl shadow-lg text-center w-full max-w-2xl border border-gray-200">
      {/* Esqueleto del Logo */}
      <div className="w-20 h-20 mb-6 bg-gray-200 rounded-full mx-auto"></div>

      {/* Esqueleto del Título */}
      <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>

      {/* Esqueleto del Subtítulo */}
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>

      {/* Esqueleto de los Botones */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mt-10 w-full">
        <div className="w-full sm:w-52 h-48 bg-gray-200 rounded-lg"></div>
        <div className="w-full sm:w-52 h-48 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

/**
 * @function WelcomePage
 * @description Renderiza la interfaz de bienvenida. Es "inteligente": si el usuario ya está
 * autenticado, lo redirige al dashboard. De lo contrario, muestra las opciones de navegación.
 * @returns {JSX.Element}
 */
export function WelcomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <WelcomePageSkeleton />;
  }

  // Si el usuario ya está autenticado, lo redirige directamente al dashboard.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-background animate-fade-in">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center md:w-10/12 w-11/12 border border-gray-200">
        <div className="w-20 h-20 mb-6 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <FontAwesomeIcon
            icon={faBuilding}
            className="text-3xl text-primary"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
          Sistema de Portería
        </h1>

        <p className="text-lg text-secondary font-semibold max-w-lg mx-auto">
          Gestión centralizada de visitas y paquetes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mt-10 w-full">
          <Link
            to="/auth/login"
            className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-background hover:bg-primary-light rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-neutral-200 hover:border-primary"
            aria-label="Ir a la página de inicio de sesión"
          >
            <FontAwesomeIcon
              icon={faDoorOpen}
              className="text-4xl text-primary mb-3"
            />
            <span className="text-lg font-semibold text-text-main">
              Iniciar Sesión
            </span>
          </Link>

          <Link
            to="/auth/register"
            className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-background hover:bg-secondary-light rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-neutral-200 hover:border-secondary-hover"
            aria-label="Ir a la página de registro"
          >
            <FontAwesomeIcon
              icon={faUserPlus}
              className="text-4xl text-secondary mb-3"
            />
            <span className="text-lg font-semibold text-text-main">
              Registrarse
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
