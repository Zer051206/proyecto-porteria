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
  const [originalFiles, setOriginalFiles] = useState([]);

  // --- Estados de UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- Estados de Control ---
  const [activeTab, setActiveTab] = useState("visitas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fecha_desc");

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
      const [
        visitsResponse,
        packagesResponse,
        parkingLogsResponse,
        filesResponse,
      ] = await Promise.all([
        api.get("/api/historial/visitas"),
        api.get("/api/historial/paquetes"),
        api.get("/api/historial/parqueadero"),
        api.get("/api/historial/radicados"),
      ]);

      setOriginalVisits(visitsResponse.data || []);
      setOriginalPackages(packagesResponse.data || []);
      setOriginalParkingLogs(parkingLogsResponse.data || []);
      setOriginalFiles(filesResponse.data || []);
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
        : activeTab === "parqueadero"
        ? originalParkingLogs
        : originalFiles;

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
      } else if (activeTab === "radicados") {
        const referenciaRadicado = (
          item.files?.referencia_radicado || ""
        ).toLowerCase();
        const receptor = (item.files?.nombre_quien_recibe || "").toLowerCase();
        const area = item.files?.Area?.nombre_area;

        return (
          referenciaRadicado.includes(term) ||
          receptor.includes(term) ||
          area.includes(term)
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
    originalFiles,
  ]);

  // 4. Estado derivado para "No hay resultados"
  const noResults = filteredData.length === 0 && searchTerm.length > 0;

  /**
   * @function handleExport
   * @description Llama al endpoint de exportación en el backend y fuerza la descarga del archivo.
   * @param {'xlsx' | 'pdf'} format - El formato de archivo a exportar.
   */
  const handleExport = useCallback(
    async (format) => {
      if (activeTab !== "radicados") {
        toast.error(
          "La función de exportar solo está disponible para la pestaña de Radicados."
        );
        return;
      }

      // Solo permitir exportar si no está cargando datos y si hay algo que exportar
      if (isLoading || isExporting || filteredData.length === 0) {
        if (filteredData.length === 0) {
          toast.error("No hay datos para exportar.");
        }
        return;
      }

      setIsExporting(true);
      toast.loading(`Generando archivo ${format.toUpperCase()}...`, {
        id: "export_toast",
      });

      try {
        // --- 1. Definir MIME Type para el Blob local ---
        const mimeType =
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        // --- 2. Crear un nombre de archivo de respaldo (fallback) con timestamp ---
        // Este nombre se usa si la extracción de la cabecera falla.
        const baseName = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
        const fallbackFileName = `Historial_${baseName}_${new Date()
          .toISOString()
          .slice(0, 10)}.${format === "excel" ? "xlsx" : format}`;

        // --- 3. Llamada a la API ---
        const response = await api.get(`/api/historial/radicados/exportar`, {
          params: {
            tab: activeTab,
            format: format,
          },
          responseType: "blob",
        });

        // --- 4. EXTRAER NOMBRE DEL ARCHIVO DE LA CABECERA DEL SERVIDOR ---
        const contentDisposition = response.headers["content-disposition"];

        // Inicializar con el nombre de respaldo que tiene el timestamp
        let serverFileName = fallbackFileName;

        if (contentDisposition) {
          // Busca filename="[nombre]" o filename*=[codificado]
          const fileNameMatch = contentDisposition.match(
            /filename\*?=["']?([^;"]+)/i
          );
          if (fileNameMatch && fileNameMatch.length > 1) {
            // Decodificar el nombre capturado (maneja espacios y UTF-8)
            serverFileName = decodeURIComponent(
              fileNameMatch[1].replace(/['"]/g, "")
            );
          }
        }

        // --- 5. Crear el Blob y forzar la descarga con el nombre (idealmente, el del servidor) ---
        const blob = new Blob([response.data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // USAMOS el nombre que ya incluye el timestamp y la extensión correcta
        link.setAttribute("download", serverFileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`Exportación a ${format.toUpperCase()} completada.`, {
          id: "export_toast",
        });
      } catch (err) {
        toast.error(
          "Error al generar el reporte. Verifica la conexión con el servidor.",
          {
            id: "export_toast",
          }
        );
        console.error("Export error:", err);
        if (err.response && err.response.data) {
          const reader = new FileReader();
          reader.onload = function () {
            try {
              const errorJson = JSON.parse(reader.result);
              toast.error(
                `Error de servidor: ${errorJson.message || "Desconocido"}`,
                { id: "export_toast" }
              );
            } catch (e) {
              console.error("Server error is not JSON:", reader.result);
            }
          };
          reader.readAsText(err.response.data);
        }
      } finally {
        setIsExporting(false);
      }
    },
    [activeTab, isLoading, isExporting, filteredData.length]
  );

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
    isExporting,
    setActiveTab,
    handleSearchChange,
    handleSortChange,
    refetch: fetchData,
    formatDate,
    openDetailsModal,
    closeModal,
    handleExport,
  };
};
