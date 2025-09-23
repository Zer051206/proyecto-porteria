// src/components/visits/VisitHistoryTable.jsx
import React from "react";
import { useGoBack } from "../../hooks/useGoBackDashboard.js";
import useVisitsHistorial from "../../hooks/useVisitsHistorial.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faSignOutAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

export default function VisitsHistorial() {
  const {
    visitsHistorial,
    isLoading,
    error,
    showModal,
    selectedVisit,
    handleSelectVisit,
    handleCloseModal,
  } = useVisitsHistorial();

  const goBack = useGoBack();

  return (
    <div className="flex flex-col items-center w-full h-screen mb-[50px] p-4 text-blue-700">
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
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 mt-[70px]  text-center text-blue-700">
        Historial de Visitas
      </h2>
      <div className="w-full max-w-4xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, fecha, etc"
            className="w-full p-3 pl-10 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg shadow-black">
        {visitsHistorial && !error && (
          <table className="min-w-full divide-y divide-blue-500 rounded-lg">
            <thead className="bg-blue-700 text-white">
              <tr>
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
                  Documento
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
                <tr key={visit.id_visita}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {" "}
                    {visit.nombre_visitante}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {" "}
                    {visit.identificacion}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {" "}
                    {visit.tipo_identificacion_descripcion}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {" "}
                    {visit.fecha_entrada}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {" "}
                    {visit.fecha_salida}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left justify-center items-center text-sm">
                    <button
                      onClick={handleSelectVisit(visit)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 justify-center items-center shadow-md hover:bg-gray-200 shadow-black"
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
    </div>
  );
}
