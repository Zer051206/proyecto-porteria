// src/components/visits/VisitHistoryTable.jsx
import React from 'react';
import { useGoBack } from '../../hooks/useGoBackDashboard.js';
import useVisitsHistorial from '../../hooks/useVisitsHistorial.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function VisitsHistorial() {
  const {
    visitsHistorial,
    isLoading,
    error,
    showModal,
    selectedVisit,
    handleSelectVisit,
    handleCloseModal
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
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 mt-[70px]  text-center text-blue-700">Historial de Visitas</h2>
      <div className="w-full max-w-4xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, documento o placa..."
            className="w-full p-3 pl-10 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg shadow-black">
        <table className="min-w-full divide-y divide-blue-500 rounded-lg">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Visitante
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Documento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Placa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Fecha/Hora Entrada
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Detalles</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
            {/* Aquí irían las filas de datos */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
              <td className="px-6 py-4 whitespace-nowrap">123456789</td>
              <td className="px-6 py-4 whitespace-nowrap">ABC-123</td>
              <td className="px-6 py-4 whitespace-nowrap">11-09-2025 10:30 AM</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                  <FontAwesomeIcon icon={faEye} className="text-xl" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}