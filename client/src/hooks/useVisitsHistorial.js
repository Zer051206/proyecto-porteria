import { useEffect, useState } from "react";
import api from "../config/axios";
import { formatDate } from "../utils/dateFormat";

const useVisitsHistorial = () => {
  const [visitsHistorial, setVisitsHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    const fetchVisitsHistorial = async () => {
      try {
        const [visitsHistorialRes] = await Promise.all([
          api.get("http://localhost:3000/historial/visitas"),
        ]);
        setVisitsHistorial(visitsHistorialRes.data);
      } catch (err) {
        setError(err.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisitsHistorial();
  }, []);

  const handleSelectVisit = async (visit) => {
    try {
      const { data } = await api.get(
        `http://localhost:3000/historial/visitas/${visit.id_visita}`
      );
      setShowModal(true);
      setSelectedVisit(data[0]);
    } catch (err) {
      console.error(
        "❌ Hubo un error al intentar mostrar la información de la visita"
      );
    }
  };

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
  };
};

export default useVisitsHistorial;
