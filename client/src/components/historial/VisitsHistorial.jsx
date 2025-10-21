/**
 * @file VisitHistoryTable.jsx
 * @module Components/VisitHistory/VisitsHistorial
 * @description Componente de página que muestra el historial completo de visitas en una tabla.
 * Proporciona funcionalidad de búsqueda, manejo de estados (carga/error), y un modal
 * para visualizar los detalles completos de cada registro.
 * @exports VisitsHistorial
 * @requires react
 * @requires ../../hooks/useGoBackDashboard - Hook para la función de volver.
 * @requires ../../hooks/historial/useVisitsHistorial - Hook de lógica para la obtención, filtrado y estado de visitas.
 * @requires @fortawesome/react-fontawesome - Para la renderización de íconos.
 * @requires @fortawesome/free-solid-svg-icons - Íconos utilizados.
 */
import React from "react";
import useVisitsHistorial from "../../hooks/historial/useVisitsHistorial.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faSignOutAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

/**
 * @function VisitsHistorial
 * @description Muestra la tabla de historial de visitas.
 * Gestiona la visualización de datos, la búsqueda y el modal de detalles.
 * @returns {JSX.Element} La interfaz de la tabla de historial de visitas.
 */
export default function VisitsHistorial() {
  /**
   * @constant {object} visitsData
   * @description Datos y funciones obtenidos del hook `useVisitsHistorial`.
   * Contiene el historial filtrado, estados de UI, y handlers.
   */
  const {
    visitsHistorial,
    isLoading,
    error,
    showModal,
    selectedVisit,
    handleSelectVisit,
    handleCloseModal,
    formatDate,
    searchTerm,
    handleSearchChange,
    noResults,
  } = useVisitsHistorial();

  /** @type {Function} Hook para navegar de vuelta al dashboard o a la página anterior. */
  const navigate = useNavigate();
  const goBack = navigate(-1);

  return (
    <div className="flex flex-col items-center w-full h-screen mb-[50px] p-4 text-blue-700">
      {/* Botón Volver */}
      <button
        type="button"
        onClick={goBack}
        className="
                    absolute top-1 right-4 
                    bg-red-600 hover:bg-red-700 
                    text-white font-bold 
                    p-4 rounded-lg 
                    flex flex-col items-center justify-center 
                    transition-colors duration-300
                    text-sm w-16 h-16 sm:w-20 sm:h-20
                "
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl sm:text-xl" />
        <span className="text-xs sm:text-sm mt-1">Volver</span>
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold mb-6 mt-[70px]  text-center text-blue-700">
        Historial de Visitas
      </h2>

      {/* Componente de Búsqueda */}
      <div className="w-full max-w-4xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, etc"
            className="w-full p-3 pl-10 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Mensaje de Sin Resultados */}
      {noResults && (
        <div className="py-8 w-full max-w-4xl text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-yellow-500 text-6xl mb-4"
          />
          <p className="text-2xl font-bold text-gray-800">
            ¡No se encontraron resultados!
          </p>
          <p className="text-gray-600 mt-2">
            Intenta con otro término de búsqueda.
          </p>
        </div>
      )}

      {/* Indicador de Carga */}
      {isLoading && (
        <div className="py-8 w-full max-w-4xl text-center text-lg font-semibold text-blue-500">
          Cargando historial de visitas...
        </div>
      )}

      {/* Tabla de Historial */}
      <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg shadow-black">
        {/* La tabla se renderiza si no hay resultados de búsqueda ni error de carga */}
        {!noResults && !error && !isLoading && (
          <table className="min-w-full rounded-lg">
            <thead className="bg-blue-700 text-white">
              <tr className="divide-x divide-blue-800">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Nombre del visitante
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Tipo de documento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Documento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Destinatario
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Área
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Fecha/Hora Entrada
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Fecha/Hora Salida
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className=" bg-white divide-y divide-gray-200 text-gray-800">
              {visitsHistorial.map((visit) => (
                <tr
                  key={visit.id_visita}
                  className="divide-x divide-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.nombre_visitante}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.identificacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.nombre_destinatario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.nombre_area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(visit.fecha_entrada)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* Muestra un guion si la fecha_salida es nula */}
                    {visit.fecha_salida ? formatDate(visit.fecha_salida) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center justify-center items-center text-sm">
                    <button
                      onClick={() => handleSelectVisit(visit)}
                      // Ajuste de estilos para visibilidad en fondo blanco
                      className="text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 shadow-md shadow-gray-300"
                      aria-label={`Ver detalles de la visita de ${visit.nombre_visitante}`}
                    >
                      <FontAwesomeIcon icon={faEye} className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mensaje de Error de Carga */}
      {!noResults && error && (
        <div className="mt-8 w-full max-w-4xl">
          <div
            className="bg-red-100 border-l-4 w-full font-semibold border-red-500 text-red-700 p-3 rounded-md shadow-md"
            role="alert"
          >
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="mr-2 text-xl"
              />
              <p className="font-bold text-lg">Error de Carga</p>
            </div>
            <p className="text-lg mt-[10px]">{error}</p>
          </div>
        </div>
      )}

      {/* Modal de Detalles de la Visita */}
      {showModal && selectedVisit && (
        <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div
            className="relative bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-transform duration-300 scale-100 animate-fadeIn"
            key={selectedVisit.id_visita} // Agregado para forzar re-renderizado si es necesario
          >
            <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center border-b pb-2">
              Detalles de la visita
            </h3>

            {/* Contenido del modal */}
            <div className="space-y-4 text-gray-700">
              <p className="text-base">
                <strong>Nombre completo del visitante:</strong>{" "}
                {selectedVisit.nombre_visitante}
              </p>
              <p className="text-base">
                <strong>Tipo de identificación:</strong>{" "}
                {selectedVisit.descripcion}
              </p>
              <p className="text-base">
                <strong>Identificación:</strong> {selectedVisit.identificacion}
              </p>
              {selectedVisit.empresa && (
                <p className="text-base">
                  <strong>Empresa:</strong> {selectedVisit.empresa}
                </p>
              )}
              <p className="text-base">
                <strong>Destinatario:</strong>{" "}
                {selectedVisit.nombre_destinatario}
              </p>
              <p className="text-base">
                <strong>Área:</strong> {selectedVisit.nombre_area}
              </p>
              <p className="text-base">
                <strong>Fecha/Hora entrada:</strong>{" "}
                {formatDate(selectedVisit.fecha_entrada)}
              </p>
              <p className="text-base">
                <strong>Fecha/Hora salida:</strong>{" "}
                {selectedVisit.fecha_salida
                  ? formatDate(selectedVisit.fecha_salida)
                  : "Pendiente de registro"}
              </p>
              <p className="text-base">
                <strong>Motivo de la visita:</strong> {selectedVisit.motivo}
              </p>
              {selectedVisit.observaciones && (
                <p className="text-base border-t pt-4">
                  <strong>Observaciones de la visita:</strong>{" "}
                  {selectedVisit.observaciones}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
