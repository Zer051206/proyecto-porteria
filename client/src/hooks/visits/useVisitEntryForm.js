/**
 * @file useVisitEntryForm.js
 * @module Hooks/Visits
 * @description Hook personalizado que encapsula la lógica del formulario de registro de visitas.
 * @requires react
 * @requires formik
 * @requires react-router-dom
 * @requires ../config/axios.js
 */
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";

/**
 * @function useVisitEntryForm
 * @description Maneja el estado y la lógica del formulario de registro de visitas.
 * @returns {object} Un objeto con todas las propiedades y métodos para el componente.
 */
export default function useVisitEntryForm() {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState({
    areas: [],
    tiposIdentificacion: [],
  });
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const sigCanvas = useRef(null);

  const clearSignature = () => sigCanvas.current?.clear();

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [areasRes, tiposIdRes] = await Promise.all([
          api.get("/api/areas"),
          api.get("/api/tipos-identificacion"),
        ]);
        setCatalogs({
          areas: areasRes.data || [],
          tiposIdentificacion: tiposIdRes.data || [],
        });
      } catch (err) {
        toast.error("Error al cargar las opciones del formulario.");
      } finally {
        setIsLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre_visitante: "",
      apellido: "",
      telefono: "",
      identificacion: "",
      id_tipo_identificacion: "",
      empresa: "",
      nombre_destinatario: "",
      id_area: "",
      motivo: "",
      observaciones: "",
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
        toast.error("La firma del visitante es obligatoria.");
        setSubmitting(false);
        return;
      }
      const firma_base64 = sigCanvas.current.getCanvas().toDataURL("image/png");

      try {
        await api.post("/api/visitas/entrada", { ...values, firma_base64 });
        toast.success("¡Visita registrada exitosamente!");
        resetForm();
        clearSignature();
        navigate("/dashboard");
      } catch (error) {
        if (error.response?.data?.errors) {
          const zodErrors = {};
          error.response.data.errors.forEach((err) => {
            zodErrors[err.path] = err.message;
          });
          setErrors(zodErrors);
          toast.error("Por favor, corrige los errores en el formulario.");
        } else {
          toast.error(
            error.response?.data?.message || "Ha ocurrido un error inesperado."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClear = () => {
    formik.resetForm();
    clearSignature();
  };

  return {
    formik,
    ...catalogs,
    isLoadingCatalogs,
    handleClear,
    sigCanvas,
  };
}
