import { useEffect, useState, useCallback, useRef } from "react";
import api from "../config/axios";
import { formatDate } from "../utils/dateFormat";

const useVisitsHistorial = () => {
  const [visitsHistorial, setVisitsHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef(null);

  const fetchVisitsHistorial = useCallback(async (term = "") => {
    const isInitialLoad = term === "";

    setIsLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const response = await api.get(`/historial/visitas`, {
        params: { search: term },
      });

      const results = response.data || [];

      if (results.length > 0) {
        setVisitsHistorial(results);
        setNoResults(false);
      } else {
        setVisitsHistorial([]);
        setNoResults(!isInitialLoad || (isInitialLoad && results.length === 0));
      }
    } catch (err) {
      setError("No se pudo cargar el historial de visitas.");
      setVisitsHistorial([]);
      setNoResults(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchVisitsHistorial();
  }, [fetchVisitsHistorial]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchVisitsHistorial(value);
    }, 500);
  };

  const handleSelectVisit = (visit) => {
    setSelectedVisit(visit);
    setShowModal(true);
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
    searchTerm,
    handleSearchChange,
    noResults,
  };
};

export default useVisitsHistorial;
