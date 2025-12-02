/**
 * @file DashboardPackage.jsx
 * @module components/packages/DashboardPackage.jsx
 * @description Página principal para la gestión de envíos y paquetes. Presenta opciones
 * claras para registrar la recepción o el envío de un paquete, y una opción para volver.
 * @component
 * @requires react
 * @requires react-router-dom/useNavigate
 * @requires @fortawesome/react-fontawesome/FontAwesomeIcon
 * @requires @fortawesome/free-solid-svg-icons/faDownload, faUpload, faArrowLeft
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faArrowLeft,
  faExclamationTriangle,
  faSearch,
  faBox,
  faUser,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore";
import { useDashboardPackage } from "../../hooks/packages/useDashboardPackage";
import PackagesEnviarForm from "./PackagesEnviarForm";
import PackagesRecibirForm from "./PackagesRecibirForm";
import DetailModal from "../utils/DetailModal";
import { packageConfig } from "../../hooks/utils/detailModalConfig";

/**
 * @function DashboardPackageSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del DashboardPackage refactorizado.
 * @returns {JSX.Element}
 */
const DashboardPackageSkeleton = () => (
  <div className="flex flex-col items-center w-full animate-pulse p-4">
    {/* Esqueleto Botón Volver */}
    <div className="md:absolute md:left-[150px] md:top-[100px] mb-5 bg-gray-200 rounded-full h-12 md:w-1/12 w-1/2"></div>
    {/* Esqueleto Título */}
    <div className="h-10 sm:h-12 bg-gray-200 rounded w-3/4 max-w-sm mx-auto mb-10 mt-10"></div>
    {/* Esqueleto Header con Botones de Acción */}
    <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>{" "}
      {/* Título "Acciones Rápidas" */}
      <div className="flex items-center gap-4">
        <div className="h-10 bg-gray-300 rounded w-36"></div>{" "}
        {/* Botón Recibir */}
        <div className="h-10 bg-gray-300 rounded w-36"></div>{" "}
        {/* Botón Enviar */}
      </div>
    </header>
    {/* Esqueleto Filtros (Solo Búsqueda ahora) */}
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
      <div className="h-12 w-full md:w-1/2 bg-gray-200 rounded-lg"></div>{" "}
      {/* Search */}
    </div>
    {/* Esqueleto Feed Actividad */}
    <div className="w-full max-w-3xl mt-8">
      {" "}
      {/* Ancho similar al feed real */}
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>{" "}
      {/* Título "Última Actividad" */}
      <div className="bg-surface rounded-lg shadow p-4 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-3 border-b border-neutral-200 last:border-b-0"
          >
            <div className="flex items-center gap-3 w-3/4">
              <div className="h-6 w-6 bg-gray-300 rounded"></div> {/* Icono */}
              <div className="space-y-2 flex-grow">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>{" "}
                {/* Guía */}
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>{" "}
                {/* Dest/Rem */}
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div> {/* Tiempo */}
          </div>
        ))}
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mt-6"></div>{" "}
      {/* Enlace Historial */}
    </div>
  </div>
);

/**
 * @function RecentActivityFeed
 * @description Muestra una lista de la actividad reciente de paquetes.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.logs - Array de logs de paquetes recientes.
 * @param {Function} props.formatDate - Función para formatear fechas relativas.
 * @param {Function} props.onAction - Callback para manejar acciones (ej. ver detalles).
 * @returns {JSX.Element}
 */
const RecentActivityFeed = ({ logs, formatDate, onAction }) => {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-center text-neutral-500 italic py-4">
        No hay actividad reciente.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-xl font-semibold text-text-main mb-3">
        Última Actividad
      </h2>
      <ul className="bg-surface rounded-lg shadow p-4 divide-y divide-neutral-200 max-h-72 overflow-y-auto">
        {logs.map((log) => {
          const pkg = log.Package;
          if (!pkg) return null;

          const isEntrada = log.accion === "RECIBIR_PAQUETE";
          const timeAgo = formatDate(log.fecha_log);

          return (
            <li
              key={log.id_log}
              className="py-3 flex items-center justify-between gap-2 flex-wrap"
            >
              <div className="flex justify-center mt-[5px] gap-3 flex-grow">
                <FontAwesomeIcon
                  icon={faBox}
                  className={`text-xl ${
                    isEntrada ? "text-primary" : "text-secondary"
                  }`}
                />
                <div className="flex-grow justify-center items-center">
                  <p className="text-sm font-semibold text-text-main flex items-center gap-2">
                    {isEntrada ? "Recibido:" : "Enviado:"}
                    <button
                      onClick={() => onAction("details", pkg)} // Llama a onAction con el paquete
                      className="font-mono hover:underline hover:text-secondary-hover"
                      title="Ver detalles del paquete"
                    >
                      {pkg.guia || "Sin Guía"}
                    </button>
                  </p>
                  <p className="text-xs text-text-main text-center ml-[50px]">
                    {isEntrada
                      ? `Dest: ${pkg.nombre_destinatario || "N/A"}`
                      : `Rem: ${pkg.nombre_remitente || "N/A"}`}
                    {log.User && (
                      <span className="ml-2 pl-2 border-l border-neutral-300">
                        <FontAwesomeIcon
                          icon={faUser}
                          size="xs"
                          className="mr-1"
                        />
                        {log.User.nombre}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span className="text-xs text-neutral-500 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                <FontAwesomeIcon icon={faClock} size="xs" />
                {timeAgo}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/**
 * @function DashboardPackage
 * @description Renderiza la interfaz principal para la gestión de paquetes, ofreciendo
 * botones para abrir modales de 'Recibir' y 'Enviar', y mostrando actividad reciente.
 * @returns {JSX.Element} El elemento JSX que representa la página de gestión de envíos.
 */
export default function DashboardPackage() {
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");
  const { isLoading: isAuthLoading } = useAuthStore(); // Para el skeleton inicial

  const modalTheme = "primary";
  const modalTitle = "Detalles del paquete";
  const modalConfig = packageConfig;

  // Usamos el hook principal que ahora maneja todo
  const {
    recentPackages,
    isLoading: isPackagesLoading,
    error,
    modalType,
    selectedPackage,
    searchTerm,
    handleAction,
    closeModal,
    handleSuccess,
    handleSearchChange,
    formatDate,
    refetch,
  } = useDashboardPackage();

  // Decidimos cuándo mostrar el Skeleton
  const showSkeleton = isAuthLoading || isPackagesLoading;

  if (showSkeleton) {
    return <DashboardPackageSkeleton />;
  }

  return (
    <div className="flex flex-col items-center w-full h-full mb-[50px] p-4">
      {/* --- Botón Volver (Mantenido) --- */}
      <button
        type="button"
        onClick={goBack}
        className="md:absolute md:left-[150px]  md:top-[100px] mb-5 bg-surface text-text-main font-bold p-3 rounded-full shadow-sm  shadow-black md:w-1/12 w-1/2 hover:bg-background transition-colors"
        aria-label="Volver al dashboard"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>

      {/* --- Título Principal (Mantenido) --- */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center text-primary">
        Gestión de Paquetes
      </h1>

      {/* --- Header con Botones de Acción (Nuevo, similar a DashboardDevice) --- */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-text-main self-start md:self-center">
          Acciones Rápidas
        </h2>
        <div className="flex items-center gap-4 self-stretch md:self-auto justify-around md:justify-end">
          {/* Botones ahora usan onClick para llamar a handleAction */}
          <button
            onClick={() => handleAction("recibir")}
            className="bg-primary text-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow flex-grow md:flex-grow-0"
            aria-label="Registrar recepción de paquete"
          >
            <FontAwesomeIcon icon={faDownload} /> Recibir Paquete
          </button>
          <button
            onClick={() => handleAction("enviar")}
            className="bg-secondary text-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-secondary-hover transition-colors shadow flex-grow md:flex-grow-0"
            aria-label="Registrar envío de paquete"
          >
            <FontAwesomeIcon icon={faUpload} /> Enviar Paquete
          </button>
        </div>
      </header>

      {/* --- Filtros (Solo Búsqueda) --- */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            value={searchTerm} // Controlado
            onChange={handleSearchChange} // Conectado al hook
            className="w-full p-3 pl-10 border text-text-main border-neutral-300 rounded-lg bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-main/70"
          />
        </div>
      </div>

      {/* --- Feed de Actividad Reciente --- */}
      <div className="w-full max-w-3xl">
        {/* Manejo de Error */}
        {error && (
          <div className="mt-8 w-full">
            <div
              className="bg-red-100 border-l-4 w-full font-semibold border-error text-error-hover p-3 rounded-md shadow-md"
              role="alert"
            >
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-2 text-xl"
                />
                <p className="font-bold text-lg">Error al Cargar Actividad</p>
              </div>
              <p className="text-lg mt-[10px]">{error}</p>
            </div>
          </div>
        )}
        {/* Renderizado del Feed */}
        {!error && (
          <RecentActivityFeed
            logs={recentPackages} // Pasa los logs recientes (filtrados)
            formatDate={formatDate}
            onAction={handleAction} // Para abrir detalles
          />
        )}
        {/* Enlace a Historial */}
        <div className="text-center mt-6">
          <button
            onClick={() =>
              navigate("/historial", { state: { initialTab: "paquetes" } })
            }
            className="text-primary hover:underline font-semibold"
          >
            Ver Historial Completo de Paquetes
          </button>
        </div>
      </div>

      {/* --- Modales Condicionales --- */}
      {/* Renderiza el modal correspondiente según modalType */}
      {modalType === "recibir" && (
        <PackagesRecibirForm onClose={closeModal} onSuccess={handleSuccess} />
      )}
      {modalType === "enviar" && (
        <PackagesEnviarForm onClose={closeModal} onSuccess={handleSuccess} />
      )}
      {/* Reutiliza HistoryDetailModal para ver detalles */}
      {modalType === "details" && selectedPackage && (
        <DetailModal
          item={selectedPackage}
          onClose={closeModal}
          type="paquete"
          formatDate={formatDate}
          title={modalTitle}
          config={modalConfig}
          themeColor={modalTheme}
        />
      )}
    </div>
  );
}
