import axios from "axios";
import { useEffect, useState } from "react";
import api from "../config/axios";

const usePackagesHistorial = async () => {
  const [ packagesHistorial, setPackagesHistorial ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedPackage, setSelectedPackage ] = useState(null);

  useEffect(() => {
    const fetchPackageHistorial = async () => { 
      try {
        const [packagesHistorialRes] = await Promise.all([
          api.get('http://localhost:3000/historial/paquetes')
        ]);
        setPackagesHistorial(packagesHistorialRes.data)
      } catch (err) {
        setError('Error al cargar el registro de paquetes.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPackageHistorial();
  }, []);

  const handleSelectPackage = async (pkg) => {
    if (!selectedPackage) return;

    try {
      await api.get(`http://localhost:3000/historial/paquetes/${selectedPackage.id_paquete}`);
      setShowModal(true);
      setSelectedPackage(pkg);
    } catch (err) {
      alert('❌ Hubo un error al intentar mostrar la información del paquete');
    }
  };

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
  };

};

export default usePackagesHistorial