/**
 * @file DashboardHistorial.jsx
 * @module Components/Dashboard/Historial
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
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore";
import { useDashboardHistorial } from "../../hooks/historial/useDashboardHistorial";

const VisitsTable = ({ visits, onAction, formatDate }) => {
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
              <td className="px-6 py-4 whitespace-nowrap">
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
                  onClick={() => onAction("visita", visit)} // Llama al handler del padre
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                  onClick={() => onAction("paquete", pkg)} // Llama al handler del padre
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

// Fila de detalle reutilizable
const DetailRow = ({ label, value }) => (
  <p className="text-base text-text-main">
    <strong className="font-semibold">{label}:</strong> {value || "N/A"}
  </p>
);

export const HistoryDetailModal = ({ item, onClose, type, formatDate }) => {
  if (!item) return null;

  const isVisit = type === "visita";
  const title = isVisit ? "Detalles de la Visita" : "Detalles del Paquete";
  const titleColor = isVisit ? "text-secondary" : "text-primary";
  const buttonClass = isVisit
    ? "bg-secondary text-surface hover:bg-secondary-hover"
    : "bg-primary text-surface hover:bg-primary-hover";

  return (
    <div className="fixed inset-0 bg-text-main/80 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div
        className="relative bg-background p-3 rounded-lg shadow-2xl w-full max-w-md mx-2 animate-fadeIn"
        key={item.id_visita || item.id_paquete}
      >
        <h3
          className={`text-2xl font-bold ${titleColor} mb-6 text-center border-b pb-2`}
        >
          {title}
        </h3>

        {/* --- Contenido del modal --- */}
        <div className="space-y-4 text-text-main">
          {isVisit ? (
            /* --- Detalles de Visita --- */
            <>
              <DetailRow label="Nombre" value={item.nombre_visitante} />
              <DetailRow
                label="Tipo ID"
                value={item.IdentificationType?.descripcion}
              />
              <DetailRow label="Identificación" value={item.identificacion} />
              <DetailRow label="Empresa" value={item.empresa} />
              <DetailRow
                label="Destinatario"
                value={item.nombre_destinatario}
              />
              <DetailRow label="Área" value={item.Area?.nombre_area} />
              <DetailRow label="Motivo" value={item.motivo} />
              <DetailRow
                label="Fecha Entrada"
                value={formatDate(item.fecha_entrada)}
              />
              <DetailRow
                label="Fecha Salida"
                value={
                  item.fecha_salida
                    ? formatDate(item.fecha_salida)
                    : "Pendiente"
                }
              />
              {item.observaciones && (
                <DetailRow label="Observaciones" value={item.observaciones} />
              )}
            </>
          ) : (
            /* --- Detalles de Paquete --- */
            <>
              <DetailRow label="Guía" value={item.guia} />
              <DetailRow
                label="Tipo Paquete"
                value={item.PackageType?.descripcion}
              />
              <DetailRow label="Operación" value={item.tipo_operacion} />
              <DetailRow label="Remitente" value={item.nombre_remitente} />
              <DetailRow
                label="Destinatario"
                value={item.nombre_destinatario}
              />
              <DetailRow label="Área" value={item.Area?.nombre_area} />
              <DetailRow
                label="Transportadora"
                value={item.empresa_transporte}
              />
              <DetailRow label="Mensajero" value={item.mensajero_nombre} />
              <DetailRow label="Destino (Salida)" value={item.destino_salida} />
              <DetailRow
                label="Fecha Recibido"
                value={formatDate(item.fecha_recibido)}
              />
              <DetailRow
                label="Fecha Enviado"
                value={formatDate(item.fecha_envio)}
              />
              {item.observaciones && (
                <DetailRow label="Observaciones" value={item.observaciones} />
              )}
            </>
          )}
        </div>

        {/* --- Botón de Cierre --- */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 font-semibold rounded-md shadow-md transition-colors ${buttonClass}`}
          >
            Cerrar
          </button>
        </div>
      </div>
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
    setActiveTab,
    isLoading,
    error,
    noResults,
    searchTerm,
    handleSearchChange,
    handleSortChange,
    formatDate,
  } = useDashboardHistorial();

  const { idLoading } = useAuthStore();

  // Estado local solo para el modal
  const [modal, setModal] = useState({ type: null, data: null });

  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");

  // Handlers para el modal
  const handleAction = (type, item) => setModal({ type, data: item });
  const closeModal = () => setModal({ type: null, data: null });

  if (isLoading) {
    return <DashboardHistorialSkeleton />;
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
        </div>
      </div>

      {/* --- Filtros --- */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder={
              activeTab === "visitas"
                ? "Buscar por visitante, documento, destinatario, área..."
                : "Buscar por guía, remitente, destinatario, área..."
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
              onAction={handleAction}
              formatDate={formatDate}
            />
          ) : (
            <PackagesTable
              packages={data}
              onAction={handleAction}
              formatDate={formatDate}
            />
          ))}
      </div>

      {/* --- Modal Unificado --- */}
      {modal.data && (
        <HistoryDetailModal
          item={modal.data}
          onClose={closeModal}
          type={modal.type}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
