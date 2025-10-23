/**
 * @file usePackagesHistorial.js
 * @module Hooks/Historial
 * @description Hook personalizado para la lógica del dashboard de historial de paquetes.
 * Carga todos los registros y aplica la lógica de búsqueda y estado de UI en el frontend.
 * @requires react
 * @requires ../../config/axios.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/dateFormat.js";

/**
 * @function usePackagesHistorial
 * @description Hook de React que encapsula la lógica para la página de historial de paquetes.
 * @returns {{
 * packages: Array<object>,
 * isLoading: boolean,
 * error: string|null,
 * refetch: Function,
 * searchTerm: string,
 * handleSearchChange: Function,
 * showModal: boolean,
 * selectedPackage: object|null,
 * handleSelectPackage: Function,
 * handleCloseModal: Function,
 * formatDate: Function,
 * noResults: boolean
 * }} Objeto con los paquetes filtrados, estados y funciones.
 */
export const usePackagesHistorial = () => {
  /**
   * @state {Array<object>} originalPackages - Almacena la lista original de paquetes.
   */
  const [originalPackages, setOriginalPackages] = useState([]);
  /**
   * @state {boolean} isLoading - Indica si se está realizando una petición a la API.
   */
  const [isLoading, setIsLoading] = useState(true);
  /**
   * @state {string|null} error - Almacena un mensaje de error si la petición falla.
   */
  const [error, setError] = useState(null);
  /**
   * @state {string} searchTerm - Almacena el término de búsqueda actual.
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * @state {boolean} showModal - Controla la visibilidad del modal de detalles.
   */
  const [showModal, setShowModal] = useState(false);
  /**
   * @state {object|null} selectedPackage - Almacena el objeto del paquete seleccionado.
   */
  const [selectedPackage, setSelectedPackage] = useState(null);

  /**
   * @function fetchPackages
   * @description Obtiene la lista completa de paquetes desde el backend.
   */
  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/api/paquetes");
      setOriginalPackages(response.data || []);
    } catch (err) {
      setError("Error al cargar el historial de paquetes.");
      toast.error("No se pudo cargar el historial de paquetes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  /**
   * @const {Array<object>} filteredPackages
   * @description Memoriza la lista de paquetes filtrada.
   */
  const filteredPackages = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return originalPackages;

    return originalPackages.filter((pkg) => {
      const guia = (pkg.guia || "").toLowerCase();
      const tipoOperacion = (pkg.tipo_operacion || "").toLowerCase();
      const destinatario = (pkg.nombre_destinatario || "").toLowerCase();
      const remitente = (pkg.nombre_remitente || "").toLowerCase();
      const area = (pkg.Area?.nombre_area || "").toLowerCase();
      const tipoPaquete = (pkg.PackageType?.descripcion || "").toLowerCase();

      return (
        guia.includes(term) ||
        tipoOperacion.includes(term) ||
        destinatario.includes(term) ||
        remitente.includes(term) ||
        area.includes(term) ||
        tipoPaquete.includes(term)
      );
    });
  }, [originalPackages, searchTerm]);

  /**
   * @const {boolean} noResults
   * @description Verdadero si hay un término de búsqueda pero no hay paquetes filtrados.
   */
  const noResults = searchTerm.length > 0 && filteredPackages.length === 0;

  /**
   * @function handleSearchChange
   * @description Actualiza el estado del término de búsqueda desde un evento de input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento del input.
   */
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  /**
   * @function handleSelectPackage
   * @description Almacena el paquete seleccionado y abre el modal de detalles.
   * @param {object} pkg - El objeto paquete a mostrar.
   */
  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  /**
   * @function handleCloseModal
   * @description Cierra el modal de detalles y limpia el paquete seleccionado.
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  return {
    packages: filteredPackages,
    isLoading,
    error,
    noResults,
    showModal,
    searchTerm,
    selectedPackage,
    handleSelectPackage,
    handleCloseModal,
    refetch: fetchPackages,
    handleSearchChange,
    formatDate,
  };
};

export default usePackagesHistorial;
