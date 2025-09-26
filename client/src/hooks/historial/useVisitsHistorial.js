/**
 * @file useVisitsHistorial.js
 * @module hooks/useVisitsHistorial
 * @description Custom hook para manejar la lógica, el estado y la comunicación con la API
 * para el historial de visitas. Incluye funcionalidad de búsqueda con debouncing.
 * @exports useVisitsHistorial
 * @requires react
 * @requires ../../config/axios - Instancia configurada de Axios.
 * @requires ../../utils/dateFormat - Utilidad para formatear fechas.
 */
import { useEffect, useState, useCallback, useRef } from "react";
import api from "../../config/axios";
import { formatDate } from "../../utils/dateFormat";

/**
 * @typedef {object} VisitData
 * @property {number} id_visita - ID único de la visita.
 * @property {string} nombre_visitante - Nombre completo del visitante.
 * @property {string} identificacion - Número de documento.
 * @property {string} descripcion - Tipo de documento.
 * @property {string} nombre_destinatario - Nombre de la persona visitada.
 * @property {string} nombre_area - Área de destino.
 * @property {string} fecha_entrada - Marca de tiempo de la entrada.
 * @property {string|null} fecha_salida - Marca de tiempo de la salida.
 * @property {string} motivo - Motivo de la visita.
 * @property {string} [empresa] - Empresa de procedencia del visitante.
 * @property {string} [observaciones] - Observaciones adicionales.
 */

/**
 * @function useVisitsHistorial
 * @description Hook que gestiona el estado y la lógica para la tabla de historial de visitas,
 * incluyendo la obtención de datos, la búsqueda debounced y la gestión del modal de detalles.
 * @returns {object} Un objeto con el estado y los *handlers* necesarios para el componente `VisitsHistorial`.
 * @returns {VisitData[]} return.visitsHistorial - Lista de visitas filtradas o completa.
 * @returns {boolean} return.isLoading - Indica si los datos están cargando.
 * @returns {string|null} return.error - Mensaje de error si la carga falla.
 * @returns {boolean} return.showModal - Estado de visibilidad del modal de detalles.
 * @returns {VisitData|null} return.selectedVisit - La visita seleccionada para el modal.
 * @returns {Function} return.handleSelectVisit - Función para abrir el modal y seleccionar una visita.
 * @returns {Function} return.handleCloseModal - Función para cerrar el modal.
 * @returns {Function} return.formatDate - Utilidad para formatear las fechas.
 * @returns {string} return.searchTerm - Término de búsqueda actual.
 * @returns {Function} return.handleSearchChange - Handler para cambios en el campo de búsqueda con debouncing.
 * @returns {boolean} return.noResults - Indica si no se encontraron resultados.
 */
const useVisitsHistorial = () => {
  /** @type {VisitData[]} */
  const [visitsHistorial, setVisitsHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  /** @type {VisitData|null} */
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);

  /** @type {React.MutableRefObject<number|null>} Referencia para manejar el *timeout* del debouncing. */
  const debounceRef = useRef(null);

  /**
   * @function fetchVisitsHistorial
   * @description Realiza la llamada a la API para obtener el historial de visitas, opcionalmente con un término de búsqueda.
   * @param {string} [term=""] - El término de búsqueda a enviar a la API.
   */
  const fetchVisitsHistorial = useCallback(async (term = "") => {
    const isInitialLoad = term === "";

    setIsLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const response = await api.get(`/historial/visitas`, {
        params: { search: term },
      });

      const results = response.data || [];

      if (results.length > 0) {
        setVisitsHistorial(results);
        setNoResults(false);
      } else {
        setVisitsHistorial([]);
        // Si la búsqueda no arroja resultados o la carga inicial fue vacía, activa noResults.
        setNoResults(!isInitialLoad || (isInitialLoad && results.length === 0));
      }
    } catch (err) {
      setError("No se pudo cargar el historial de visitas.");
      setVisitsHistorial([]);
      setNoResults(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencia vacía: la función solo se crea una vez.

  // Carga inicial y limpieza del debounce
  useEffect(() => {
    fetchVisitsHistorial();

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetchVisitsHistorial]);

  /**
   * @function handleSearchChange
   * @description Maneja el cambio en el input de búsqueda, aplicando un retraso (debouncing)
   * de 500ms antes de llamar a la función de la API.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Limpia el timeout anterior para evitar llamadas API innecesarias
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Establece un nuevo timeout para llamar a la API después de 500ms
    debounceRef.current = setTimeout(() => {
      fetchVisitsHistorial(value);
    }, 500);
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
    visitsHistorial,
    isLoading,
    error,
    showModal,
    selectedVisit,
    handleSelectVisit,
    handleCloseModal,
    formatDate,
    searchTerm,
    handleSearchChange,
    noResults,
  };
};

export default useVisitsHistorial;
