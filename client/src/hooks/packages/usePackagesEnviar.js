/**
 * @file usePackagesEnviar.js
 * @module Hooks/Paquetes
 * @description Hook personalizado para gestionar el formulario y la lógica de envío de paquetes.
 * Se encarga de cargar opciones, definir el esquema de validación, manejar el estado
 * del formulario con Formik, y enviar los datos a la API.
 * @requires react/useState, useEffect
 * @requires formik/useFormik
 * @requires yup - Para la definición del esquema de validación.
 * @requires ../../config/axios - Instancia de Axios configurada para la API.
 * @requires ../../utils/inputUtilities - Funciones de utilidad para el manejo de entradas de teclado.
 *
 * @param {Function} navigate - Función de navegación de `react-router-dom/useNavigate`.
 */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios";
import {
  handleKeyTextDown,
  handleAddressKeyDown,
} from "../../utils/inputUtilities";
import toast from "react-hot-toast";

/**
 * @function usePackagesEnviar
 * @description Gestiona el estado, la validación y el envío del formulario para registrar
 * la salida de un paquete del almacén.
 * @property {object} formik - Objeto completo devuelto por `useFormik` para enlazar con los campos del formulario.
 * @property {Array<object>} tiposPaquetes - Lista de opciones de tipos de paquetes cargada desde la API.
 * @property {Array<object>} areas - Lista de opciones de áreas cargada desde la API.
 * @property {boolean} isLoading - Indica si las opciones iniciales del formulario están cargando.
 * @property {string | null} errorCarga - Mensaje de error si falló la carga inicial de opciones.
 * @property {Function} handleClearForm - Función para resetear el formulario y limpiar errores.
 * @property {Function} handleKeyTextDown - Utilidad para restringir caracteres en entradas de texto.
 * @property {Function} handleAddressKeyDown - Utilidad para restringir caracteres en entradas de dirección/destino.
 * @property {string | null} error - Mensaje de error general si falló la submission del formulario.
 */
const usePackagesEnviar = (onSuccess) => {
  // Estados para la carga de datos iniciales
  const [tiposPaquetes, setTiposPaquetes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [error, setError] = useState(null);

  /**
   * @function handleClearForm
   * @description Restablece los valores del formulario a su estado inicial y limpia mensajes de error.
   * @returns {void}
   */
  const handleClearForm = () => {
    formik.resetForm();
    setError(null); // Limpiar error general al resetear
  };

  /**
   * @effect
   * @description Hook de efecto para cargar las opciones de tipos de paquetes y áreas
   * desde la API al montar el componente.
   */
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Peticiones concurrentes para optimizar la carga
        const [tiposRes, areasRes] = await Promise.all([
          api.get("/api/tipos-paquetes"),
          api.get("/api/areas"),
        ]);
        setTiposPaquetes(tiposRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        setErrorCarga(
          "No se pudieron cargar las opciones. Intente recargar la página"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, []);

  /**
   * @const {object} validationSchema
   * @description Esquema de validación para los campos del formulario utilizando Yup.
   * Incluye validación condicional para el campo `guia`.
   */
  const validationSchema = Yup.object({
    id_tipo_paquete: Yup.number().required(
      "El tipo de paquete es obligatorio."
    ),
    nombre_remitente: Yup.string().required(
      "El nombre del remitente es obligatorio."
    ),
    id_area: Yup.number().required("El área es obligatoria."),
    guia: Yup.string().when("conGuia", {
      is: true,
      then: (schema) => schema.required("El número de guía es obligatorio."),
    }),
    empresa_transporte: Yup.string()
      .nullable()
      .max(100, "La empresa no puede exceder los 100 caracteres."),
    mensajero_nombre: Yup.string()
      .nullable()
      .max(255, "El nombre no puede exceder los 255 caracteres."),
    destino_salida: Yup.string()
      .required("El destino es obligatorio.")
      .nullable()
      .max(100, "El destino no puede exceder los 100 caracteres."),
    observaciones: Yup.string()
      .nullable()
      .max(500, "Las observaciones no pueden exceder los 500 caracteres."),
  });

  /**
   * @const {object} formik
   * @description Instancia de Formik configurada para manejar el estado, validación y
   * submission del formulario.
   */
  const formik = useFormik({
    initialValues: {
      id_tipo_paquete: "",
      tipo_operacion: "enviar",
      guia: "",
      nombre_remitente: "",
      id_area: "",
      destino_salida: "",
      empresa_transporte: "",
      mensajero_nombre: "",
      observaciones: "",
      conGuia: false, // Estado del checkbox
    },
    validationSchema,
    /**
     * @async
     * @function onSubmit
     * @description Función de submission del formulario. Envía los datos del paquete a la API.
     * @param {object} values - Valores validados del formulario.
     * @returns {void}
     */
    onSubmit: async (values, { setErrors, resetForm, setSubmitting }) => {
      try {
        const payload = { ...values };
        if (!payload.conGuia) {
          payload.guia = null; // Asegura que la guía sea nula si no se marca
        }

        await api.post("/api/paquetes/enviar", payload);
        toast.success("¡Paquete recibido con éxito!");
        resetForm();
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          // Errores de validación de Zod
          const formikErrors = {};
          error.response.data.errors.forEach((e) => {
            const path = e.path[0];
            formikErrors[path] = e.message;
          });
          setErrors(formikErrors);
          toast.error("Por favor, corrige los errores en el formulario.");
        } else {
          // Error general (ej. guía duplicada)
          toast.error(
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
    tiposPaquetes,
    areas,
    isLoading,
    errorCarga,
    handleClearForm, // Renombrado y lógica ajustada
    handleKeyTextDown,
    handleAddressKeyDown,
    error: formik.errors.apiError,
  };
};

export default usePackagesEnviar;
