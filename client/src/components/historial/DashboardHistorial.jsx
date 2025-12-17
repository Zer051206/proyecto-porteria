/**
 * @file DashboardHistorial.jsx
 * @module Components/Historial/DashboardHistorial
 * @description Componente de página que funciona como un menú para acceder al historial de registros de
 * diferentes categorías (Visitas y Paquetes).
 * @exports DashboardHistorial
 * @requires react
 * @requires react-router-dom - Para la navegación.
 * @requires @fortawesome/react-fontawesome - Para la renderización de íconos.
 * @requires @fortawesome/free-solid-svg-icons - Íconos sólidos utilizados (faBoxesPacking, faArrowLeft, faUserClock).
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  faArrowLeft,
  faUserClock,
  faEye,
  faSearch,
  faExclamationTriangle,
  faCar,
  faFileInvoice,
  faFileExcel,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore";
import { useDashboardHistorial } from "../../hooks/historial/useDashboardHistorial";
import DetailModal from "../utils/DetailModal";
import {
  visitConfig,
  packageConfig,
  vehicleConfig,
  radicadoConfig,
} from "../../hooks/utils/detailModalConfig";

const VisitsTable = ({ visits, onAction, formatDate }) => {
  if (visits.length === 0) {
    return (
      <div className="text-center bg-surface text-text-main py-6 rounded-lg shadow-lg">
        <p className="text-xl font-medium">No se han registrado visitas aún.</p>
        <p className="text-sm mt-1">
          Utiliza el botón "Nueva Visita" para registrar una entrada.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-lg shadow-black">
      <table className="min-w-full rounded-lg">
        <thead className="bg-secondary text-surface">
          <tr className="divide-x divide-secondary-hover">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Visitante
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Tipo Doc.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Documento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Destinatario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Área
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Entrada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Salida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-neutral-200 text-text-main">
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
              <td className="px-6 py-4 whitespace-nowrap font-bold text-secondary">
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
                {visit.fecha_salida ? formatDate(visit.fecha_salida) : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => onAction(visit)}
                  className="text-secondary p-2 rounded-lg hover:bg-secondary-light transition-colors duration-200 shadow-md shadow-neutral-400"
                  aria-label={`Ver detalles de ${visit.nombre_visitante}`}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PackagesTable = ({ packages, onAction, formatDate }) => {
  if (packages.length === 0) {
    return (
      <div className="text-center bg-surface text-text-main py-6 rounded-lg shadow-lg">
        <p className="text-xl font-medium">
          No hay paquetes registrados en este momento.
        </p>
        <p className="text-sm mt-1">
          Navega hacia el módulo de paquetes para registrar un nuevo paquete.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-lg shadow-black">
      <table className="w-full rounded-lg">
        <thead className="bg-primary text-surface">
          <tr className="divide-x divide-primary-hover">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Guía
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Tipo Paquete
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Área
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Operación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Recibido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Enviado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-neutral-200 text-text-main">
          {packages.map((pkg) => (
            <tr
              key={pkg.id_paquete}
              className="divide-x divide-neutral-200 hover:bg-background"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                {pkg.guia || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {pkg.PackageType?.descripcion || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {pkg.Area?.nombre_area || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {pkg.tipo_operacion || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {formatDate(pkg.fecha_recibido)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {formatDate(pkg.fecha_envio)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => onAction(pkg)}
                  className="text-primary p-2 rounded-lg hover:bg-primary-light transition-colors duration-200 shadow-md shadow-neutral-400"
                  aria-label={`Ver detalles del paquete`}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * @function ParkingHistoryTable
 * @description Subcomponente que renderiza la tabla de historial de parqueadero.
 * @param {object} props
 * @param {Array<object>} props.parkingLogs - Lista de logs de parqueadero (con 'Vehicle' anidado).
 * @param {Function} props.onAction - Función para abrir el modal de detalles.
 * @param {Function} props.formatDate - Función para formatear fechas.
 * @returns {JSX.Element}
 */
const ParkingHistoryTable = ({ parkingLogs, onAction, formatDate }) => {
  if (parkingLogs.length === 0) {
    return (
      <div className="text-center bg-surface text-text-main py-6 rounded-lg shadow-lg">
        <p className="text-xl font-medium">
          No hay registros de parquedero para mostrar
        </p>
        <p className="text-sm mt-1">
          Navega hacia el módulo de "parqueadero" y registra una entrada.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-lg shadow-black">
      <table className="min-w-full rounded-lg">
        {/* Usamos color neutro (ej. 'tertiary' o gris) para el header */}
        <thead className="bg-neutral-600 text-surface">
          <tr className="divide-x divide-neutral-700">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Placa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Dueño
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
              Identificación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Entrada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Salida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
              Portero (Salida)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-neutral-200 text-text-main">
          {parkingLogs.map((log) => {
            return (
              <tr
                key={log.id_historial}
                className="divide-x divide-neutral-200 hover:bg-background"
              >
                <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-tertiary">
                  {log.Vehicle?.placa || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {log.Vehicle?.tipo_vehiculo || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.Vehicle?.nombre_dueno || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {log.Vehicle?.identificacion_dueno || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(log.fecha_entrada)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(log.fecha_salida)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                  {log.ExitUser?.nombre || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onAction(log.Vehicle)}
                    className="text-neutral-600 p-2 rounded-lg hover:bg-neutral-200 transition-colors"
                    aria-label={`Ver detalles de ${
                      log.Vehicle?.placa || "vehículo"
                    }`}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * @function RadicadosTable
 * @description Subcomponente que renderiza la tabla de historial de radicados.
 * @param {object} props
 * @returns {JSX.Element}
 */
const RadicadosTable = ({ radicados, onAction, formatDate }) => {
  if (radicados.length === 0) {
    return (
      <div className="text-center bg-surface text-text-main py-6 rounded-lg shadow-lg">
        <p className="text-xl font-medium">No hay registros de radicados</p>
        <p className="text-sm mt-1">
          Navega hacia el módulo de "paquetes" y registra un radicado.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-lg shadow-black">
      <table className="min-w-full rounded-lg">
        <thead className="bg-accent text-white">
          {" "}
          <tr className="divide-x divide-accent-hover">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              N° Radicado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Recibido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Recibió (Empleado)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
              Mensajero
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
              Portero (Validador)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-neutral-200 text-text-main">
          {radicados.map((rad) => {
            return (
              <tr
                key={rad.id_paquete}
                className="divide-x divide-neutral-200 hover:bg-background"
              >
                <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-accent">
                  {rad.referencia_radicado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(rad.fecha_recibido)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rad.nombre_recibe_documento || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {rad.mensajero_nombre || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  {rad.PackagesReceived?.nombre
                    ? `${rad.PackagesReceived.nombre} ${
                        rad.PackagesReceived.apellido || ""
                      }`
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onAction(rad)}
                    className="text-accent p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    aria-label={`Ver detalles de ${rad.referencia_radicado}`}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * @function TabButton
 * @description Botón reutilizable para las pestañas.
 */
const TabButton = ({
  label,
  tabName,
  activeTab,
  onClick,
  icon,
  colorClass,
}) => (
  <button
    onClick={() => onClick(tabName)}
    className={`py-3 px-5 font-semibold flex items-center gap-2 ${
      activeTab === tabName
        ? `border-b-2 ${colorClass} ${colorClass.replace("border", "text")}` // ej. border-primary text-primary
        : "text-text-main/60 hover:text-text-main"
    }`}
  >
    <FontAwesomeIcon icon={icon} />
    <span>{label}</span>
  </button>
);

/**
 * @function DashboardHistorialSkeleton
 * @description Muestra una versión de esqueleto de la UI mientras cargan los datos.
 * @returns {JSX.Element}
 */
const DashboardHistorialSkeleton = () => (
  <div className="flex flex-col items-center w-full h-full mb-[50px] p-4 animate-pulse">
    {/* --- Esqueleto del Botón de Volver --- */}
    <div className="md:absolute md:left-[150px] md:top-[100px] mb-5 bg-gray-200 rounded-full shadow-sm md:w-1/12 w-1/2 h-12"></div>

    {/* --- Esqueleto del Título --- */}
    <div className="h-10 sm:h-12 bg-gray-200 rounded w-3/4 max-w-md mx-auto mb-14 mt-10"></div>

    {/* --- Esqueleto de Pestañas --- */}
    <div className="w-full max-w-5xl border-b border-neutral-300 mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="h-12 w-48 bg-gray-200 rounded-t"></div>
        <div className="h-12 w-48 bg-gray-200 rounded-t"></div>
      </div>
    </div>

    {/* --- Esqueleto de Filtros --- */}
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
      <div className="h-12 w-full md:w-1/2 bg-gray-200 rounded-lg"></div>
      <div className="h-12 w-full md:w-3/12 bg-gray-200 rounded-lg"></div>
    </div>

    {/* --- Esqueleto de la Tabla --- */}
    <div className="w-full max-w-5xl">
      <div className="w-full overflow-x-auto rounded-lg shadow-lg bg-surface p-4">
        {/* Esqueleto del Encabezado de la Tabla */}
        <div className="flex justify-between gap-4 mb-4 pb-3 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6 hidden sm:block"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6 hidden md:block"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6 hidden md:block"></div>
        </div>

        {/* Esqueleto de las Filas de la Tabla */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <div className="h-5 bg-gray-200 rounded w-1/6"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6 hidden sm:block"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6 hidden md:block"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6 hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * @function DashboardHistorial
 * @description Renderiza el dashboard unificado de historial.
 * @returns {JSX.Element}
 */
export default function DashboardHistorial() {
  const {
    data,
    activeTab,
    showDetailsModal,
    selectedItem,
    isLoading,
    error,
    noResults,
    searchTerm,
    isExporting,
    setActiveTab,
    handleSearchChange,
    handleSortChange,
    formatDate,
    openDetailsModal,
    closeModal,
    handleExport,
  } = useDashboardHistorial();

  const { isLoading: isAuthLoading } = useAuthStore();

  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");

  if (isLoading || isAuthLoading) {
    return <DashboardHistorialSkeleton />;
  }

  let modalConfig = packageConfig;
  let modalTitle = "Detalles del Paquete";
  let modalTheme = "primary";

  if (activeTab === "visitas") {
    modalConfig = visitConfig;
    modalTitle = "Detalles de la Visita";
    modalTheme = "secondary";
  } else if (activeTab === "parqueadero") {
    modalConfig = vehicleConfig;
    modalTitle = "Detalles del Vehículo";
    modalTheme = "neutral-600";
  } else if (activeTab === "radicados") {
    modalConfig = radicadoConfig;
    modalTitle = "Detalles del Radicado";
    modalTheme = "accent";
  }

  return (
    <div className="flex flex-col items-center w-full h-full mb-[50px] p-4">
      {/* --- Botón de Volver --- */}
      <button
        type="button"
        onClick={goBack}
        className="md:absolute md:left-[150px] md:top-[100px] mb-5 bg-surface text-text-main font-bold p-3 rounded-full shadow-sm shadow-black md:w-1/12 w-1/2 hover:bg-background transition-colors"
        aria-label="Volver al dashboard"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>

      {/* --- Título --- */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-14 text-center text-secondary">
        Historial de Registros
      </h1>

      {/* --- Pestañas --- */}
      <div className="w-full max-w-5xl border-b border-neutral-300 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <TabButton
            label="Historial de Visitas"
            tabName="visitas"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={faUserClock}
            colorClass="border-secondary text-secondary"
          />
          <TabButton
            label="Historial de Paquetes"
            tabName="paquetes"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={faBoxesPacking}
            colorClass="border-primary text-primary"
          />
          <TabButton
            label="Historial de Parqueadero"
            tabName="parqueadero"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={faCar}
            colorClass="border-tertiary text-tertiary"
          />
          <TabButton
            label="Historial de Radicados"
            tabName="radicados"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={faFileInvoice}
            colorClass="border-accent text-accent"
          />
        </div>
      </div>

      {/* --- Filtros --- */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder={
              activeTab === "visitas"
                ? "Buscar por visitante, documento, destinatario..."
                : activeTab === "paquetes"
                ? "Buscar por guía, remitente, destinatario..."
                : activeTab === "parqueadero"
                ? "Buscar por placa, dueño, identificación..."
                : "Buscar por N° radicado, mensajero..."
            }
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 border text-text-main border-neutral-300 rounded-lg bg-surface"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-main/70"
          />
        </div>
        <select
          onChange={handleSortChange}
          defaultValue="fecha_desc"
          className="w-full md:w-3/12 p-3 border border-neutral-300 rounded-lg bg-surface text-text-main"
        >
          <option value="fecha_desc">Más Recientes Primero</option>
          <option value="fecha_asc">Más Antiguos Primero</option>
        </select>

        {activeTab === "radicados" && (
          <>
            <button
              onClick={() => handleExport("excel")} // Llama con 'excel'
              disabled={isExporting}
              className="w-full md:w-auto p-3 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold rounded-lg shadow hover:bg-green-800 disabled:bg-gray-400"
            >
              <FontAwesomeIcon icon={faFileExcel} />
              {isExporting ? "Exportando..." : "Excel"}
            </button>
            <button
              onClick={() => handleExport("pdf")} // Llama con 'pdf'
              disabled={isExporting}
              className="w-full md:w-auto p-3 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 disabled:bg-gray-400"
            >
              <FontAwesomeIcon icon={faFilePdf} />
              {isExporting ? "Exportando..." : "PDF"}
            </button>
          </>
        )}
      </div>

      {/* --- Contenido (Tablas y Estados) --- */}
      <div className="w-full max-w-5xl">
        {isLoading && (
          <div className="py-8 w-full text-center text-lg font-semibold text-primary">
            Cargando historial...
          </div>
        )}

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
                <p className="font-bold text-lg">Error de Carga</p>
              </div>
              <p className="text-lg mt-[10px]">{error}</p>
            </div>
          </div>
        )}

        {noResults && !isLoading && !error && (
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

        {!isLoading &&
          !error &&
          !noResults &&
          (activeTab === "visitas" ? (
            <VisitsTable
              visits={data}
              onAction={openDetailsModal}
              formatDate={formatDate}
            />
          ) : activeTab === "paquetes" ? (
            <PackagesTable
              packages={data}
              onAction={openDetailsModal}
              formatDate={formatDate}
            />
          ) : activeTab === "parqueadero" ? (
            <ParkingHistoryTable
              parkingLogs={data}
              onAction={openDetailsModal}
              formatDate={formatDate}
            />
          ) : (
            <RadicadosTable
              radicados={data}
              onAction={openDetailsModal}
              formatDate={formatDate}
            />
          ))}
      </div>

      {showDetailsModal && selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={closeModal}
          title={modalTitle}
          config={modalConfig}
          themeColor={modalTheme}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
