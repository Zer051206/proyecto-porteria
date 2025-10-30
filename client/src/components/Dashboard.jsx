/**
 * @file Dashboard.jsx
 * @module components/Dashboard.jsx
 * @description Componente principal que sirve como la página de inicio para los usuarios autenticados.
 * Muestra las visitas activas y proporciona enlaces de navegación a las principales funcionalidades de la aplicación.
 * @component
 * @requires react
 * @requires react-router-dom/useNavigate
 * @requires ../hooks/useDashboard
 * @requires ../hooks/auth/useAuthStore
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
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import useDashboard from "../hooks/useDashboard.js";
import { formatDate } from "../utils/dateFormat.js";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @function TableSkeleton
 * @description Componente de esqueleto de carga que imita la ESTRUCTURA DE LA TABLA de visitas.
 * @returns {JSX.Element}
 */
const TableSkeleton = () => (
  <div className="bg-surface rounded-lg shadow-md animate-pulse">
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
 * @function DashboardSkeleton
 * @description Componente de esqueleto de carga que imita la PÁGINA COMPLETA del Dashboard.
 * Este es el componente que se usará en React.Suspense.
 * @returns {JSX.Element}
 */
export const DashboardSkeleton = () => (
  <div className="flex flex-col items-center w-full animate-pulse">
    {/* Esqueleto del Título */}
    <div className="h-10 bg-gray-300 rounded w-1/2 mb-12 mt-6"></div>

    {/* Esqueleto de los Botones de Navegación */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-5xl mb-14">
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Esqueleto de la Tabla de Visitas */}
    <div className="w-full max-w-5xl">
      <div className="bg-surface p-4 rounded-lg shadow-md">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <TableSkeleton />
      </div>
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
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="px-4 py-5 bg-gray-800">
        <div className="bg-red-100 border-l-4 font-semibold border-error text-error-hover p-4 my-4">
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
      <div className="text-center bg-surface text-text-main py-6 rounded-lg shadow-lg">
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
      <div className="bg-surface rounded-lg shadow overflow-hidden mb-10 md:mb-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-3 py-[8px] md:px-5 md:py-3 border-2 border-neutral-400 bg-background text-center text-xs font-bold text-black uppercase tracking-wider">
                  Nombre del Visitante
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-neutral-400 bg-background text-center text-xs font-bold text-black uppercase tracking-wider">
                  Identificacion
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-neutral-400 bg-background text-center text-xs font-bold text-black uppercase tracking-wider">
                  Destinatario
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-neutral-400 bg-background text-center text-xs font-bold text-black uppercase tracking-wider">
                  Área de destino
                </th>
                <th className="px-5 py-[10px] md:px-5 md:py-3 border-2 border-neutral-400 bg-background text-center text-xs font-bold text-black uppercase tracking-wider">
                  Hora De Entrada
                </th>
                <th className="px-4 py-[8px] md:px-5 md:py-3 border-2 border-neutral-400 bg-background text-center text-xs font-bold text-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {activeVisits.map((visit) => (
                <tr key={visit.id_visita}>
                  <td className="md:px-3 md:py-1 font-semibold border border-neutral-400 bg-surface text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.nombre_visitante}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-neutral-400 bg-surface text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.identificacion || "N/A"}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-neutral-400 bg-surface text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.nombre_destinatario}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-neutral-400 bg-surface text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {visit.Area?.nombre_area}
                    </p>
                  </td>
                  <td className="md:px-3 md:py-1 font-semibold border border-neutral-400 bg-surface text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {formatDate(visit.fecha_entrada)}
                    </p>
                  </td>
                  <td className="px-3 py-1 font-semibold border border-neutral-400 bg-surface text-sm text-center">
                    <button
                      onClick={() => handleEndVisit(visit)}
                      className="bg-error hover:bg-error-hover text-xs text-surface font-bold py-1 px-2 rounded flex items-center justify-center mx-auto"
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
          <div className="text-text-main bg-background rounded-lg p-8 w-screen md:w-1/3 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar Finalización</h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas finalizar la visita de{" "}
              <span className="font-semibold text-secondary">
                {selectedVisit?.nombre_visitante}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-text-muted hover:bg-tertiary text-surface font-bold py-2 px-4 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmEndVisit}
                className="bg-secondary hover:bg-secondary-hover text-surface font-bold py-2 px-4 rounded transition-colors"
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
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col justify-items-center min-h-screen w-full mb-10 md:mb-0">
      <div className="w-full justify-items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-12 mt-6 text-center">
          Gestión de Visitas y Paquetes
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl mb-14">
          {/* Botón Nueva Visita */}
          <button
            onClick={() => navigate("/visitas/entrada")}
            className="flex flex-col items-center justify-center p-6 bg-primary text-surface rounded-lg shadow-md hover:bg-primary-hover transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="text-3xl mb-2" />
            <span className="font-semibold text-lg">Nueva Visita</span>
          </button>

          {/* Botón de Paquetes */}
          <button
            onClick={() => navigate("/paquetes")}
            className="flex flex-col items-center justify-center p-6 bg-secondary text-surface rounded-lg shadow-md hover:bg-secondary-hover transition-colors"
          >
            <FontAwesomeIcon icon={faBox} className="text-3xl mb-2" />
            <span className="font-semibold text-lg">Paquetes</span>
          </button>

          {/* Botón de Historial */}
          <button
            onClick={() => navigate("/historial")}
            className="flex flex-col items-center justify-center p-6 bg-tertiary text-surface rounded-lg shadow-md hover:bg-tertiary-hover transition-colors"
          >
            <FontAwesomeIcon icon={faHistory} className="text-3xl mb-2" />
            <span className="font-semibold text-lg">Historial</span>
          </button>
          {/* --- Botón de Parqueadero--- */}
          <button
            onClick={() => navigate("/parqueadero")}x
            className="flex flex-col items-center justify-center p-6 bg-neutral-600 text-surface rounded-lg shadow-md hover:bg-neutral-700 transition-colors h-32" // Alto fijo
          >
            <FontAwesomeIcon icon={faCar} className="text-3xl mb-2" />
            <span className="font-semibold text-lg text-center">
              Parqueadero
            </span>
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
