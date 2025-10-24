/**
 * @file useDashboardPackage.js
 * @module Hooks/Packages
 * @description Hook para gestionar los datos, filtros y estado de modales del dashboard principal de paquetes.
 * Obtiene la actividad reciente de paquetes.
 * @requires react
 * @requires date-fns // Para el tiempo relativo
 * @requires ../../config/axios.js
 * @requires ../../utils/dateFormat.js // Para formato de fecha estándar si es necesario
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/dateFormat.js";

export const useDashboardPackage = () => {
  // --- Estados ---
  const [originalRecentPackages, setOriginalRecentPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * @function fetchRecentPackages
   * @description Obtiene los últimos logs de actividad de paquetes desde la API.
   */
  const fetchRecentPackages = useCallback(
    async (limit = 5) => {
      setError(null);
      try {
        const response = await api.get(
          `/api/paquetes/recientes?limit=${limit}`
        );
        setOriginalRecentPackages(response.data.data || []);
      } catch (err) {
        setError("Error al cargar la actividad reciente.");
        toast.error("No se pudo cargar la actividad reciente.");
        console.error("Error fetching recent packages:", err);
        setOriginalRecentPackages([]); // Limpia en caso de error
      } finally {
        if (isLoading) setIsLoading(false); // Solo cambia isLoading en la carga inicial
      }
    },
    [isLoading]
  ); // Depende de isLoading para saber si es la carga inicial

  // Efecto para la carga inicial
  useEffect(() => {
    fetchRecentPackages();
  }, []); // Solo se ejecuta al montar

  // --- Filtrado con useMemo ---
  /**
   * @const {Array<object>} filteredRecentPackages
   * @description Memoriza la lista de logs recientes filtrada por el searchTerm.
   * Se recalcula solo si la lista original o el término de búsqueda cambian.
   */
  const filteredRecentPackages = useMemo(() => {
    const term = searchTerm.toLowerCase().trim(); // Convertir a minúsculas y quitar espacios
    if (!term) {
      return originalRecentPackages; // Si no hay búsqueda, devuelve la lista original
    }

    return originalRecentPackages.filter((log) => {
      // Accede a los datos del paquete dentro del log (asume alias 'Package')
      const pkg = log.Package;
      if (!pkg) return false; // Si no hay datos de paquete, no incluir en resultados de búsqueda

      // Campos a incluir en la búsqueda (ajusta según tus necesidades)
      const guia = (pkg.guia || "").toLowerCase();
      const destinatario = (pkg.nombre_destinatario || "").toLowerCase();
      const remitente = (pkg.nombre_remitente || "").toLowerCase();
      const area = (pkg.Area?.nombre_area || "").toLowerCase(); // Accede al área dentro del paquete
      const tipoPaquete = (pkg.PackageType?.descripcion || "").toLowerCase(); // Accede al tipo dentro del paquete
      const usuarioNombre = (log.User?.nombre || "").toLowerCase(); // Busca también por nombre de usuario del log

      // Verifica si alguno de los campos incluye el término de búsqueda
      return (
        guia.includes(term) ||
        destinatario.includes(term) ||
        remitente.includes(term) ||
        area.includes(term) ||
        tipoPaquete.includes(term) ||
        usuarioNombre.includes(term)
      );
    });
  }, [originalRecentPackages, searchTerm]);

  // --- Handlers para Modales ---
  /**
   * @function handleAction
   * @description Abre un modal específico y opcionalmente guarda datos seleccionados.
   * @param {'recibir'|'enviar'|'details'|null} type - El tipo de modal.
   * @param {object|null} [data=null] - Datos para el modal (ej. paquete para detalles).
   */
  const handleAction = (type, data = null) => {
    if (type === "details") {
      setSelectedPackage(data);
    }
    setModalType(type);
  };

  /**
   * @function closeModal
   * @description Cierra cualquier modal abierto y limpia los datos seleccionados.
   */
  const closeModal = () => {
    setModalType(null);
    setSelectedPackage(null);
  };

  /**
   * @function handleSuccess
   * @description Callback para ejecutar después de una acción exitosa en un modal (ej. guardar formulario).
   * Cierra el modal y recarga los datos recientes.
   */
  const handleSuccess = () => {
    closeModal();
    fetchRecentPackages();
  };

  // --- Handler para Búsqueda ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // --- Valor de Retorno ---
  return {
    recentPackages: filteredRecentPackages,
    isLoading,
    error,
    modalType,
    selectedPackage,
    searchTerm,
    handleAction,
    closeModal,
    handleSuccess,
    handleSearchChange,
    formatDate,
    refetch: fetchRecentPackages, // Función para recargar manualmente
  };
};
