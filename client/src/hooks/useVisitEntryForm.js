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
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const handleClickClear = () => {
    formik.resetForm();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, []);

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

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      // Agregamos setErrors a la destructuración
      try {
        await api.post("http://localhost:3000/visitas/entrada", values);
        formik.resetForm();
        alert("✅ ¡La visita se ha registrado exitósamente!");
        navigate("/dashboard");
      } catch (error) {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          const formikErrors = {};
          serverErrors.forEach((e) => {
            if (e.path) {
              const path = e.path.split(".");
              // Mapeamos el error a la propiedad de Formik
              formikErrors[path[path.length - 1]] = e.message;
            }
          });
          // Usamos setErrors de Formik para los errores de campos específicos
          setErrors(formikErrors);
          setError(null); // Aseguramos que el error general esté vacío
        } else {
          // Si no hay errores de validación, mostramos el mensaje general del servidor
          setError(
            error.response?.data?.message || "Ha ocurrido un error inesperado."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

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
