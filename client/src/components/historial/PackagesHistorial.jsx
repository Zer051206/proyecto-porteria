// src/components/packages/PackageHistoryTable.jsx
import React from "react";
import { useGoBack } from "../../hooks/useGoBackDashboard.js";
import usePackagesHistorial from "../../hooks/usePackagesHistorial.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faSignOutAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

export default function PackageHistoryTable() {
  const {
    packagesHistorial,
    isLoading,
    error,
    showModal,
    selectedPackage,
    handleSelectPackage,
    handleCloseModal,
  } = usePackagesHistorial();

  const goBack = useGoBack();

  return (
    <div className="flex flex-col items-center w-full h-screen mb-[50px] p-4 text-green-700">
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
      <div className="w-full max-w-4xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código de paquete..."
            className="w-full p-3 pl-10 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg shadow-black">
        {packagesHistorial && !error && (
          <table className="w-full rounded-lg items-center justify-center">
            <thead className="bg-green-700 text-white">
              <tr className="divide-x divide-green-800">
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Guia del Paquete
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Tipo de paquete
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Remitente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Destinatario
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Área
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Operación
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Fecha/Hora recibido
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Fecha/Hora enviado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
              {/* Aquí irían las filas de datos */}
              {packagesHistorial.map((pkg) => (
                <tr key={pkg.id_paquete}>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.guia}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.tipo_paquete_descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.nombre_remitente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.destinatario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.area_descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.tipo_operacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.fecha_recibido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.fecha_enviado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left justify-center items-center text-sm">
                    <button
                      onClick={handleSelectPackage(pkg)}
                      className="text-green-600 hover:text-green-800 transition-colors duration-200 justify-center items-center shadow-md hover:bg-gray-200 shadow-black"
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
      {error && (
        <div className="py-0.5 w-10/10 md:w-7/10">
          <div className="bg-red-100 border-l-4 w-full font-semibold border-red-500 text-red-700 p-3">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="mr-2 text-xl"
              />
              <p className="font-bold text-lg">Error de Carga</p>
            </div>
            <p className="text-lg mt-[10px] mr-[20px]">{error}</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-transform duration-300 scale-95 md:scale-100">
            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Detalles del Paquete
            </h3>

            {/* Contenido del modal */}
            {selectedPackage && (
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Guía del Paquete:</strong> {selectedPackage.guia}
                </p>
                <p className="text-lg">
                  <strong>Tipo de Paquete:</strong>
                  {selectedPackage.tipo_paquete_descripcion}
                </p>
                <p className="text-lg">
                  <strong>Remitente:</strong> {selectedPackage.nombre_remitente}
                </p>
                <p className="text-lg">
                  <strong>Destinatario:</strong> {selectedPackage.destinatario}
                </p>
                <p className="text-lg">
                  <strong>Área:</strong> {selectedPackage.area_descripcion}
                </p>
                <p className="text-lg">
                  <strong>Operación:</strong> {selectedPackage.tipo_operacion}
                </p>
                <p className="text-lg">
                  <strong>Fecha/Hora recibido:</strong>
                  {selectedPackage.fecha_entrada}
                </p>
                <p className="text-lg">
                  <strong>Fecha/Hora enviado:</strong>
                  {selectedPackage.fecha_salida}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
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
