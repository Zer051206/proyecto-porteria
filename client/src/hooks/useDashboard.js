// src/hooks/useDashboard.js
import { useEffect, useState, useCallback } from "react";
import api from "../config/axios";

const useDashboard = () => {
  const [activeVisits, setActiveVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const fetchActiveVisits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeVisitsRes = await api.get("/api/visitas-activas");
      setActiveVisits(activeVisitsRes.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
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

  const handleConfirmEndVisit = async () => {
    try {
      await api.patch(`/visitas/salida/${selectedVisit.id_visita}`);
      // Refresca la lista después de terminar la visita
      await fetchActiveVisits();
      setShowModal(false);
      setSelectedVisit(null);
      alert("✅ ¡Visita finalizada con éxito!");
    } catch (err) {
      setError(err.response.data.message);
      alert("❌ Hubo un error al intentar finalizar la visita.");
    }
  };

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
