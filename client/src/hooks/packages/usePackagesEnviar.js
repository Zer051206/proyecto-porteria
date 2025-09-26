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

/**
 * @function usePackagesEnviar
 * @description Gestiona el estado, la validación y el envío del formulario para registrar
 * la salida de un paquete del almacén.
 *
 * @param {Function} navigate - Función para redirigir al usuario tras un envío exitoso.
 * @returns {object} Un objeto con todas las propiedades y métodos necesarios para el componente del formulario.
 *
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
const usePackagesEnviar = (navigate) => {
  // Estados para la carga de datos iniciales
  const [tiposPaquetes, setTiposPaquetes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // Estado para errores generales de la submission
  const [error, setError] = useState(null);

  /**
   * @function handleClearForm
   * @description Restablece los valores del formulario a su estado inicial y limpia mensajes de error.
   * @returns {void}
   */
  const handleClearForm = () => {
    // Renombrado de handleClickClear
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
    onSubmit: async (values) => {
      setError(null); // Limpiar error general antes del intento

      try {
        await api.post("/paquetes/enviar", {
          ...values,
          // Asegura que los campos opcionales sean null si están vacíos
          guia: values.conGuia ? values.guia : null,
          destino_salida: values.destino_salida || null,
          empresa_transporte: values.empresa_transporte || null,
          mensajero_nombre: values.mensajero_nombre || null,
        });

        alert("✅ ¡Paquete enviado con éxito!");
        formik.resetForm(); // Limpiar el formulario después del éxito
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
          formik.setErrors(formikErrors);
          setError(null); // Aseguramos que el error general esté vacío
        } else {
          // Si no hay errores de validación de campo, mostramos el mensaje general del servidor
          setError(
            error.response?.data?.message || "Ha ocurrido un error inesperado."
          );
        }
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
    error,
  };
};

export default usePackagesEnviar;
