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
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleKeyTextDown } from "../../utils/inputUtilities";
import api from "../../config/axios";
import toast from "react-hot-toast";

const ID_TIPO_DOCUMENTO = 1;
const ID_AREA_CONTABILIDAD = 3;

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
const usePackagesRecibir = (onSuccess) => {
  // --- Refs para las Firmas ---
  const recibeSigPadRef = useRef(null);
  const validadorSigPadRef = useRef(null);
  const entregadorSigPadRef = useRef(null);

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
    id_tipo_paquete: Yup.number()
      .positive("Debe seleccionar un tipo de paquete.")
      .required("El tipo de paquete es obligatorio."),

    nombre_destinatario: Yup.string()
      .trim()
      .min(3, "El destinatario debe tener al menos 3 caracteres.")
      .required("El nombre del destinatario es obligatorio."),

    id_area: Yup.number()
      .required("El área es obligatoria.")
      .when("es_radicado", {
        is: true,
        then: (schema) =>
          schema.equals(
            [ID_AREA_CONTABILIDAD],
            'Los "radicados" solo pueden ir a Contabilidad.'
          ),
      }),

    guia: Yup.string().when("conGuia", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .min(1, "El número de guía es obligatorio.")
          .required("El número de guía es obligatorio."),
      otherwise: (schema) => schema.nullable(),
    }),

    conGuia: Yup.boolean(),
    empresa_transporte: Yup.string().trim().max(100).nullable().optional(),
    mensajero_nombre: Yup.string().trim().max(255).nullable().optional(),
    observaciones: Yup.string().trim().nullable().optional(),
    es_radicado: Yup.boolean().default(false),
    referencia_radicado: Yup.string().when("es_radicado", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .min(1, "La referencia es obligatoria.")
          .required('El N° de Referencia es obligatorio para "radicados".'),
      otherwise: (schema) => schema.nullable().optional(),
    }),
   proveedor: Yup.string()
      .required("El proveedor es obligatorio para recibir paquetes.")
      .max(150, "Máximo 150 caracteres."),
    op: Yup.number()
      .typeError("La OP debe ser un número válido.")
      .required("El número de OP es obligatorio para recibir paquetes.")
      .integer("Debe ser un número entero")
      .min(1, "Debe ser un número positivo."),
    referencia: Yup.string()
      .required("La referencia de la mercancía es obligatoria.")
      .max(100, "Máximo 100 caracteres."),
    cantidad: Yup.number()
      .typeError("La cantidad debe ser un número válido.")
      .required("La cantidad es obligatoria para recibir paquetes.")
      .integer("Debe ser un número entero")
      .min(1, "Debe ser un número positivo."),
    nombre_recibe_documento: Yup.string().trim().max(100),
    path_firma_recibe_documento: Yup.string().nullable().optional(),
    path_firma_validador: Yup.string().nullable().optional(),
    path_firma_entregador: Yup.string().optional().nullable(),
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
      conGuia: false,
      proveedor: "",
      op: "",
      referencia: "",
      cantidad: "",
      es_radicado: false,
      referencia_radicado: null,
      nombre_recibe_documento: "",
      path_firma_recibe_documento: "",
      path_firma_validador: "",
      path_firma_entregador: "",
    },
    validationSchema: validationSchema,
    validateOnMount: true,
    /**
     * @async
     * @function onSubmit
     * @description Función que se ejecuta al enviar el formulario si es válido.
     * @param {object} values - Valores actuales del formulario.
     * @param {object} formikBag - Objeto con utilidades de Formik (como `setErrors`).
     */
    onSubmit: async (
      values,
      { setErrors, resetForm, setSubmitting, setFieldError }
    ) => {
      try {
        const payload = { ...values };
        if (!payload.conGuia) {
          payload.guia = null;
        }

        let isValid = true;
        let base64Recibe, base64Validador, base64Entregador;

        // --- Extracción de firmas Base64 ---

        const recibeSigPad = recibeSigPadRef.current;
        const isDocumento = payload.id_tipo_paquete === ID_TIPO_DOCUMENTO;
        const isRadicado = payload.es_radicado;

        // 1. Firma de RECIBE (Receptor) - Obligatoria si es Documento O Radicado
        if (isDocumento || isRadicado) {
          if (recibeSigPad?.isEmpty()) {
            setFieldError(
              "path_firma_recibe_documento",
              "La firma de quien recibe es obligatoria."
            );
            isValid = false;
          } else {
            base64Recibe = recibeSigPad.toDataURL("image/png");
          }
        } else if (recibeSigPad && !recibeSigPad.isEmpty()) {
          // Si NO es documento/radicado, pero el usuario sí firmó, la extraemos para subirla
          base64Recibe = recibeSigPad.toDataURL("image/png");
        }

        // 2. Firmas de RADICADO
        const validadorSigPad = validadorSigPadRef.current;
        const entregadorSigPad = entregadorSigPadRef.current;

        if (isRadicado) {
          // Firma Validador (Obligatoria para Radicado)
          if (validadorSigPad?.isEmpty()) {
            setFieldError(
              "path_firma_validador",
              "La firma del validador es obligatoria."
            );
            isValid = false;
          } else {
            base64Validador = validadorSigPad.toDataURL("image/png");
          }

          // Firma Entregador (Obligatoria para Radicado)
          if (entregadorSigPad?.isEmpty()) {
            setFieldError(
              "path_firma_entregador",
              "La firma del entregador es obligatoria."
            );
            isValid = false;
          } else {
            base64Entregador = entregadorSigPad.toDataURL("image/png");
          }
        }

        if (!isValid) {
          toast.error("Por favor, complete todas las firmas requeridas.");
          setSubmitting(false);
          return; // Detiene el envío
        }

        /**
         * Función auxiliar para subir la imagen base64 de la firma al servidor
         * y obtener el path relativo.
         * @async
         * @param {string} base64Data - La imagen en formato Data URL (base64).
         * @param {string} folderName - El nombre de la subcarpeta donde guardar la firma.
         * @returns {Promise<string|null>} La ruta relativa del archivo en el servidor, o null si el backend lo omite.
         */
        const uploadSignature = async (base64Data, folderName) => {
          if (!base64Data) return null;

          // Endpoint dedicado para la subida de Base64
          const uploadRes = await api.post("/api/signatures/upload", {
            image_data: base64Data,
            folder: folderName, // <--- Aquí se envía la carpeta al backend
          });
          // Retorna el path relativo que el backend ha devuelto (puede ser null si el backend
          // detectó Base64 vacío y lo omitió).
          return uploadRes.data.path;
        };

        // --- LÓGICA PARA DETERMINAR LA CARPETA DE CADA FIRMA ---

        // La firma del Receptor siempre va a 'radicados' si es un radicado.
        let folderRecibe = null;
        if (base64Recibe) {
          folderRecibe = isRadicado ? "radicados" : "paquetes";
        }

        // Determinar la carpeta para Validador/Entregador (solo si existen base64Validador/Entregador)
        const folderValidador = base64Validador ? "radicados" : null;
        const folderEntregador = base64Entregador ? "radicados" : null;

        // Se suben las firmas concurrentemente para optimizar el tiempo
        const [pathRecibe, pathValidador, pathEntregador] = await Promise.all([
          // Usar la carpeta determinada o null si no hay firma Base64
          uploadSignature(base64Recibe, folderRecibe),
          uploadSignature(base64Validador, folderValidador),
          uploadSignature(base64Entregador, folderEntregador),
        ]);

        payload.path_firma_recibe_documento = pathRecibe;
        payload.path_firma_validador = pathValidador;
        payload.path_firma_entregador = pathEntregador;

        // Limpia el campo 'conGuia' que no es parte del modelo de la DB
        delete payload.conGuia;

        await api.post("/api/paquetes/recibir", payload);
        toast.success("¡Paquete recibido con éxito!");
        resetForm();
        recibeSigPadRef.current?.clear();
        validadorSigPadRef.current?.clear();
        entregadorSigPadRef.current?.clear();

        if (onSuccess) {
          onSuccess();
        }
     } catch (err) {
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

  useEffect(() => {
    if (formik.values) {
      if (formik.values.es_radicado) {
        formik.setFieldValue("id_area", ID_AREA_CONTABILIDAD);
      }
    }
  }, [formik.values.es_radicado, formik.setFieldValue]);

  useEffect(() => {
    if (formik.values) {
      if (formik.values.id_tipo_paquete != ID_TIPO_DOCUMENTO) {
        if (
          formik.values.es_radicado ||
          formik.values.nombre_recibe_documento
        ) {
          // Resetea todos los campos relacionados
          formik.setFieldValue("es_radicado", false);
          formik.setFieldValue("referencia_radicado", "");
          formik.setFieldValue("nombre_recibe_documento", "");
          formik.setFieldValue("path_firma_recibe_documento", "");
          formik.setFieldValue("path_firma_validador", "");
          formik.setFieldValue("path_firma_entregador", "");
          recibeSigPadRef.current?.clear();
          validadorSigPadRef.current?.clear();
          entregadorSigPadRef.current?.clear();

          if (formik.values.id_area === ID_AREA_CONTABILIDAD) {
            formik.setFieldValue("id_area", "");
          }
        }
      }
    }
  }, [formik.values.id_tipo_paquete, formik.setFieldValue]);

  /**
   * @function handleClickClear
   * @description Limpia el formulario y las firmas.
   */
  const handleClickClear = () => {
    formik.resetForm();
    recibeSigPadRef.current?.clear();
    validadorSigPadRef.current?.clear();
    entregadorSigPadRef.current?.clear();
  };

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
    handleKeyTextDown,
    error,
    recibeSigPadRef,
    validadorSigPadRef,
    entregadorSigPadRef,
    ID_TIPO_DOCUMENTO,
    ID_AREA_CONTABILIDAD,
  };
};

export default usePackagesRecibir;
