/**
 * @file DashboardPackage.jsx
 * @module DashboardPackage
 * @description Página principal para la gestión de envíos y paquetes. Presenta opciones
 * claras para registrar la recepción o el envío de un paquete, y una opción para volver.
 * @component
 * @requires react
 * @requires react-router-dom/useNavigate
 * @requires @fortawesome/react-fontawesome/FontAwesomeIcon
 * @requires @fortawesome/free-solid-svg-icons/faDownload, faUpload, faArrowLeft
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faArrowLeft,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore";
import { useDashboardPackage } from "../../hooks/packages/useDashboardPackage";

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

  // Usamos el hook principal que ahora maneja todo
  const {
    recentPackages, // <-- Lista de logs recientes FILTRADA
    isLoading: isPackagesLoading, // <-- Loading del hook de paquetes
    error,
    modalType, // <-- Estado que controla qué modal mostrar
    selectedPackage, // <-- Datos para el modal de detalles
    searchTerm,
    handleAction, // <-- Función para ABRIR modales
    closeModal, // <-- Función para CERRAR modales
    handleSuccess, // <-- Callback de éxito para FORMULARIOS
    handleSearchChange, //-- Handler para búsqueda
    formatRelativeTime, // Para el feed
    formatDate, // Para el modal de detalles
    refetch, // Para recargar datos
  } = useDashboardPackage();

  // Decidimos cuándo mostrar el Skeleton
  const showSkeleton = isAuthLoading || isPackagesLoading;

  if (showSkeleton) {
    return <DashboardPackageSkeleton />;
  }

  return (
    // Contenedor principal (mantiene padding y margen)
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
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center text-primary mt-10">
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
            onClick={() => handleAction("recibir")} // <--- CAMBIO AQUÍ
            className="bg-primary text-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow flex-grow md:flex-grow-0"
            aria-label="Registrar recepción de paquete"
          >
            <FontAwesomeIcon icon={faDownload} /> Recibir Paquete
          </button>
          <button
            onClick={() => handleAction("enviar")} // <--- CAMBIO AQUÍ
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
            placeholder="Buscar en actividad reciente..."
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
            formatRelativeTime={formatRelativeTime}
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
        <RecibirPackageModal onClose={closeModal} onSuccess={handleSuccess} />
      )}
      {modalType === "enviar" && (
        <EnviarPackageModal onClose={closeModal} onSuccess={handleSuccess} />
      )}
      {/* Reutiliza HistoryDetailModal para ver detalles */}
      {modalType === "details" && selectedPackage && (
        <HistoryDetailModal
          item={selectedPackage} // Pasa el paquete seleccionado del estado
          onClose={closeModal}
          type="paquete" // Indica que es un paquete
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
