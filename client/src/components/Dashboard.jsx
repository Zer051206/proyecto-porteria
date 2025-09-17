import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBox, faHistory, faSignOutAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import useDashboard from '../hooks/useDashboard.js'; 
import useAuthLogout from '../hooks/useAuthLogout.js';

// Componente de la tabla de visitas activas
const ActiveVisitsTable = () => {
  const {
    activeVisits,
    isLoading,
    error,
    showModal,
    selectedVisit,
    handleEndVisit,
    handleConfirmEndVisit,
    handleCloseModal
  } = useDashboard();

  if (isLoading) {
    return <div className="text-center text-gray-400 py-4 bg-gray-800">Cargando visitas...</div>;
  }

  if (error) {
    return (
      <div className="px-4 py-5 bg-gray-800">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-xl" />
            <p className="font-bold text-lg">Error de Carga</p>
          </div>
          <p className="text-lg mr-[20px]">{error}</p>
        </div>
      </div>
    )
  }

  if (activeVisits.length === 0) {
    return <div className="text-center py-4 text-gray-400 bg-gray-800">No hay visitas activas.</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre Completo del Visitante
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Destinatario
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Área
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hora De Entrada
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {activeVisits.map((visit) => (
              <tr key={visit.id_visita}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{visit.nombre_visitante}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{visit.empresa}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{visit.nombre_destinatario}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{visit.nombre_area}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{new Date(visit.fecha_entrada).toLocaleTimeString()}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => handleEndVisit(visit)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                    Terminar Visita
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-1/3 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar Finalización</h2>
            <p className="mb-6">¿Estás seguro de que deseas finalizar la visita de **{selectedVisit?.nombre_visitante}**?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmEndVisit}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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

export default function DashboardPage() {
  const navigate = useNavigate();

  const { logout } = useAuthLogout();

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4">
      
      {/* Botón de Cerrar Sesión */}
      <button
        type="button" 
        onClick={logout}
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
        <span className="text-xs sm:text-sm mt-1">Cerrar Sesión</span>
      </button>
      {/* Título de la página */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-8 mt-12 text-center">
        Gestión de Visitas y Paquetes
      </h1>

      {/* Botones de acción */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        
        {/* Botón Nueva Visita */}
        <button
          onClick={() => navigate('/visitas/entrada')}
          className="flex flex-col items-center justify-center p-6 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="text-3xl mb-2" />
          <span className="font-semibold text-lg">Nueva Visita</span>
        </button>

        {/* Botón de Paquetes */}
        <button
          onClick={() => navigate('/paquetes')}
          className="flex flex-col items-center justify-center p-6 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-colors"
        >
          <FontAwesomeIcon icon={faBox} className="text-3xl mb-2" />
          <span className="font-semibold text-lg">Paquetes</span>
        </button>
        
        {/* Botón de Historial */}
        <button
          onClick={() => navigate('/historial')}
          className="flex flex-col items-center justify-center p-6 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition-colors"
        >
          <FontAwesomeIcon icon={faHistory} className="text-3xl mb-2" />
          <span className="font-semibold text-lg">Historial</span>
        </button>
      </div>

      {/* Contenedor de la tabla de visitas activas */}
      <div className="w-full max-w-4xl">
        <ActiveVisitsTable />
      </div>

    </div>
  );
}