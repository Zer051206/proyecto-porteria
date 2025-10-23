/**
 * @file useVisitsHistorial.js
 * @module Hooks/Historial
 * @description Hook personalizado para la lógica del dashboard de historial de visitas.
 * Carga todos los registros y aplica la lógica de búsqueda en el frontend.
 * @requires react
 * @requires ../../config/axios.js
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/dateFormat.js";

/**
 * @function useVisitsHistorial
 * @description Hook de React que encapsula la lógica para la página de historial de visitas.
 * @returns {{
 * visits: Array<object>,
 * isLoading: boolean,
 * error: string|null,
 * refetch: Function,
 * setSearchTerm: Function
 * }} Objeto con las visitas filtradas, estados y funciones.
 */
export const useVisitsHistorial = () => {
  /**
   * @state {Array<object>} originalVisits - Almacena la lista original de visitas obtenida de la API.
   */
  const [originalVisits, setOriginalVisits] = useState([]);
  /**
   * @state {boolean} isLoading - Indica si se está realizando una petición a la API.
   */
  const [isLoading, setIsLoading] = useState(true);
  /**
   * @state {boolean} showModal - Controla la visibilidad del modal de detalles.
   */
  const [showModal, setShowModal] = useState(false);
  /**
   * @state {string|null} error - Almacena un mensaje de error si la petición falla.
   */
  const [error, setError] = useState(null);
  /**
   * @state {string} searchTerm - Almacena el término de búsqueda actual.
   */
  const [searchTerm, setSearchTerm] = useState("");
  /**
   * @state {object|null} selectedVisit - Almacena el objeto de la visita seleccionada.
   */
  const [selectedVisit, setSelectedVisit] = useState(null);

  /**
   * @function fetchVisits
   * @description Obtiene la lista completa de visitas desde el backend.
   */
  const fetchVisits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/api/historial/visitas");
      setOriginalVisits(response.data || []);
    } catch (err) {
      setError("Error al cargar el historial de visitas.");
      toast.error("No se pudo cargar el historial de visitas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  /**
   * @const {Array<object>} filteredVisits
   * @description Memoriza la lista de visitas filtrada. Se recalcula solo si los
   * datos originales o el término de búsqueda cambian.
   */
  const filteredVisits = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return originalVisits;

    return originalVisits.filter((visit) => {
      const nombreVisitante = (visit.nombre_visitante || "").toLowerCase();
      const identificacion = (visit.identificacion || "").toLowerCase();
      const destinatario = (visit.nombre_destinatario || "").toLowerCase();
      const area = (visit.Area?.nombre_area || "").toLowerCase();
      const tipoId = (
        visit.IdentificationType?.descripcion || ""
      ).toLowerCase();

      return (
        nombreVisitante.includes(term) ||
        identificacion.includes(term) ||
        destinatario.includes(term) ||
        area.includes(term) ||
        tipoId.includes(term)
      );
    });
  }, [originalVisits, searchTerm]);

  /**
   * @const {boolean} noResults
   * @description Verdadero si hay un término de búsqueda pero no hay visitas filtradas.
   */
  const noResults = searchTerm.length > 0 && filteredVisits.length === 0;

  /**
   * @function handleSearchChange
   * @description Actualiza el estado del término de búsqueda desde un evento de input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento del input.
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * @function handleSelectVisit
   * @description Almacena la visita seleccionada y abre el modal de detalles.
   * @param {VisitData} visit - El objeto visita a mostrar.
   */
  const handleSelectVisit = (visit) => {
    setSelectedVisit(visit);
    setShowModal(true);
  };

  /**
   * @function handleCloseModal
   * @description Cierra el modal de detalles y limpia el objeto de visita seleccionado.
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVisit(null);
  };

  return {
    visits: filteredVisits,
    isLoading,
    error,
    showModal,
    selectedVisit,
    noResults,
    searchTerm,
    formatDate,
    handleCloseModal,
    handleSelectVisit,
    refetch: fetchVisits,
    handleSearchChange,
  };
};

export default useVisitsHistorial;
