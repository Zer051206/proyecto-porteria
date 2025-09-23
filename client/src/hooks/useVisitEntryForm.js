//src/hooks/useVisitEntryForm.js
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import VisitSchema from "../schemas/visitSchema.js";
import api from "../config/axios.js";
import {
  handleKeyNumberDown,
  handleKeyTextDown,
} from "../utils/inputUtilities";

const useVisitEntryForm = () => {
  const navigate = useNavigate(); // Estado para los datos de los selects
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const handleClickClear = () => {
    formik.resetForm();
  }; // Lógica para obtener los datos al cargar el componente

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Peticiones concurrentes para optimizar el tiempo de carga
        const [areasRes, tiposIdRes] = await Promise.all([
          api.get("http://localhost:3000/api/areas"),
          api.get("http://localhost:3000/api/tipos-identificacion"),
        ]);
        setAreas(areasRes.data);
        setTiposIdentificacion(tiposIdRes.data);
      } catch (err) {
        setErrorCarga(
          "Hubo un error al cargar las opciones. Por favor, intente recargar la página."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Lógica de Formik y la función de envío

  const formik = useFormik({
    initialValues: {
      nombre_visitante: "",
      telefono: "",
      identificacion: "",
      id_tipo_identificacion: "",
      empresa: "",
      nombre_destinatario: "",
      id_area: "",
      observaciones: "",
      apellido: "",
      motivo: "",
    },

    validationSchema: VisitSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post("http://localhost:3000/visitas/entrada", values);
        alert("✅ ¡Visita registrada con éxito!");
        navigate("/dashboard");
      } catch (error) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  }); // Retorna todos los valores y funciones necesarios para el componente

  return {
    formik,
    areas,
    tiposIdentificacion,
    isLoading,
    errorCarga,
    handleClickClear,
    handleKeyNumberDown,
    handleKeyTextDown,
    error,
  };
};

export default useVisitEntryForm;
