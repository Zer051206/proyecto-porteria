/**
 * @file DasboardParking.jsx
 * @module components/parking/DashboardParking.jsx
 * @description Dashboard principal para la gestión del parqueadero. Muestra vehículos,
 * permite añadir nuevos y registrar entradas/salidas.
 * @requires react
 * @requires react-router-dom
 * @requires @fortawesome/react-fontawesome
 * @requires ../../hooks/parking/useDasboardParking.js
 * @requires ../../components/parking/VehicleTable.jsx
 * @requires ../../components/parking/VehicleForm.jsx
 * @requires ../../components/historial/HistoryDetailModal.jsx
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faPlus,
  faCar,
  faMotorcycle,
  faBicycle,
  faQuestionCircle,
  faExclamationTriangle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/authStore.js";
import { useDashboardParking } from "../../hooks/parking/useDashboardParking.js";
import DetailModal from "../utils/DetailModal.jsx";
import VehicleForm from "./VehicleForm.jsx";
import { vehicleConfig } from "../../hooks/utils/detailModalConfig.js";

/**
 * @function DasboardParkingSkeleton
 * @description Componente de esqueleto para el Dashboard de Parqueadero.
 * @returns {JSX.Element}
 */
const DasboardParkingSkeleton = () => (
  <div className="flex flex-col items-center w-full animate-pulse p-4 mb-[50px]">
    {/* Esqueleto Botón Volver */}
    <div className="md:absolute md:left-[150px] md:top-[100px] mb-5 bg-gray-200 rounded-full h-12 md:w-1/12 w-1/2"></div>
    {/* Esqueleto Título */}
    <div className="h-10 sm:h-12 bg-gray-200 rounded w-3/4 max-w-md mx-auto mb-10 mt-10"></div>

    {/* Esqueleto Header */}
    <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="h-10 bg-gray-300 rounded w-48"></div>{" "}
      {/* Botón Añadir Vehículo */}
      {/* Esqueleto Contadores Ocupación */}
      <div className="flex gap-2 sm:gap-4 p-2 bg-gray-100 rounded-lg shadow-inner order-1 md:order-2 flex-wrap justify-center">
        <div className="h-14 w-20 bg-gray-200 rounded"></div>
        <div className="h-14 w-20 bg-gray-200 rounded"></div>
        <div className="h-14 w-20 bg-gray-200 rounded"></div>
        <div className="h-14 w-20 bg-gray-200 rounded"></div>
      </div>
    </header>

    {/* Esqueleto Búsqueda */}
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
      <div className="h-12 w-full md:w-1/2 bg-gray-200 rounded-lg"></div>{" "}
      {/* Search */}
    </div>

    {/* Esqueleto Tabla */}
    <div className="w-full max-w-5xl bg-surface rounded-lg shadow-md p-4">
      {/* Header Tabla */}
      <div className="flex justify-between gap-4 pb-3 border-b border-gray-200 mb-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
        ))}
      </div>
      {/* Filas Tabla */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <div className="h-6 w-8 bg-gray-300 rounded"></div> {/* Icono */}
            <div className="h-5 bg-gray-200 rounded w-1/6"></div> {/* Placa */}
            <div className="h-5 bg-gray-200 rounded w-1/5"></div> {/* Dueño */}
            <div className="h-5 bg-gray-200 rounded w-1/6 hidden md:block"></div>{" "}
            {/* ID */}
            <div className="h-5 bg-gray-200 rounded w-1/6 hidden lg:block"></div>{" "}
            {/* Modelo */}
            <div className="h-8 w-24 bg-gray-300 rounded-full"></div>{" "}
            {/* Switch */}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * @function OccupancyCounter
 * @description Muestra el contador de ocupación para un tipo de vehículo.
 * @returns {JSX.Element}
 */
const OccupancyCounter = ({ label, count, limit, icon }) => (
  <div className="flex flex-col items-center px-3 py-1 bg-gray-200 rounded">
    <FontAwesomeIcon icon={icon} className="text-lg text-neutral-600 mb-1" />
    <span className="text-xs text-neutral-500 font-medium">{label}</span>
    <span
      className={`font-bold text-sm ${
        count >= limit ? "text-error" : "text-text-main"
      }`}
    >
      {count}/{limit}
    </span>
  </div>
);

/**
 * @function SwitchToggle
 * @description Un componente de switch (interruptor) estilizado con Tailwind.
 * @returns {JSX.Element}
 */
const SwitchToggle = ({ id, checked, onChange, disabled, ariaLabel }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      {/* Fondo del switch */}
      <div
        className={`block w-14 h-8 rounded-full transition ${
          checked ? "bg-success" : "bg-neutral-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      ></div>
      {/* Círculo (Knob) */}
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          checked ? "translate-x-6" : ""
        } ${disabled ? "bg-neutral-100" : ""}`}
      ></div>
    </div>
  </label>
);

/**
 * @file VehicleTable.jsx
 * @description Tabla que muestra los vehículos registrados y permite cambiar su estado (dentro/fuera).
 * @param {object} props
 * @param {Array<object>} props.vehicles - Lista de vehículos a mostrar (ya filtrada).
 * @param {Function} props.onToggleStatus - Función a llamar al cambiar el switch.
 * @param {boolean} props.isSubmitting - Estado para deshabilitar los switches.
 * @param {Function} props.onViewDetails - Función para abrir modal de detalles.
 * @returns {JSX.Element}
 */
const VehicleTable = ({
  vehicles,
  onToggleStatus,
  isSubmitting,
  onViewDetails,
}) => {
  const getVehicleIcon = (type) => {
    switch (type) {
      case "Carro":
        return faCar;
      case "Moto":
        return faMotorcycle;
      case "Bicicleta":
        return faBicycle;
      case "Otros":
        return faQuestionCircle;
      default:
        return faQuestionCircle;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md shadow-black bg-surface">
      <table className="min-w-full rounded-lg">
        <thead className="bg-gray-100 border-b border-neutral-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 bg-background uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 bg-background uppercase tracking-wider">
              Placa / Código Sensor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 bg-background uppercase tracking-wider">
              Dueño
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 bg-background uppercase tracking-wider hidden md:table-cell">
              Identificación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 bg-background uppercase tracking-wider hidden lg:table-cell">
              Modelo/Lugar
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 bg-background uppercase tracking-wider">
              Estado (Dentro/Fuera)
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 bg-background uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 text-text-main">
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id_vehiculo}
              className="hover:bg-background transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap bg-surface text-center">
                <FontAwesomeIcon
                  icon={getVehicleIcon(vehicle.tipo_vehiculo)}
                  className="text-xl text-neutral-500"
                  title={vehicle.tipo_vehiculo}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap bg-surface">
                <span className="font-semibold font-mono text-base">
                  {vehicle.placa || "N/A"}
                </span>
                {vehicle.codigo_sensor && (
                  <span className="block text-xs text-neutral-500 font-mono">
                    Sensor: {vehicle.codigo_sensor}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap bg-surface">
                {vehicle.nombre_dueno}
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden bg-surface md:table-cell">
                {vehicle.identificacion_dueno}
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden bg-surface lg:table-cell text-sm text-neutral-600">
                <span className="block">
                  {vehicle.modelo_descripcion || "-"}
                </span>
                {vehicle.lugar_asignado_default && (
                  <span className="block text-xs font-semibold text-blue-600">
                    Lugar: {vehicle.lugar_asignado_default}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap bg-surface text-center">
                <div className="flex flex-col items-center justify-center">
                  <SwitchToggle
                    id={`vehicle-toggle-${vehicle.id_vehiculo}`}
                    checked={vehicle.esta_dentro}
                    onChange={() => onToggleStatus(vehicle)}
                    disabled={isSubmitting} // Deshabilita mientras se procesa
                    ariaLabel={`Marcar ${
                      vehicle.esta_dentro ? "salida" : "entrada"
                    } para ${
                      vehicle.placa || "vehículo " + vehicle.id_vehiculo
                    }`}
                  />
                  <span
                    className={`mt-1 text-xs font-semibold ${
                      vehicle.esta_dentro ? "text-success" : "text-neutral-500"
                    }`}
                  >
                    {vehicle.esta_dentro ? "Dentro" : "Fuera"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap bg-surface text-center">
                <button
                  onClick={() => onViewDetails(vehicle)}
                  className="text-primary hover:text-primary-hover disabled:text-neutral-300"
                  title="Ver Detalles"
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
 * @function DasboardParking
 * @description Renderiza el dashboard de gestión de parqueadero.
 * @returns {JSX.Element}
 */
export default function DasboardParking() {
  const navigate = useNavigate();
  const goBack = () => navigate("/dashboard");
  const { isLoading: isAuthLoading } = useAuthStore();

  const {
    filteredVehicles,
    ocupacion,
    isLoading,
    error,
    searchTerm,
    showAddModal,
    showDetailsModal,
    selectedVehicle,
    isSubmitting,
    handleSearchChange,
    openAddModal,
    closeModal,
    openDetailsModal,
    handleAddVehicleSuccess,
    toggleVehiculoStatus,
    refetch,
    formatDate,
  } = useDashboardParking();

  const showSkeleton = isAuthLoading || isLoading;

  if (showSkeleton) {
    return <DasboardParkingSkeleton />;
  }

  return (
    <div className="flex flex-col items-center w-full h-full mb-[50px] p-4">
      {/* --- Botón Volver --- */}
      <button
        type="button"
        onClick={goBack}
        className="md:absolute md:left-[150px]  md:top-[100px] mb-5 bg-surface text-text-main font-bold p-3 rounded-full shadow-sm  shadow-black md:w-1/12 w-1/2 hover:bg-background transition-colors"
        aria-label="Volver al dashboard"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>

      {/* --- Título Principal --- */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center text-primary mt-5">
        Gestión de Parqueadero
      </h1>

      {/* --- Header con Botón Añadir y Ocupación --- */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button
          onClick={openAddModal} // Llama a la función del hook
          className="bg-primary text-surface font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow order-2 md:order-1"
          aria-label="Añadir nuevo vehículo"
        >
          <FontAwesomeIcon icon={faPlus} /> Añadir Vehículo
        </button>
        {/* Contadores de Ocupación */}
        <div className="flex gap-2 sm:gap-4 p-2 bg-gray-100 rounded-lg shadow-inner order-1 md:order-2 flex-wrap justify-center">
          <OccupancyCounter
            label="Carros"
            count={ocupacion.carros?.actual}
            limit={ocupacion.carros?.limite}
            icon={faCar}
          />
          <OccupancyCounter
            label="Motos"
            count={ocupacion.motos?.actual}
            limit={ocupacion.motos?.limite}
            icon={faMotorcycle}
          />
          <OccupancyCounter
            label="Bicis"
            count={ocupacion.bicicletas?.actual}
            limit={ocupacion.bicicletas?.limite}
            icon={faBicycle}
          />
          <OccupancyCounter
            label="Otros"
            count={ocupacion.otros?.actual}
            limit={ocupacion.otros?.limite}
            icon={faQuestionCircle}
          />
        </div>
      </header>

      {/* --- Barra de Búsqueda --- */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Buscar por Placa o Identificación..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 border text-text-main border-neutral-300 rounded-lg bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-main/70"
          />
        </div>
      </div>

      {/* --- Tabla de Vehículos / Mensaje de Error / Sin Resultados --- */}
      <div className="w-full max-w-5xl">
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
                <p className="font-bold text-lg">Error al Cargar Vehículos</p>
              </div>
              <p className="text-lg mt-[10px]">{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
        {!error && filteredVehicles.length === 0 && (
          <div className="text-center w-full p-10 text-neutral-500 italic">
            {searchTerm
              ? "No se encontraron vehículos con ese criterio."
              : "No hay vehículos registrados."}
          </div>
        )}
        {!error && filteredVehicles.length > 0 && (
          <VehicleTable
            vehicles={filteredVehicles}
            onToggleStatus={toggleVehiculoStatus}
            isSubmitting={isSubmitting}
            onViewDetails={openDetailsModal}
          />
        )}
      </div>

      {/* --- Modal Condicional para Añadir Vehículo --- */}
      {showAddModal && (
        <VehicleForm onClose={closeModal} onSuccess={handleAddVehicleSuccess} />
      )}

      {/* Renderiza HistoryDetailModal usando showDetailsModal */}
      {showDetailsModal && selectedVehicle && (
        <DetailModal
          item={selectedVehicle}
          onClose={closeModal}
          title="Detalles del Vehículo"
          config={vehicleConfig}
          themeColor="primary"
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
