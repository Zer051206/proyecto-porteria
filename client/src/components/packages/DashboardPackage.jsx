/**
 * @file DashboardPackage.jsx
 * @module DashboardPackage
 * @description Página principal para la gestión de envíos y paquetes. Presenta opciones
 * claras para registrar la recepción o el envío de un paquete, y una opción para volver.
 * @component
 * @requires react
 * @requires react-router-dom/useNavigate
 * @requires @fortawesome/react-fontawesome/FontAwesomeIcon
 * @requires @fortawesome/free-solid-svg-icons/faDownload, faUpload, faArrowLeft
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore";

/**
 * @function DashboardPackageSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del DashboardPackage.
 * @returns {JSX.Element}
 */
export const DashboardPackageSkeleton = () => (
  <div className="flex flex-col items-center w-full animate-fade-in">
    <div className="bg-surface p-8 sm:p-12 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200 animate-pulse">
      {/* Esqueleto para el Título */}
      <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-10"></div>

      {/* Esqueleto para los Botones */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 w-full">
        <div className="w-full sm:w-52 h-48 bg-gray-200 rounded-lg"></div>
        <div className="w-full sm:w-52 h-48 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

/**
 * @function DashboardPackage
 * @description Renderiza la interfaz principal para la gestión de paquetes, ofreciendo
 * botones de navegación rápida para las acciones de 'Recibir' y 'Enviar' paquetes.
 *
 * @returns {JSX.Element} El elemento JSX que representa la página de gestión de envíos.
 */
export default function DashboardPackage() {
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");
  const { isLoading } = useAuthStore;

  if (isLoading) {
    return <DashboardPackageSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full sm:w-full sm:h-full text-primary transition-colors duration-300">
      <button
        type="button"
        onClick={goBack}
        className="md:absolute md:left-[150px]  md:top-[100px] mb-5 bg-surface text-text-main font-bold p-3 rounded-full shadow-sm  shadow-black md:w-1/12 w-1/2 hover:bg-background transition-colors"
        aria-label="Volver a la página de inicio"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>
      {/* Título de la página */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-14 mt-10 text-center">
        Gestión de Envíos
      </h1>

      {/* Contenedor de los "cajones" de navegación */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-5 mb-10 md:mb-0 gap-12 w-full">
        {/* Botón para Recibir Paquetes (Color Primario) */}
        <Link
          to="/paquetes/recibir"
          className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-background hover:bg-primary-light rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-neutral-200 hover:border-primary"
          aria-label="Ir a la página de registrar recepción de paquete"
        >
          <FontAwesomeIcon
            icon={faDownload}
            className="text-4xl text-primary mb-3"
          />
          <span className="text-lg font-semibold text-text-main">
            Recibir Paquete
          </span>
        </Link>

        {/* Botón para Enviar Paquetes (Color Secundario) */}
        <Link
          to="/paquetes/enviar"
          className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-background hover:bg-secondary-light rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-neutral-200 hover:border-secondary"
          aria-label="Ir a la página de registrar envío de paquete"
        >
          <FontAwesomeIcon
            icon={faUpload}
            className="text-4xl text-secondary mb-3"
          />
          <span className="text-lg font-semibold text-text-main">
            Enviar Paquete
          </span>
        </Link>
      </div>
    </div>
  );
}
