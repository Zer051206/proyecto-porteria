/**
 * @file useDashboard.js
 * @module Hooks
 * @description Hook personalizado para gestionar el estado y las operaciones de la página principal (Dashboard).
 * Se encarga de cargar la lista de visitas que aún están activas y de manejar el proceso de registro de salida.
 * @requires react/useEffect, useState, useCallback
 * @requires ../config/axios (Asumido como el cliente Axios configurado)
 */
import { useEffect, useState, useCallback } from "react";
import api from "../config/axios";

/**
 * @function useDashboard
 * @description Proporciona la lógica y el estado necesarios para el Dashboard, incluyendo:
 * 1. Carga de la lista de visitas que no tienen hora de salida (activas).
 * 2. Manejo de la lógica para finalizar una visita mediante un modal de confirmación.
 *
 * @returns {object} Un objeto con el estado y las funciones de control para el Dashboard.
 * @property {Array<object>} activeVisits - La lista de visitas que actualmente están activas.
 * @property {boolean} isLoading - Indica si se está realizando una operación de carga de datos.
 * @property {string | null} error - Mensaje de error si la carga de datos o la finalización falla.
 * @property {boolean} showModal - Controla la visibilidad del modal de confirmación para finalizar una visita.
 * @property {object | null} selectedVisit - El objeto de visita seleccionado para su finalización.
 * @property {Function} handleEndVisit - Prepara y muestra el modal para finalizar una visita específica.
 * @property {Function} handleConfirmEndVisit - Ejecuta la llamada a la API para registrar la salida de la visita seleccionada.
 * @property {Function} handleCloseModal - Cierra el modal de confirmación y restablece la visita seleccionada.
 */
const useDashboard = () => {
  const [activeVisits, setActiveVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  /**
   * @async
   * @function fetchActiveVisits
   * @description Función asíncrona para obtener la lista de todas las visitas activas desde la API.
   * Utiliza `useCallback` para memorizar la función y evitar bucles infinitos en `useEffect`.
   * @returns {void}
   */
  const fetchActiveVisits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeVisitsRes = await api.get("/api/visitas-activas");
      setActiveVisits(activeVisitsRes.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "No se pudieron cargar las visitas activas.";
      setActiveVisits([]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para cargar las visitas activas al montar el componente
  useEffect(() => {
    fetchActiveVisits();
  }, [fetchActiveVisits]);

  /**
   * @function handleEndVisit
   * @description Establece la visita que será finalizada y abre el modal de confirmación.
   * @param {object} visit - El objeto de la visita a finalizar.
   * @returns {void}
   */
  const handleEndVisit = (visit) => {
    setSelectedVisit(visit);
    setShowModal(true);
  };

  /**
   * @async
   * @function handleConfirmEndVisit
   * @description Envía una solicitud PATCH a la API para registrar la hora de salida de la visita seleccionada.
   * Si tiene éxito, recarga la lista de visitas activas.
   * @returns {void}
   */
  const handleConfirmEndVisit = async () => {
    try {
      // Endpoint para registrar la salida de la visita
      await api.patch(`/visitas/salida/${selectedVisit.id_visita}`);

      // Refresca la lista después de terminar la visita
      await fetchActiveVisits();
      setShowModal(false);
      setSelectedVisit(null);
      alert("✅ ¡Visita finalizada con éxito!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Hubo un error al intentar finalizar la visita.";
      setError(errorMessage);
      alert("❌ " + errorMessage); // Notificación al usuario
    }
  };

  /**
   * @function handleCloseModal
   * @description Cierra el modal de confirmación y limpia la visita seleccionada.
   * @returns {void}
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVisit(null);
  };

  return {
    activeVisits,
    isLoading,
    error,
    showModal,
    selectedVisit,
    handleEndVisit,
    handleConfirmEndVisit,
    handleCloseModal,
  };
};

export default useDashboard;
