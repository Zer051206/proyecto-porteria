import axios from "axios";
import { useEffect, useState } from "react";
import api from "../config/axios";

const useVisitsHistorial = async () => {
  const [ visitsHistorial, setVisitsHistorial ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedVisit, setSelectedVisit ] = useState(null);

  useEffect(() => {
    const fetchVisitsHistorial = async () => { 
      try {
        const [visitsHistorialRes] = await Promise.all([
          api.get('http://localhost:3000/historial/visitas')
        ]);
        setVisitsHistorial(visitsHistorialRes.data)
      } catch (err) {
        setError('Error al cargar el registro de visitas.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchVisitsHistorial();
  }, []);

  const handleSelectVisit = async (visit) => {
    if (!selectedVisit) return;

    try {
      await api.get(`http://localhost:3000/historial/paquetes/${selectedPackage.id_paquete}`);
      setShowModal(true);
      setSelectedVisit(visit);
    } catch (err) {
      alert('❌ Hubo un error al intentar mostrar la información del paquete');
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
  };

};

export default useVisitsHistorial;