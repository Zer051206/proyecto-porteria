/**
 * @file PackageHistoryTable.jsx
 * @module Components/Packages/PackageHistoryTable
 * @description Componente de página que muestra el historial completo de paquetes en una tabla.
 * Proporciona funcionalidad de búsqueda, manejo de estados (carga/error), y un modal
 * para visualizar los detalles completos de cada paquete registrado.
 * @exports PackageHistoryTable
 * @requires react
 * @requires ../../hooks/useGoBackDashboard - Hook para la función de volver.
 * @requires ../../hooks/historial/usePackagesHistorial - Hook de lógica para la obtención, filtrado y estado de paquetes.
 * @requires @fortawesome/react-fontawesome - Para la renderización de íconos.
 * @requires @fortawesome/free-solid-svg-icons - Íconos utilizados.
 */
import React from "react";
import usePackagesHistorial from "../../hooks/historial/usePackagesHistorial.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faSignOutAlt,
  faExclamationTriangle,
  // Font Awesome Icons - Usados en la tabla, búsqueda y mensajes de estado
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

/**
 * @function PackageHistoryTable
 * @description Muestra la tabla de historial de paquetes.
 * Gestiona la visualización de datos, la búsqueda, el manejo de errores y el modal de detalles.
 * @returns {JSX.Element} La interfaz de la tabla de historial de paquetes.
 */
export default function PackageHistoryTable() {
  /**
   * @constant {object} packageData
   * @description Datos y funciones obtenidos del hook `usePackagesHistorial`.
   * Contiene el historial filtrado, estados de UI, y handlers.
   */
  const {
    packagesHistorial,
    isLoading,
    error,
    showModal,
    selectedPackage,
    handleSelectPackage,
    handleCloseModal,
    formatDate,
    searchTerm,
    handleSearchChange,
    noResults,
  } = usePackagesHistorial();

  const navigate = useNavigate();

  /** @type {Function} Hook para navegar de vuelta al dashboard o a la página anterior. */
  const goBack = navigate(-1);

  return (
    <div className="flex flex-col items-center w-full h-screen mb-[50px] p-4 text-green-700">
      {/* Botón Volver - Posicionado en la esquina superior derecha */}
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

      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center mt-[70px] text-green-700">
        Historial de Paquetes
      </h2>

      {/* Componente de Búsqueda */}
      <div className="w-full max-w-4xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código de paquete..."
            value={searchTerm}
            className="w-full p-3 pl-10 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
        <div className="py-8 w-full max-w-4xl text-center text-lg font-semibold text-green-500">
          Cargando historial de paquetes...
        </div>
      )}

      {/* Tabla de Historial */}
      <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg shadow-black">
        {/* La tabla se renderiza si no hay resultados de búsqueda ni error de carga */}
        {!noResults && !error && !isLoading && (
          <table className="w-full rounded-lg">
            <thead className="bg-green-700 text-white">
              <tr className="divide-x divide-green-800">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Guia del Paquete
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Tipo de paquete
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Remitente
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
                  Operación
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Fecha/Hora recibido
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Fecha/Hora enviado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
              {packagesHistorial.map((pkg) => (
                <tr
                  key={pkg.id_paquete}
                  className="divide-x divide-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {pkg.guia || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {pkg.descripcion || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {pkg.nombre_remitente || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {pkg.nombre_destinatario || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {pkg.nombre_area || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {pkg.tipo_operacion || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* Muestra un guion si la fecha es nula */}
                    {formatDate(pkg.fecha_recibido)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(pkg.fecha_envio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button
                      onClick={() => handleSelectPackage(pkg)}
                      className="text-green-600 p-2 rounded-full hover:bg-green-100 transition-colors duration-200 shadow-md shadow-gray-300"
                      aria-label={`Ver detalles del paquete`}
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

      {/* Modal de Detalles del Paquete */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div
            className="relative bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-transform duration-300 scale-100 animate-fadeIn"
            key={selectedPackage.id_paquete}
          >
            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center border-b pb-2">
              Detalles del Paquete
            </h3>

            {/* Contenido del modal */}
            <div className="space-y-4 text-gray-700">
              <p className="text-base">
                <strong>Guía del Paquete:</strong>{" "}
                {selectedPackage.guia || "N/A"}
              </p>
              <p className="text-base">
                <strong>Tipo de Paquete:</strong>{" "}
                {selectedPackage.descripcion || "N/A"}
              </p>
              {selectedPackage.nombre_remitente && (
                <p className="text-base">
                  <strong>Remitente:</strong> {selectedPackage.nombre_remitente}
                </p>
              )}
              {selectedPackage.nombre_destinatario && (
                <p className="text-base">
                  <strong>Destinatario:</strong>{" "}
                  {selectedPackage.nombre_destinatario}
                </p>
              )}
              <p className="text-base">
                <strong>Área:</strong> {selectedPackage.nombre_area || "N/A"}
              </p>
              <p className="text-base">
                <strong>Operación:</strong>{" "}
                {selectedPackage.tipo_operacion || "N/A"}
              </p>
              {selectedPackage.empresa_transporte && (
                <p className="text-base">
                  <strong>Empresa de transporte:</strong>{" "}
                  {selectedPackage.empresa_transporte}
                </p>
              )}
              {selectedPackage.mensajero_nombre && (
                <p className="text-base">
                  <strong>Nombre del mensajero:</strong>{" "}
                  {selectedPackage.mensajero_nombre}
                </p>
              )}
              {selectedPackage.destino_salida && (
                <p className="text-base">
                  <strong>Destino:</strong> {selectedPackage.destino_salida}
                </p>
              )}
              {selectedPackage.fecha_recibido && (
                <p className="text-base">
                  <strong>Fecha/Hora recibido:</strong>{" "}
                  {formatDate(selectedPackage.fecha_recibido)}
                </p>
              )}
              {selectedPackage.fecha_envio && (
                <p className="text-base">
                  <strong>Fecha/Hora enviado:</strong>{" "}
                  {formatDate(selectedPackage.fecha_envio)}
                </p>
              )}
              {selectedPackage.observaciones && (
                <p className="text-base border-t pt-4">
                  <strong>Observaciones:</strong>{" "}
                  {selectedPackage.observaciones}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-green-700 text-white font-semibold rounded-md shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
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
