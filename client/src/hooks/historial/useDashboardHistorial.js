/**
 * @file useDashboardHistorial.js
 * @module Hooks/Historial
 * @description Hook unificado para el dashboard de historial. Gestiona la carga de datos
 * de visitas y paquetes, y maneja el estado de pestañas, filtros y ordenación.
 * @requires react
 * @requires ../../config/axios.js
 * @requires ../../utils/dateFormat.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/dateFormat.js";

/**
 * @typedef {'visitas' | 'paquetes'} TabType
 */

export const useDashboardHistorial = () => {
  // --- Estados de Datos ---
  const [originalVisits, setOriginalVisits] = useState([]);
  const [originalPackages, setOriginalPackages] = useState([]);
  const [originalParkingLogs, setOriginalParkingLogs] = useState([]);

  // --- Estados de UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Estados de Control ---
  const [activeTab, setActiveTab] = useState("visitas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fecha_desc"); // 'fecha_desc', 'fecha_asc'

  // --- Estados de Modal ---
  /**
   * @state {boolean} showDetailsModal
   * @description Controla la visibilidad del modal de detalles.
   */
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  /**
   * @state {object|null} selectedItem
   * @description Almacena el objeto (visita o paquete) seleccionado para mostrar en el modal.
   */
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * @function fetchData
   * @description Obtiene todos los datos (visitas y paquetes) en paralelo.
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Hacemos ambas peticiones al mismo tiempo para más eficiencia
      const [visitsResponse, packagesResponse, parkingLogsResponse] =
        await Promise.all([
          api.get("/api/historial/visitas"),
          api.get("/api/historial/paquetes"),
          api.get("/api/historial/parqueadero"),
        ]);

      setOriginalVisits(visitsResponse.data || []);
      setOriginalPackages(packagesResponse.data || []);
      setOriginalParkingLogs(parkingLogsResponse.data || []);
    } catch (err) {
      setError("Error al cargar el historial. Intenta recargar la página.");
      toast.error("No se pudo cargar el historial.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial de datos
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * @const {Array<object>} filteredData
   * @description Memoriza la lista de datos filtrada y ordenada según la pestaña activa.
   * Este es el núcleo de la lógica de tu hook.
   */
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();

    // 1. Seleccionar qué datos usar (visitas o paquetes)
    const sourceData =
      activeTab === "visitas"
        ? originalVisits
        : activeTab === "paquetes"
        ? originalPackages
        : originalParkingLogs;

    // 2. Filtrar los datos
    const filtered = sourceData.filter((item) => {
      if (!term) return true; // Si no hay búsqueda, no filtrar

      if (activeTab === "visitas") {
        // Lógica de búsqueda para Visitas
        const nombreVisitante = (item.nombre_visitante || "").toLowerCase();
        const identificacion = (item.identificacion || "").toLowerCase();
        const destinatario = (item.nombre_destinatario || "").toLowerCase();
        const area = (item.Area?.nombre_area || "").toLowerCase();

        return (
          nombreVisitante.includes(term) ||
          identificacion.includes(term) ||
          destinatario.includes(term) ||
          area.includes(term)
        );
      } else if (activeTab === "paquetes") {
        // Lógica de búsqueda para Paquetes
        const guia = (item.guia || "").toLowerCase();
        const destinatario = (item.nombre_destinatario || "").toLowerCase();
        const remitente = (item.nombre_remitente || "").toLowerCase();
        const area = (item.Area?.nombre_area || "").toLowerCase();
        const tipoPaquete = (item.PackageType?.descripcion || "").toLowerCase();

        return (
          guia.includes(term) ||
          destinatario.includes(term) ||
          remitente.includes(term) ||
          area.includes(term) ||
          tipoPaquete.includes(term)
        );
      } else if (activeTab === "parqueadero") {
        const placa = (item.vehicle?.placa || "").toLowerCase();
        const nombre_dueno = (item.Vehicle?.placa || "").toLowerCase();
        const identificacion_dueno = (
          item.Vehicle?.identificacion_dueno || ""
        ).toLowerCase();
        const nombreUsuarioEntrada = (
          item.EntryUser.nombre || ""
        ).toLowerCase();
        const nombreUsuarioSalida = (item.ExitUser.nombre || "").toLowerCase();
        const tipo_vehiculo = (item.Vehicle?.tipo_vehiculo || "").toLowerCase();

        return (
          placa.includes(term) ||
          nombre_dueno.includes(term) ||
          identificacion_dueno.includes(term) ||
          nombreUsuarioEntrada.includes(term) ||
          nombreUsuarioSalida.includes(term) ||
          tipo_vehiculo.includes(term)
        );
      }
    });

    // 3. Ordenar los datos filtrados
    return filtered.sort((a, b) => {
      const dateA = new Date(
        activeTab === "visitas" ? a.fecha_entrada : a.fecha_recibido
      );
      const dateB = new Date(
        activeTab === "visitas" ? b.fecha_entrada : b.fecha_recibido
      );

      if (sortBy === "fecha_asc") {
        return dateA - dateB; // Más antiguo primero
      }
      return dateB - dateA; // 'fecha_desc' (Más reciente primero)
    });
  }, [
    activeTab,
    searchTerm,
    sortBy,
    originalVisits,
    originalPackages,
    originalParkingLogs,
  ]);

  // 4. Estado derivado para "No hay resultados"
  const noResults = filteredData.length === 0 && searchTerm.length > 0;

  /**
   * @function openDetailsModal
   * @description Abre el modal de detalles y guarda el item seleccionado.
   * @param {object} item - La visita o paquete a mostrar.
   */
  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  /**
   * @function closeModal
   * @description Cierra el modal de detalles y limpia el item seleccionado.
   */
  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedItem(null);
  };

  /**
   * @function handleSearchChange
   * @description Actualiza el estado `searchTerm` desde un evento de input.
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * @function handleSortChange
   * @description Actualiza el estado `sortBy` desde un evento de select.
   */
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return {
    data: filteredData,
    activeTab,
    showDetailsModal,
    selectedItem,
    isLoading,
    error,
    noResults,
    searchTerm,
    setActiveTab,
    handleSearchChange,
    handleSortChange,
    refetch: fetchData,
    formatDate,
    openDetailsModal,
    closeModal,
  };
};
