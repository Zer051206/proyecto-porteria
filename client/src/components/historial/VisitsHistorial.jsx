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
  faArrowLeft,
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
    visits,
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

  /**
   * @type {Function}
   * Hook para navegar de vuelta al dashboard o a la página anterior.
   * */
  const navigate = useNavigate();
  const goBack = () => navigate("/historial");

  return (
    <div className="flex flex-col items-center w-full h-full mb-[50px] p-4 text-secondary">
      <button
        type="button"
        onClick={goBack}
        className="md:absolute md:left-[150px]  md:top-[100px] mb-5 bg-surface text-text-main font-bold p-3 rounded-full shadow-sm  shadow-black md:w-1/12 w-1/2 hover:bg-background transition-colors"
        aria-label="Volver a la página de inicio"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-secondary">
        Historial de Visitas
      </h2>

      {/* Componente de Búsqueda */}
      <div className="w-full max-w-4xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, etc"
            className="w-full p-3 pl-10 border text-tex-main border-secondary rounded-lg "
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-main"
          />
        </div>
      </div>

      {/* Mensaje de Sin Resultados */}
      {noResults && (
        <div className="py-8 w-full max-w-4xl text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-primary text-6xl mb-4"
          />
          <p className="text-2xl font-bold text-text-main">
            ¡No se encontraron resultados!
          </p>
          <p className="text-text-main mt-2">
            Intenta con otro término de búsqueda.
          </p>
        </div>
      )}

      {/* Indicador de Carga */}
      {isLoading && (
        <div className="py-8 w-full max-w-4xl text-center text-lg font-semibold text-secondary">
          Cargando historial de visitas...
        </div>
      )}

      {/* Tabla de Historial */}
      <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg shadow-black">
        {/* La tabla se renderiza si no hay resultados de búsqueda ni error de carga */}
        {!noResults && !error && !isLoading && (
          <table className="min-w-full rounded-lg">
            <thead className="bg-secondary text-surface">
              <tr className="divide-x divide-secondary-hover">
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
            <tbody className=" bg-surface divide-y divide-neutral-200 text-text-main">
              {visits.map((visit) => (
                <tr
                  key={visit.id_visita}
                  className="divide-x divide-neutral-200 hover:bg-background"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.nombre_visitante}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.IdentificationType?.descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.identificacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.nombre_destinatario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.Area?.nombre_area}
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
                      className="text-secondary p-2 rounded-lg hover:bg-secondary-light transition-colors duration-200 shadow-md shadow-neutral-400"
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
            className="bg-red-100 border-l-4 w-full font-semibold border-error text-error-hover p-3 rounded-md shadow-md"
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
        <div className="fixed inset-0 bg-text-main/80 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div
            className="relative bg-background p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-transform duration-300 scale-100 animate-fadeIn"
            key={selectedVisit.id_visita} // Agregado para forzar re-renderizado si es necesario
          >
            <h3 className="text-2xl font-bold text-secondary mb-6 text-center border-b pb-2">
              Detalles de la visita
            </h3>

            {/* Contenido del modal */}
            <div className="space-y-4 text-text-main">
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
                className="px-6 py-2 bg-secondary text-surface font-semibold rounded-md shadow-md hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-secondary-light transition-colors"
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
