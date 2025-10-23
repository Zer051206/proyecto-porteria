/**
 * @file DashboardHistorial.jsx
 * @module Components/Dashboard/Historial
 * @description Componente de página que funciona como un menú para acceder al historial de registros de
 * diferentes categorías (Visitas y Paquetes).
 * @exports DashboardHistorial
 * @requires react
 * @requires react-router-dom - Para la navegación.
 * @requires @fortawesome/react-fontawesome - Para la renderización de íconos.
 * @requires @fortawesome/free-solid-svg-icons - Íconos sólidos utilizados (faBoxesPacking, faArrowLeft, faUserClock).
 */
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  faArrowLeft,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore";

/**
 * @function DashboardHistorialSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del DashboardHistorial.
 * @returns {JSX.Element}
 */
export const DashboardHistorialSkeleton = () => (
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
 * @function DashboardHistorial
 * @description Renderiza el menú de opciones para ver el historial de registros.
 * Ofrece enlaces directos para el historial de Visitas y Paquetes, y una opción para volver.
 * @returns {JSX.Element} El componente de menú de historial.
 */
export default function DashboardHistorial() {
  /**
   * @type {Function}
   * Función para la navegación programática de React Router DOM.
   * */
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");
  const { isLoading } = useAuthStore;

  if (isLoading) {
    return <DashboardHistorialSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full sm:w-full sm:h-full transition-colors duration-300">
      <button
        type="button"
        onClick={goBack}
        className="md:absolute md:left-[150px]  md:top-[100px] mb-5 bg-surface text-text-main font-bold p-3 rounded-full shadow-sm  shadow-black md:w-1/12 w-1/2 hover:bg-background transition-colors"
        aria-label="Volver a la página de inicio"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>
      <h1 className="text-4xl sm:text-5xl font-bold mb-14 mt-10 text-center text-primary">
        Historial de Registros
      </h1>

      {/* Contenedor de los "cajones" de navegación */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 w-full">
        {/* Botón para Historial de Visitas (Color Primario) */}
        <Link
          to="/historial/visitas"
          className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-background hover:bg-secondary-light rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-neutral-200 hover:border-secondary"
          aria-label="Ir al historial de visitas"
        >
          <FontAwesomeIcon
            icon={faUserClock}
            className="text-4xl text-secondary mb-3"
          />
          <span className="text-lg font-semibold text-text-main">
            Historial de Visitas
          </span>
        </Link>

        {/* Botón para Historial de Paquetes (Color Secundario) */}
        <Link
          to="/historial/paquetes"
          className="flex flex-col items-center justify-center p-8 w-full sm:w-52 h-48 bg-background hover:bg-primary-light rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-2 border-neutral-200 hover:border-primary"
          aria-label="Ir al historial de paquetes"
        >
          <FontAwesomeIcon
            icon={faBoxesPacking}
            className="text-4xl text-primary mb-3"
          />
          <span className="text-lg font-semibold text-text-main">
            Historial de Paquetes
          </span>
        </Link>
      </div>
    </div>
  );
}
