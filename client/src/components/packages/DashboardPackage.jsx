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
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

/**
 * @function DashboardPackage
 * @description Renderiza la interfaz principal para la gestión de paquetes, ofreciendo
 * botones de navegación rápida para las acciones de 'Recibir' y 'Enviar' paquetes.
 *
 * @returns {JSX.Element} El elemento JSX que representa la página de gestión de envíos.
 */
export default function DashboardPackage() {
  /**
   * @const {Function} navigate
   * @description Hook de React Router para la navegación programática entre rutas.
   */
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full sm:w-full sm:h-full text-blue-700 transition-colors duration-300">
      {/* Título de la página */}
      <h1 className="text-4xl sm:text-6xl font-bold mb-10 text-center">
        Gestión de Envíos
      </h1>

      {/* Contenedor de botones de acción rápida */}
      <div className="flex space-x-8 w-screen justify-center  sm:space-x-20">
        {/* Botón para Recibir Paquetes */}
        <button
          onClick={() => navigate("/paquetes/recibir")}
          className="flex flex-col items-center justify-center w-[180px] text-xl sm:text-2xl h-[145px] ml-[20px] sm:w-48 sm:h-48 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg shadow-lg  shadow-black transform hover:scale-105 transition-transform duration-200"
        >
          <FontAwesomeIcon icon={faDownload} className="text-5xl mb-4" />
          <span className="text-lg">Recibir</span>
        </button>

        {/* Botón para Enviar/Entregar Paquetes */}
        <button
          onClick={() => navigate("/paquetes/enviar")}
          className="flex flex-col items-center justify-center w-[180px] text-xl sm:text-2xl h-[145px] mr-[20px] sm:w-48 sm:h-48 bg-green-800 hover:bg-green-900 text-white font-bold rounded-lg shadow-lg shadow-black transform hover:scale-105 transition-transform duration-200"
        >
          <FontAwesomeIcon icon={faUpload} className="text-5xl mb-4" />
          <span className="text-lg">Enviar</span>
        </button>
      </div>

      {/* Botón de Volver al Dashboard Principal */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-10 px-6 py-4 flex items-center text-lg sm:text-2xl bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="mr-2 text-lg sm:text-2xl"
        />
        Volver
      </button>
    </div>
  );
}
