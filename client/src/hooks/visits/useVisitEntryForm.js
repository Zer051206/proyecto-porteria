/**
 * @file useVisitEntryForm.js
 * @module Hooks
 * @description Hook personalizado que encapsula toda la lógica de estado, manejo de formularios
 * y comunicación con la API para el componente de registro de entrada de visitas.
 * @requires react
 * @requires formik/useFormik
 * @requires react-router-dom/useNavigate
 * @requires ../schemas/visitSchema
 * @requires ../config/axios
 * @requires ../utils/inputUtilities
 */
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import VisitSchema from "../../schemas/visitSchema.js";
import api from "../../config/axios.js";
import {
  handleKeyNumberDown,
  handleKeyTextDown,
} from "../../utils/inputUtilities";

/**
 * @function useVisitEntryForm
 * @description Maneja el estado del formulario de registro de visitas.
 * Se encarga de:
 * 1. Cargar las opciones dinámicas (áreas y tipos de identificación) de la API.
 * 2. Integrar la validación con Formik y Yup (VisitSchema).
 * 3. Gestionar la referencia y captura de la firma digital.
 * 4. Manejar el envío de datos a la API, incluyendo la conversión de la firma a Base64.
 * @returns {object} Un objeto con todas las propiedades y métodos necesarios para el componente {@link VisitEntryForm}.
 *
 * @property {object} formik - Objeto de control de formulario de Formik (values, handleSubmit, handleChange, errors, etc.).
 * @property {Array<object>} areas - Lista de áreas disponibles cargadas desde la API.
 * @property {Array<object>} tiposIdentificacion - Lista de tipos de identificación disponibles cargados desde la API.
 * @property {boolean} isLoading - Indicador de si las opciones de área/identificación están cargando.
 * @property {string | null} errorCarga - Mensaje de error si falla la carga de opciones iniciales.
 * @property {Function} handleClickClear - Función para resetear el formulario y limpiar el lienzo de la firma.
 * @property {Function} handleKeyNumberDown - Utilidad para prevenir la entrada de caracteres no deseados en inputs numéricos.
 * @property {Function} handleKeyTextDown - Utilidad para prevenir la entrada de caracteres no deseados en inputs de texto.
 * @property {string | null} error - Mensaje de error general del formulario o de la API (ej. error de firma faltante).
 * @property {React.MutableRefObject<any>} sigCanvas - Referencia (ref) al componente SignaturePad para manipular la firma.
 */
const useVisitEntryForm = () => {
  const navigate = useNavigate();
  // Estado para las opciones de select
  const [areas, setAreas] = useState([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);

  // Estado de carga y errores
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [error, setError] = useState(null); // Error general de la API o de la firma

  // Referencia para el componente de la firma digital (SignaturePad)
  const sigCanvas = useRef(null);

  /**
   * @private
   * @description Función utilitaria para limpiar el lienzo de la firma.
   * @returns {void}
   */
  const clearSignature = () => sigCanvas.current && sigCanvas.current.clear();

  /**
   * @description Resetea el formulario y limpia la firma digital.
   * @returns {void}
   */
  const handleClickClear = () => {
    formik.resetForm();
    clearSignature(); // Limpia la firma al resetear el formulario
  };

  /**
   * @description Hook de efecto para cargar las listas de Áreas y Tipos de Identificación
   * al montar el componente.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejecuta ambas peticiones simultáneamente para optimizar el tiempo de carga
        const [areasRes, tiposIdRes] = await Promise.all([
          api.get("/api/areas"),
          api.get("/api/tipos-identificacion"),
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

  // ==========================================
  // Lógica de Formik
  // ==========================================
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
      apellido: "", // Estos dos campos no están en el esquema pero están en initialValues
      motivo: "", // Pueden ser campos temporales o eliminados más adelante
    },

    validationSchema: VisitSchema,

    /**
     * @async
     * @description Maneja el envío del formulario: verifica la firma, la convierte a Base64,
     * y realiza la petición POST a la API.
     * @param {object} values - Valores del formulario.
     * @param {object} formikBag - Objeto con helpers de Formik (setSubmitting, setErrors).
     */
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      // 1. Validación de la Firma (obligatoria)
      if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
        setError(
          "La firma es obligatoria para confirmar la visita y el consentimiento de datos."
        );
        setSubmitting(false);
        return;
      }

      // 2. Captura y codificación de la firma
      const signatureDataUrl = sigCanvas.current
        .getCanvas()
        .toDataURL("image/png");

      try {
        // 3. Petición POST a la API
        await api.post("/visitas/entrada", {
          ...values,
          firma_base64: signatureDataUrl,
        });

        // 4. Éxito: limpiar formulario, firma y notificar
        resetForm();
        clearSignature();
        alert("✅ ¡La visita se ha registrado exitósamente!");
        navigate("/dashboard");
      } catch (error) {
        // 5. Manejo de Errores de la API
        const serverErrors = error.response?.data?.errors;

        if (serverErrors) {
          // Errores de validación detallados (ej. de Express-Validator)
          const formikErrors = {};
          serverErrors.forEach((e) => {
            if (e.path) {
              const path = e.path.split(".");
              formikErrors[path[path.length - 1]] = e.message;
            }
          });
          setErrors(formikErrors);
          setError(null);
        } else {
          // Error general
          setError(
            error.response?.data?.message || "Ha ocurrido un error inesperado."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
  // ==========================================

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
    sigCanvas,
  };
};

export default useVisitEntryForm;
