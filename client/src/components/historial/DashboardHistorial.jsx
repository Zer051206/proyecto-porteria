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
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  faArrowLeft,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";

/**
 * @function DashboardHistorial
 * @description Renderiza el menú de opciones para ver el historial de registros.
 * Ofrece enlaces directos para el historial de Visitas y Paquetes, y una opción para volver.
 * @returns {JSX.Element} El componente de menú de historial.
 */
export default function DashboardHistorial() {
  /** @type {Function} Función para la navegación programática de React Router DOM. */
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full sm:w-full sm:h-full text-blue-700 transition-colors duration-300">
      <h1 className="text-4xl sm:text-6xl font-bold mb-10 text-center">
        Historial de Registros
      </h1>

      <div className="flex space-x-8 w-screen justify-center  sm:space-x-20">
        {/* Botón para Historial de Visitas */}
        <button
          /** @property {string} path - Navega a la ruta para el historial de visitas. */
          onClick={() => navigate("/historial/visitas")}
          className="flex flex-col items-center justify-center w-[180px] text-xl sm:text-2xl h-[145px] ml-[20px] sm:w-48 sm:h-48 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-lg  shadow-black transform hover:scale-105 transition-transform duration-200"
        >
          {/* Icono: faUserClock (Representa Visitas/Registro de Tiempo) */}
          <FontAwesomeIcon icon={faUserClock} className="text-5xl mb-4" />
          <span className="text-lg">Visitas</span>
        </button>

        {/* Botón para Historial de Paquetes */}
        <button
          /** @property {string} path - Navega a la ruta para el historial de paquetes. */
          onClick={() => navigate("/historial/paquetes")}
          className="flex flex-col items-center justify-center w-[180px] text-xl sm:text-2xl h-[145px] mr-[20px] sm:w-48 sm:h-48 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg shadow-lg shadow-black transform hover:scale-105 transition-transform duration-200"
        >
          {/* Icono: faBoxesPacking (Representa Paquetes/Inventario) */}
          <FontAwesomeIcon icon={faBoxesPacking} className="text-5xl mb-4" />
          <span className="text-lg">Paquetes</span>
        </button>
      </div>

      {/* Botón Volver (Navega al Dashboard principal) */}
      <button
        /** @property {string} path - Navega de vuelta a la ruta principal del dashboard. */
        onClick={() => navigate("/dashboard")}
        className="mt-10 px-6 py-4 flex items-center text-lg sm:text-2xl bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
      >
        {/* Icono: faArrowLeft (Representa Volver) */}
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="mr-2 text-lg sm:text-2xl"
        />
        Volver
      </button>
    </div>
  );
}
