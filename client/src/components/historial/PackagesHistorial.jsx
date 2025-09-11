// src/components/packages/PackageHistoryTable.jsx
import React from 'react';
import { useGoBack } from '../../hooks/useGoBackDashboard.js';
import usePackagesHistorial from '../../hooks/usePackagesHistorial.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function PackageHistoryTable() {
  const {
    packagesHistorial,
    isLoading,
    error,
    showModal,
    selectedPackage,
    handleSelectPackage,
    handleCloseModal
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
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center mt-[70px] text-green-700">Historial de Paquetes</h2>
      <div className="w-full max-w-4xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código de paquete..."
            className="w-full p-3 pl-10 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg shadow-black">
        <table className="min-w-full divide-y divide-green-500 rounded-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Código de Paquete
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Remitente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Destinatario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Detalles</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
            {/* Aquí irían las filas de datos */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
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