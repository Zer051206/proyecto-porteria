import { useEffect, useState, useCallback, useRef } from "react";
import api from "../config/axios";
import { formatDate } from "../utils/dateFormat";

const usePackagesHistorial = () => {
  const [packagesHistorial, setPackagesHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef(null);

  const fetchPackageHistorial = useCallback(async (term = "") => {
    const isInitialLoad = term === "";

    setIsLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const response = await api.get(
        "http://localhost:3000/historial/paquetes",
        {
          params: { search: term },
        }
      );

      const results = response.data || [];

      if (results.length > 0) {
        setPackagesHistorial(results);
        setNoResults(false);
      } else {
        setPackagesHistorial([]);
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
  }, []);

  useEffect(() => {
    fetchPackageHistorial();
  }, [fetchPackageHistorial]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchPackageHistorial(value);
    }, 500);
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
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
    searchTerm,
    handleSearchChange,
    noResults,
  };
};

export default usePackagesHistorial;
