import { useEffect, useState } from "react";
import api from "../config/axios";
import { formatDate } from "../utils/dateFormat";

const usePackagesHistorial = () => {
  const [packagesHistorial, setPackagesHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchPackageHistorial = async () => {
      try {
        const [packagesHistorialRes] = await Promise.all([
          api.get("http://localhost:3000/historial/paquetes"),
        ]);
        setPackagesHistorial(packagesHistorialRes.data);
      } catch (err) {
        setError(err.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackageHistorial();
  }, []);

  const handleSelectPackage = async (pkg) => {
    try {
      const { data } = await api.get(
        `http://localhost:3000/historial/paquetes/${pkg.id_paquete}`
      );
      console.log("Datos completos del paquete recibidos:", data);

      setSelectedPackage(data[0]);
      setShowModal(true);
    } catch (err) {
      console.error(
        "❌ Hubo un error al intentar mostrar la información del paquete"
      );
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
    formatDate,
  };
};

export default usePackagesHistorial;
