// src/hooks/useDashboard.js
import axios from "axios";
import { useEffect, useState } from "react";

const useDashboard = () => {
  const [activeVisits, setActiveVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    const fetchActiveVisits = async () => {
    
    try {
      const [activeVisitsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/visitas-activas')
      ]);
      setActiveVisits(activeVisitsRes.data);
    } catch (err) {
      setError('Error al cargar las visitas activas.');
    } finally {
      setIsLoading(false);
    }
  };
     fetchActiveVisits();
  }, []);

  const handleEndVisit = (visit) => {
    setSelectedVisit(visit);
    setShowModal(true);
  };

  const handleConfirmEndVisit = async () => {
    if (!selectedVisit) return;
    try {
      await axios.patch(`http://localhost:3000/visitas/salida/${selectedVisit.id_visita}`);
      // Refresca la lista después de terminar la visita
      setActiveVisits([]);
      setShowModal(false);
      setSelectedVisit(null);
      alert('✅ ¡Visita finalizada con éxito!');
    } catch (err) {
      console.error('Error al finalizar la visita:', err);
      alert('❌ Hubo un error al intentar finalizar la visita.');
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
    handleCloseModal
  };
};

export default useDashboard;