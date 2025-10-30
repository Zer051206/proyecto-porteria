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
      // Validación condicional: Si es radicado, DEBE ser Contabilidad
      .when("es_radicado", {
        is: true,
        then: (schema) =>
          schema.equals(
            [ID_AREA_CONTABILIDAD],
            "Los radicados solo pueden ir a Contabilidad."
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
          .required("El N° de Referencia es obligatorio para radicados."),
      otherwise: (schema) => schema.nullable().optional(),
    }),

    nombre_recibe_documento: Yup.string().when("id_tipo_paquete", {
      is: ID_TIPO_DOCUMENTO,
      then: (schema) =>
        schema
          .trim()
          .min(3, "Debe tener al menos 3 caracteres.")
          .required("El nombre de quien recibe es obligatorio."),
      otherwise: (schema) => schema.nullable().optional(),
    }),
    path_firma_recibe_documento: Yup.string().nullable().optional(),
    path_firma_validador: Yup.string().nullable().optional(),
    path_firma_entregador: Yup.string().nullable().optional(),
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
      es_radicado: false,
      referencia_radicado: "",
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

        if (payload.id_tipo_paquete === ID_TIPO_DOCUMENTO) {
          if (recibeSigPadRef.current?.isEmpty()) {
            setFieldError(
              "path_firma_recibe_documento",
              "La firma de quien recibe es obligatoria."
            );
            isValid = false;
          }
        }
        if (payload.es_radicado) {
          if (validadorSigPadRef.current?.isEmpty()) {
            setFieldError(
              "path_firma_validador",
              "La firma del validador es obligatoria."
            );
            isValid = false;
          }
          if (entregadorSigPadRef.current?.isEmpty()) {
            setFieldError(
              "path_firma_entregador",
              "La firma del entregador es obligatoria."
            );
            isValid = false;
          }
        }

        if (!isValid) {
          toast.error("Por favor, complete todas las firmas requeridas.");
          setSubmitting(false);
          return; // Detiene el envío
        }

        if (payload.id_tipo_paquete === ID_TIPO_DOCUMENTO) {
          payload.path_firma_recibe_documento =
            recibeSigPadRef.current.toDataURL("image/png");
        }
        if (payload.es_radicado) {
          payload.path_firma_validador =
            validadorSigPadRef.current.toDataURL("image/png");
          payload.path_firma_entregador =
            entregadorSigPadRef.current.toDataURL("image/png");
        }

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

  useEffect(() => {
    if (formik.values) {
      if (formik.values.es_radicado) {
        formik.setFieldValue("id_area", ID_AREA_CONTABILIDAD);
      }
    }
  }, [formik.values.es_radicado, formik.setFieldValue]);

  // Limpia los campos de documento/radicado si el tipo ya no es 'Documento'
  useEffect(() => {
    if (formik.values) {
      // Asegura que formik esté inicializado
      // Si el tipo seleccionado NO es Documento (usando '==' por si acaso)
      if (formik.values.id_tipo_paquete != ID_TIPO_DOCUMENTO) {
        // Y si 'es_radicado' (o cualquier campo de documento) seguía con datos
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
