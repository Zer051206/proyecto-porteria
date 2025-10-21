/**
 * @file DashboardPage.jsx
 * @module DashboardPage
 * @description Componente principal que sirve como la página de inicio para los usuarios autenticados.
 * Muestra las visitas activas y proporciona enlaces de navegación a las principales funcionalidades de la aplicación.
 * @component
 * @requires react
 * @requires react-router-dom/useNavigate
 * @requires ../hooks/useDashboard
 * @requires ../hooks/auth/useAuthLogout
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBox,
  faHistory,
  faExclamationTriangle,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import useDashboard from "../hooks/useDashboard.js";
import { formatDate } from "../utils/dateFormat.js";

const ActiveVisitsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md animate-pulse">
    <div className="p-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
    <div className="p-4 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4 items-center">
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-8 bg-gray-200 rounded col-span-1"></div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * @function ActiveVisitsTable
 * @description Subcomponente que muestra una tabla de todas las visitas actualmente registradas como "activas" (sin hora de salida).
 * Maneja la lógica de carga, errores y la confirmación para finalizar una visita.
 *
 * @returns {JSX.Element} La tabla de visitas activas o un mensaje de estado (cargando/error).
 */
const ActiveVisitsTable = ({
  activeVisits,
  isLoading,
  error,
  showModal,
  selectedVisit,
  handleEndVisit,
  handleConfirmEndVisit,
  handleCloseModal,
}) => {
  console.log(activeVisits);

  if (isLoading) {
    return <ActiveVisitsSkeleton />;
  }

  if (error) {
    return (
      <div className="px-4 py-5 bg-gray-800">
        <div className="bg-red-100 border-l-4 font-semibold border-red-500 text-red-700 p-4 my-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="mr-2 text-xl"
            />
            <p className="font-bold text-lg">Error de Carga</p>
          </div>
          <p className="text-lg mr-[20px]">{error}</p>
        </div>
      </div>
    );
  }

  if (activeVisits.length === 0) {
    return (
      <div className="text-center bg-gray-800 text-gray-400 py-6 rounded-lg shadow-lg">
        <p className="text-xl font-medium">
          No hay visitas activas en este momento.
        </p>
        <p className="text-sm mt-1">
          Utiliza el botón "Nueva Visita" para registrar una entrada.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-3 py-[8px] md:px-5 md:py-3 border-2 border-gray-300 bg-gray-50 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Nombre del Visitante
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-gray-300 bg-gray-50 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Identificacion
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-gray-300 bg-gray-50 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Destinatario
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-gray-300 bg-gray-50 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Área de destino
                </th>
                <th className="px-5 py-[10px] md:px-5 md:py-3 border-2 border-gray-300 bg-gray-50 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Hora De Entrada
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-gray-300 bg-gray-50 text-center text-xs font-bold text-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {activeVisits.map((visit) => (
                <tr key={visit.id_visita}>
                  <td className="md:px-3 md:py-1 font-semibold border border-gray-300 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.nombre_visitante}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-gray-300 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.identificacion || "N/A"}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-gray-300 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.nombre_destinatario}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-gray-300 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.Area?.nombre_area}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-gray-300 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {formatDate(visit.fecha_entrada)}
                    </p>
                  </td>
                  <td className="px-3 py-1 font-semibold border border-gray-300 bg-white text-sm text-center">
                    <button
                      onClick={() => handleEndVisit(visit)}
                      className="bg-red-500 hover:bg-red-700 text-xs text-white font-bold py-1 px-2 rounded flex items-center justify-center mx-auto"
                    >
                      <FontAwesomeIcon
                        icon={faExternalLinkAlt}
                        className="mr-1"
                      />
                      Salida
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmación para finalizar visita */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800/80 flex items-center justify-center">
          <div className="text-white bg-gray-800 rounded-lg p-8 w-screen md:w-1/3 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar Finalización</h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas finalizar la visita de{" "}
              <span className="font-bold text-red-400">
                {selectedVisit?.nombre_visitante}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-400 hover:bg-gray-600 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmEndVisit}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * @function DashboardPage
 * @description Contenedor principal del dashboard. Combina la navegación rápida y la tabla de visitas activas.
 *
 * @returns {JSX.Element} El elemento JSX que representa el Dashboard.
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const dashboardHook = useDashboard();

  return (
    <div className="flex flex-col justify-items-center min-h-screen w-full">
      <div className="w-full justify-items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-12 mt-6 text-center">
          Gestión de Visitas y Paquetes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-14">
          {/* Botón Nueva Visita */}
          <button
            onClick={() => navigate("/visitas/entrada")}
            className="flex flex-col items-center justify-center p-6 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="text-3xl mb-2" />
            <span className="font-semibold text-lg">Nueva Visita</span>
          </button>

          {/* Botón de Paquetes */}
          <button
            onClick={() => navigate("/paquetes")}
            className="flex flex-col items-center justify-center p-6 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-colors"
          >
            <FontAwesomeIcon icon={faBox} className="text-3xl mb-2" />
            <span className="font-semibold text-lg">Paquetes</span>
          </button>

          {/* Botón de Historial */}
          <button
            onClick={() => navigate("/historial")}
            className="flex flex-col items-center justify-center p-6 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition-colors"
          >
            <FontAwesomeIcon icon={faHistory} className="text-3xl mb-2" />
            <span className="font-semibold text-lg">Historial</span>
          </button>
        </div>
        {/* Contenedor de la tabla de visitas activas */}
        <div className="w-full h-full">
          <ActiveVisitsTable {...dashboardHook} />
        </div>
      </div>
    </div>
  );
}
