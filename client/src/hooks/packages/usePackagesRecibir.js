/**
 * @file useRecibirPaqueteForm.js
 * @module Hooks/usePackagesRecibir
 * @description Hook personalizado para gestionar la lógica del formulario de recepción de paquetes.
 * Utiliza Formik para la gestión de formularios, Yup para la validación de esquemas,
 * y realiza la carga inicial de datos (tipos de paquetes y áreas) y la sumisión del formulario.
 * @exports usePackagesRecibir
 * @requires react
 * @requires formik
 * @requires yup
 * @requires ../utils/inputUtilities - Para la función de restricción de teclas de texto.
 * @requires ../config/axios - Instancia de cliente HTTP configurada.
 */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleKeyTextDown } from "../../utils/inputUtilities";
import api from "../../config/axios";
import toast from "react-hot-toast";

/**
 * @function usePackagesRecibir
 * @description Hook personalizado que maneja el estado, la validación y la sumisión del formulario
 * para el registro de paquetes recibidos.
 *
 * @param {Function} navigate - Función de navegación proporcionada por el router (e.g., de React Router DOM)
 * para redirigir al usuario tras una sumisión exitosa.
 * @returns {{
 * formik: object,
 * tiposPaquetes: Array<object>,
 * areas: Array<object>,
 * isLoading: boolean,
 * errorCarga: (string|null),
 * handleClickClear: Function,
 * handleKeyTextDown: Function
 * }} Un objeto que contiene el objeto Formik, los datos de las opciones (selects),
 * el estado de carga y las funciones de utilidad.
 */
const usePackagesRecibir = (navigate) => {
  /**
   * @type {Array<object>}
   * Estado para almacenar los tipos de paquetes disponibles.
   * */
  const [tiposPaquetes, setTiposPaquetes] = useState([]);
  /**
   * @type {Array<object>}
   * Estado para almacenar las áreas disponibles.
   */
  const [areas, setAreas] = useState([]);
  /**
   * @type {boolean}
   * Indica si los datos iniciales del formulario están cargando.
   */
  const [isLoading, setIsLoading] = useState(true);
  /**
   * @type {(string|null)}
   * Almacena un mensaje de error si la carga inicial falla.
   */
  const [errorCarga, setErrorCarga] = useState(null);
  /**
   * @type {string|null}
   * Almacena el error general del servidor después de intentar la sumisión.
   */
  const [error, setError] = useState(null);

  /**
   * @function handleClickClear
   * @description Función para limpiar el formulario, restableciendo todos los valores a sus valores iniciales.
   */
  const handleClickClear = () => {
    formik.resetForm();
  };

  /**
   * @function useEffect
   * @description Hook para realizar la carga inicial de datos (tipos de paquetes y áreas)
   * al montar el componente. Establece `isLoading` y `errorCarga` según el resultado.
   */
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [tiposRes, areasRes] = await Promise.all([
          api.get("/api/tipos-paquetes"),
          api.get("/api/areas"),
        ]);
        setTiposPaquetes(tiposRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        console.error("Error al cargar datos del formulario:", error);
        setErrorCarga(
          "No se pudieron cargar las opciones. intente recargar la página."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, []);

  /**
   * @constant {object} validationSchema
   * @description Esquema de validación para el formulario, definido con Yup.
   */
  const validationSchema = Yup.object({
    id_tipo_paquete: Yup.number().required(
      "El tipo de paquete es obligatorio."
    ),
    nombre_destinatario: Yup.string().required(
      "El nombre del destinatario es obligatorio."
    ),
    id_area: Yup.number().required("El área es obligatoria."),
    // Validación condicional: 'guia' es requerido solo si 'conGuia' es true.
    guia: Yup.string().when("conGuia", {
      is: true,
      then: (schema) => schema.required("El número de guía es obligatorio."),
      otherwise: (schema) => schema.nullable(), // No requerido si 'conGuia' es false
    }),
    empresa_transporte: Yup.string()
      .nullable()
      .max(100, "La empresa no puede exceder los 100 caracteres."),
    mensajero_nombre: Yup.string()
      .nullable()
      .max(255, "El nombre no puede exceder los 255 caracteres."),
    observaciones: Yup.string()
      .nullable()
      .max(500, "Las observaciones no pueden exceder los 500 caracteres."),
    // 'conGuia' es un booleano, no necesita validación explícita de `required` si es un checkbox.
  });

  /**
   * @constant {object} formik
   * @description Instancia de Formik que gestiona el estado del formulario, la validación y la sumisión.
   */
  const formik = useFormik({
    initialValues: {
      id_tipo_paquete: "",
      tipo_operacion: "recibir",
      guia: "",
      nombre_destinatario: "",
      id_area: "",
      empresa_transporte: "",
      mensajero_nombre: "",
      observaciones: "",
      conGuia: false, // Campo booleano para el checkbox de guía
    },
    validationSchema,
    /**
     * @async
     * @function onSubmit
     * @description Función que se ejecuta al enviar el formulario si es válido.
     * @param {object} values - Valores actuales del formulario.
     * @param {object} formikBag - Objeto con utilidades de Formik (como `setErrors`).
     */
    onSubmit: async (values, { setErrors, resetForm, setSubmitting }) => {
      try {
        const payload = { ...values };
        if (!payload.conGuia) {
          payload.guia = null;
        }

        await api.post("/api/paquetes/recibir", payload);
        toast.success("¡Paquete enviado con éxito!");
        resetForm();
        navigate("/dashboard");
      } catch (error) {
        if (error.response?.data?.errors) {
          const formikErrors = {};
          error.response.data.errors.forEach((e) => {
            const path = e.path[0];
            formikErrors[path] = e.message;
          });
          setErrors(formikErrors);
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

  /**
   * @returns {object} Objeto con todos los estados y funciones necesarios para el componente del formulario.
   */
  return {
    formik,
    tiposPaquetes,
    areas,
    isLoading,
    errorCarga,
    handleClickClear,
    handleKeyTextDown, // Función de utilidad importada
    error, // Retornamos el error general para mostrarlo en el formulario
  };
};

export default usePackagesRecibir;
