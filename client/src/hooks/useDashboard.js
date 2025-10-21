/**
 * @file useDashboard.js
 * @module Hooks
 * @description Hook personalizado que encapsula la lógica para el Dashboard principal.
 * Se encarga de obtener las visitas activas y de manejar la acción de finalizar una visita.
 * @requires react
 * @requires ../config/axios.js
 * @requires react-hot-toast
 */
import { useEffect, useState, useCallback } from "react";
import api from "../config/axios";
import { toast } from "react-hot-toast";

/**
 * @function useDashboard
 * @description Proporciona la lógica y el estado para el DashboardPage.
 * @returns {object} Un objeto con el estado y las funciones de control.
 */
export default function useDashboard() {
  const [activeVisits, setActiveVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const fetchActiveVisits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/visitas-activas");
      setActiveVisits(response.data || []);
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

  useEffect(() => {
    fetchActiveVisits();
  }, [fetchActiveVisits]);

  const handleEndVisit = (visit) => {
    setSelectedVisit(visit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVisit(null);
  };

  const handleConfirmEndVisit = async () => {
    if (!selectedVisit) return;

    try {
      await toast.promise(
        api.patch(`/api/visitas/salida/${selectedVisit.id_visita}`),
        {
          loading: "Finalizando visita...",
          success: "¡Visita finalizada con éxito!",
          error: (err) =>
            err.response?.data?.message || "Error al finalizar la visita.",
        }
      );
    } catch (err) {
      console.error("Error en la finalización de la visita:", err);
    } finally {
      handleCloseModal();
      fetchActiveVisits();
    }
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
}
