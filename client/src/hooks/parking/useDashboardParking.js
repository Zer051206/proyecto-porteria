/**
 * @file useDashboardParking.js
 * @module hooks/parking
 * @description Hook de React para manejar la lógica y el estado del dashboard de parqueadero.
 * Obtiene vehículos, gestiona filtros, estado de modales y acciones de entrada/salida.
 * @requires react
 * @requires react-hot-toast
 * @requires ../../config/axios.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "../../config/axios.js";
import { formatDate } from "../../utils/dateFormat.js";

export const useDashboardParking = () => {
  /**
   * @state {Array<object>} allVehicles
   * @description Lista completa de *todos* los vehículos activos registrados en el sistema.
   */
  const [allVehicles, setAllVehicles] = useState([]);

  /**
   * @state {object} ocupacion
   * @description Objeto con los conteos actuales vs. límites de capacidad.
   */
  const [ocupacion, setOcupacion] = useState({
    carros: { actual: 0, limite: 0 },
    motos: { actual: 0, limite: 0 },
    bicicletas: { actual: 0, limite: 0 },
    otros: { actual: 0, limite: 0 },
  });

  /**
   * @state {boolean} isLoading
   * @description Verdadero durante la carga inicial de datos.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @state {boolean} showDetailsModal
   * @description Controla la visibilidad del modal "Detalles del Vehículo".
   */
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  /**
   * @state {string|null} error
   * @description Mensaje de error si falla la carga de datos.
   */
  const [error, setError] = useState(null);

  /**
   * @state {object|null} selectedVehicle
   * @description Almacena el vehículo seleccionado para el modal de detalles.
   */
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  /**
   * @state {boolean} isSubmitting
   * @description Verdadero mientras se procesa una solicitud de entrada/salida (para deshabilitar switches).
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * @state {boolean} showAddModal
   * @description Controla la visibilidad del modal "Añadir Vehículo(s)".
   */
  const [showAddModal, setShowAddModal] = useState(false);

  // --- Estados de Control ---
  /**
   * @state {string} searchTerm
   * @description Valor actual del campo de búsqueda.
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * @function fetchInitialData
   * @description Obtiene todos los datos necesarios para el dashboard (lista de vehículos y ocupación).
   * Se usa `useCallback` para evitar re-creaciones innecesarias.
   */
  const fetchInitialData = useCallback(async () => {
    setError(null);
    try {
      const [vehiclesResponse, occupancyResponse] = await Promise.all([
        api.get("/api/parqueadero/vehiculos"),
        api.get("/api/parqueadero/ocupacion"),
      ]);
      setAllVehicles(vehiclesResponse.data.vehicles || []);
      setOcupacion(occupancyResponse.data.data || {});
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Error al cargar los datos del parqueadero.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching parking data:", err);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true); // Pone loading
    fetchInitialData().finally(() => setIsLoading(false)); // Llama al fetch y quita loading
  }, [fetchInitialData]);

  // Efecto para la carga inicial de datos al montar el componente
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]); // Se ejecuta solo una vez al montar

  /**
   * @function handleSearchChange
   * @description Actualiza el estado `searchTerm` cada vez que el usuario escribe en el input.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * @const {Array<object>} filteredVehicles
   * @description Lista de vehículos filtrada por el `searchTerm`.
   * Se usa `useMemo` para recalcular solo si `allVehicles` o `searchTerm` cambian.
   * La lógica de filtrado (búsqueda) se maneja aquí en el frontend.
   */
  const filteredVehicles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return allVehicles; // Si no hay búsqueda, devuelve todos
    }
    return allVehicles.filter(
      (vehicle) =>
        // Busca por placa (asegurándose que no sea null)
        (vehicle.placa && vehicle.placa.toLowerCase().includes(term)) ||
        // Busca por identificación del dueño
        (vehicle.identificacion_dueno &&
          vehicle.identificacion_dueno.toLowerCase().includes(term)) ||
        // busca por nombre de dueño
        (vehicle.nombre_dueno &&
          vehicle.nombre_dueno.toLowerCase().includes(term))
    );
  }, [allVehicles, searchTerm]);

  // --- Handlers para Modales ---

  const openAddModal = () => setShowAddModal(true);

  /**
   * @function closeModal
   * @description Cierra CUALQUIER modal abierto y limpia los estados de selección.
   */
  const closeModal = () => {
    setShowAddModal(false);
    setShowDetailsModal(false);
    setSelectedVehicle(null);
  };

  /**
   * @function openDetailsModal
   * @description Abre el modal de detalles y guarda el vehículo seleccionado.
   * @param {object} vehicle - El vehículo a mostrar.
   */
  const openDetailsModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailsModal(true);
  };

  /**
   * @function handleAddVehicleSuccess
   * @description Callback que se ejecuta cuando el modal `AddVehicleModal` termina exitosamente.
   * Cierra el modal y refresca los datos.
   */
  const handleAddVehicleSuccess = () => {
    closeModal();
    fetchInitialData();
  };

  /**
   * @function toggleVehiculoStatus
   * @description Maneja la lógica de registrar ENTRADA o SALIDA al cambiar el switch.
   * Llama a los endpoints del backend que contienen la validación de capacidad.
   * @param {object} vehicle - El objeto vehículo de la fila (requiere `id_vehiculo` y `esta_dentro`).
   */
  const toggleVehiculoStatus = useCallback(
    async (vehicle) => {
      if (isSubmitting) return;

      const { id_vehiculo, esta_dentro, placa, tipo_vehiculo } = vehicle;
      const actionText = esta_dentro ? "salida" : "entrada";
      const toastId = toast.loading(
        `Registrando ${actionText} para ${placa || tipo_vehiculo}...`
      );
      setIsSubmitting(true);

      try {
        if (esta_dentro) {
          // --- REGISTRAR SALIDA ---
          // El vehículo está DENTRO, va a SALIR
          await api.patch(`/api/parqueadero/vehiculos/salida/${id_vehiculo}`);
          toast.success(`Salida registrada para ${placa || tipo_vehiculo}.`, {
            id: toastId,
          });
        } else {
          // --- REGISTRAR ENTRADA ---
          // El vehículo está FUERA, va a ENTRAR
          let ocupKey = "";
          if (tipo_vehiculo === "Carro") ocupKey = "carros";
          else if (tipo_vehiculo === "Moto") ocupKey = "motos";
          else if (tipo_vehiculo === "Bicicleta") ocupKey = "bicicletas";
          else if (tipo_vehiculo === "Otros") ocupKey = "otros";

          const ocup = ocupacion[ocupKey];

          if (ocup && ocup.actual >= ocup.limite) {
            throw new Error(
              `Capacidad máxima alcanzada para ${tipo_vehiculo}.`
            ); // Error local
          }

          await api.post("/api/parqueadero/vehiculos/entrada", { id_vehiculo });
          toast.success(`Entrada registrada para ${placa || tipo_vehiculo}.`, {
            id: toastId,
          });
        }

        await fetchInitialData();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          `Error al registrar la ${actionText}.`;
        toast.error(errorMsg, { id: toastId });
        console.error(`Error al registrar ${actionText}:`, err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, fetchInitialData, ocupacion]
  ); // Depende de estas variables

  return {
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
    refetch: fetchInitialData,
    formatDate,
  };
};
