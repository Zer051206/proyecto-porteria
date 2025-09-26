/**
 * @file usePackagesHistorial.js
 * @module hooks/usePackagesHistorial
 * @description Custom hook para manejar la lógica, el estado y la comunicación con la API
 * para el historial de paquetes. Incluye funcionalidad de búsqueda con debouncing.
 * @exports usePackagesHistorial
 * @requires react
 * @requires ../../config/axios - Instancia configurada de Axios.
 * @requires ../../utils/dateFormat - Utilidad para formatear fechas.
 */
import { useEffect, useState, useCallback, useRef } from "react";
import api from "../../config/axios";
import { formatDate } from "../../utils/dateFormat";

/**
 * @typedef {object} PackageData
 * @property {number} id_paquete - ID único del paquete.
 * @property {string} guia - Número de guía del paquete.
 * @property {string} descripcion - Tipo de paquete.
 * @property {string} nombre_remitente - Nombre del remitente.
 * @property {string} nombre_destinatario - Nombre del destinatario.
 * @property {string} nombre_area - Área de destino.
 * @property {string} tipo_operacion - Tipo de operación (Ej: "Recibido", "Enviado").
 * @property {string} fecha_recibido - Marca de tiempo de recepción.
 * @property {string|null} fecha_envio - Marca de tiempo de envío/entrega.
 * @property {string} [observaciones] - Observaciones adicionales.
 */

/**
 * @function usePackagesHistorial
 * @description Hook que gestiona el estado y la lógica para la tabla de historial de paquetes,
 * incluyendo la obtención de datos, la búsqueda debounced y la gestión del modal de detalles.
 * @returns {object} Un objeto con el estado y los *handlers* necesarios para el componente `PackageHistoryTable`.
 * @returns {PackageData[]} return.packagesHistorial - Lista de paquetes filtrados o completa.
 * @returns {boolean} return.isLoading - Indica si los datos están cargando.
 * @returns {string|null} return.error - Mensaje de error si la carga falla.
 * @returns {boolean} return.showModal - Estado de visibilidad del modal de detalles.
 * @returns {PackageData|null} return.selectedPackage - El paquete seleccionado para el modal.
 * @returns {Function} return.handleSelectPackage - Función para abrir el modal y seleccionar un paquete.
 * @returns {Function} return.handleCloseModal - Función para cerrar el modal.
 * @returns {Function} return.formatDate - Utilidad para formatear las fechas.
 * @returns {string} return.searchTerm - Término de búsqueda actual.
 * @returns {Function} return.handleSearchChange - Handler para cambios en el campo de búsqueda con debouncing.
 * @returns {boolean} return.noResults - Indica si no se encontraron resultados después de la búsqueda o la carga inicial.
 */
const usePackagesHistorial = () => {
  /** @type {PackageData[]} */
  const [packagesHistorial, setPackagesHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  /** @type {PackageData|null} */
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);

  /** @type {React.MutableRefObject<number|null>} Referencia para manejar el *timeout* del debouncing. */
  const debounceRef = useRef(null);

  /**
   * @function fetchPackageHistorial
   * @description Realiza la llamada a la API para obtener el historial de paquetes, opcionalmente con un término de búsqueda.
   * @param {string} [term=""] - El término de búsqueda a enviar a la API.
   */
  const fetchPackageHistorial = useCallback(async (term = "") => {
    const isInitialLoad = term === "";

    setIsLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const response = await api.get("/historial/paquetes", {
        params: { search: term },
      });

      const results = response.data || [];

      if (results.length > 0) {
        setPackagesHistorial(results);
        setNoResults(false);
      } else {
        setPackagesHistorial([]);
        // Muestra 'noResults' solo si no es la carga inicial o si la carga inicial devuelve 0 resultados.
        setNoResults(!isInitialLoad || (isInitialLoad && results.length === 0));
      }
    } catch (err) {
      console.error("Error fetching packages historial:", err);
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al cargar el historial de paquetes."
      );
      setPackagesHistorial([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencia vacía para que la función sea estable

  /**
   * @description Hook para ejecutar la carga inicial del historial al montar el componente.
   */
  useEffect(() => {
    fetchPackageHistorial();

    // Limpia el timeout si el componente se desmonta antes de que se ejecute la búsqueda.
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetchPackageHistorial]);

  /**
   * @function handleSearchChange
   * @description Maneja el cambio en el input de búsqueda, implementando una lógica de debouncing
   * de 500ms para evitar llamadas excesivas a la API.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchPackageHistorial(value);
    }, 500); // Debounce de 500ms
  };

  /**
   * @function handleSelectPackage
   * @description Almacena el paquete seleccionado y abre el modal de detalles.
   * @param {PackageData} pkg - El objeto paquete a mostrar.
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
    packagesHistorial,
    isLoading,
    error,
    showModal,
    selectedPackage,
    handleSelectPackage,
    handleCloseModal,
    formatDate,
    searchTerm,
    handleSearchChange,
    noResults,
  };
};

export default usePackagesHistorial;
