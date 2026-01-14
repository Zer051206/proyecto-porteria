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
import { useState, useEffect, useRef } from "react";
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
  const validadorSigPadRef = useRef(null);
  const remitenteSigPadRef = useRef(null);
  const [tiposPaquetes, setTiposPaquetes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [error, setError] = useState(null);

  /**
   * @function handleClickClear
   * @description Restablece los valores del formulario y limpia las firmas.
   */
  const handleClickClear = () => {
    formik.resetForm();
    validadorSigPadRef.current?.clear();
    remitenteSigPadRef.current?.clear();
    formik.setErrors({});
    formik.setTouched({});
  };
  /**
   * @effect
   * @description Hook de efecto para cargar las opciones de tipos de paquetes y áreas
   * desde la API al montar el componente.
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
    proveedor: Yup.string()
      .required("El proveedor es obligatorio para el envío de mercancía.")
      .max(150, "Máximo 150 caracteres."),
    op: Yup.number()
      .typeError("La OP debe ser un número válido.")
      .required("El número de OP es obligatorio para el envío.")
      .integer("Debe ser un número entero")
      .min(1, "Debe ser un número positivo."),
    referencia: Yup.string()
      .required("La referencia de la mercancía es obligatoria.")
      .max(100, "Máximo 100 caracteres."),
    cantidad: Yup.number()
      .typeError("La cantidad debe ser un número válido.")
      .required("La cantidad es obligatoria para el envío.")
      .integer("Debe ser un número entero")
      .min(1, "Debe ser un número positivo."),
    path_firma_validador_envio: Yup.string().nullable().optional(),
    path_firma_remitente: Yup.string().nullable().optional(),
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
      conGuia: false,
      proveedor: "",
      op: "",
      referencia: "",
      cantidad: "",
      path_firma_validador_envio: "",
      path_firma_remitente: "",
    },
    validationSchema,
    /**
     * @async
     * @function onSubmit
     * @description Función de submission del formulario. Envía los datos del paquete a la API.
     * @param {object} values - Valores validados del formulario.
     * @returns {void}
     */
    onSubmit: async (
      values,
      { setErrors, resetForm, setSubmitting, setFieldError }
    ) => {
      setSubmitting(true);
      try {
        const payload = { ...values };
        let isValid = true;
        let base64Validador, base64Remitente;

        // --- Función Auxiliar de Subida (Definida DENTRO del onSubmit) ---
        /**
         * @function uploadSignature
         * @description Función auxiliar para subir la imagen base64 de la firma al servidor
         * y obtener el path relativo.
         * @async
         * @param {string} base64Data - La imagen en formato Data URL (base64).
         * @param {string} folderName - El nombre de la subcarpeta donde guardar la firma.
         * @returns {Promise<string|null>} La ruta relativa del archivo en el servidor.
         */
        const uploadSignature = async (base64Data, folderName) => {
          if (!base64Data) return null;
          const uploadRes = await api.post("/api/signatures/upload", {
            image_data: base64Data,
            folder: folderName,
          });
          return uploadRes.data.path;
        };

        // --- 1. Extracción y Validación de Firmas (Ambas Obligatorias) ---

        // Firma Validador (Obligatoria)
        const validadorSigPad = validadorSigPadRef.current;
        if (validadorSigPad?.isEmpty()) {
          setFieldError(
            "path_firma_validador_envio",
            "La firma del validador es obligatoria."
          );
          isValid = false;
        } else {
          base64Validador = validadorSigPad.toDataURL("image/png");
        }

        // Firma Remitente (Obligatoria)
        const remitenteSigPad = remitenteSigPadRef.current;
        if (remitenteSigPad?.isEmpty()) {
          setFieldError(
            "path_firma_remitente",
            "La firma del remitente es obligatoria."
          );
          isValid = false;
        } else {
          base64Remitente = remitenteSigPad.toDataURL("image/png");
        }

        if (!isValid) {
          toast.error("Por favor, complete ambas firmas requeridas.");
          setSubmitting(false);
          return; // Detiene el envío si falta alguna firma
        }

        // --- 2. Subida Concurrente de Firmas ---
        const [pathValidador, pathRemitente] = await Promise.all([
          uploadSignature(base64Validador, "paquetes"),
          uploadSignature(base64Remitente, "paquetes"),
        ]);

        // Asignar las rutas (path) devueltas por el servidor al payload
        payload.path_firma_validador_envio = pathValidador;
        payload.path_firma_remitente = pathRemitente;

        // --- 3. Limpieza y Envío del Payload ---
        if (!payload.conGuia) {
          payload.guia = null;
        }
        delete payload.conGuia; // Se limpia el campo auxiliar

        await api.post("/api/paquetes/enviar", payload);
        toast.success("¡Paquete enviado con éxito!");
        resetForm();
        validadorSigPadRef.current?.clear();
        remitenteSigPadRef.current?.clear();

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
       const serverMessage = err.response?.data?.message || "Error al procesar la solicitud.";
      
        // Seteamos el error en un campo especial de Formik llamado 'apiError'
        // Y además, si el backend manda errores por campo, los mapeamos
        const backendErrors = err.response?.data?.errors || {};
        
        setErrors({
          ...backendErrors,
          apiError: serverMessage 
        });
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
    handleClickClear,
    handleKeyTextDown,
    handleAddressKeyDown,
    error: formik.errors.apiError,
    validadorSigPadRef,
    remitenteSigPadRef,
  };
};

export default usePackagesEnviar;
