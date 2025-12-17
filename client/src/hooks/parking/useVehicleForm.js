/**
 * @file useVehicleForm.js
 * @module Hooks/Parking
 * @description Hook personalizado para gestionar la lógica del formulario dinámico de creación de vehículos.
 * Encapsula la validación con Yup (incluyendo reglas condicionales), el estado del formulario con Formik
 * y la lógica de envío de datos a la API.
 * @requires formik
 * @requires yup
 * @requires react-hot-toast
 * @requires ../../config/axios.js
 * @requires ../../stores/authStore.js // Aunque no se use para rol, lo mantenemos por consistencia si lo usas en otros hooks
 */
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import api from "../../config/axios.js";

/**
 * @const {object} initialVehicleValues
 * @description Define la estructura y los valores iniciales para un nuevo objeto de vehículo en blanco.
 * Se utiliza para inicializar el formulario y para añadir nuevas filas en el FieldArray.
 */
export const initialVehicleValues = {
  placa: null,
  codigo_sensor: null,
  tipo_vehiculo: "",
  modelo_descripcion: "",
  nombre_dueno: "",
  identificacion_dueno: "",
  genero_dueno: "N/A",
  lugar_asignado_default: "",
  activo: true,
};

/**
 * @function useVehicleForm
 * @description Hook de React que proporciona toda la lógica y el estado necesarios para un formulario de creación de múltiples vehículos.
 * @param {Function} onSuccess - Una función callback que se ejecuta cuando la petición a la API es exitosa.
 * @returns {object} La instancia completa de Formik.
 */
export const useVehicleForm = (onSuccess) => {
  /**
   * @const {Yup.ObjectSchema} vehicleValidationSchema
   * @description Esquema de validación de Yup para UN SOLO objeto de vehículo.
   * Contiene reglas condicionales (ej. para la placa).
   */
  const vehicleValidationSchema = Yup.object({
    // Lógica condicional para PLACA:
    // Requerida y con regex si es Carro o Moto.
    // Nula y opcional si es Bicicleta u Otros.
    placa: Yup.string().when("tipo_vehiculo", {
      is: (tipo) => tipo === "Carro" || tipo === "Moto",
      then: (schema) =>
        schema
          .trim()
          .required("La placa es obligatoria para Carros y Motos."),
      otherwise: (schema) => schema.nullable().transform(() => null), // Transforma a null si es Bici/Otros
    }),

    codigo_sensor: Yup.string()
      .trim()
      .max(100, "El código del sensor no debe exceder los 100 caracteres.")
      .test(
        "is-not-just-spaces",
        "El código del sensor no puede estar vacío si se proporciona.",
        (value) => !value || value.trim().length > 0
      )
      .nullable()
      .optional(),

    tipo_vehiculo: Yup.string()
      .oneOf(
        ["Carro", "Moto", "Bicicleta", "Otros"],
        "Tipo de vehículo inválido."
      )
      .required("El tipo de vehículo es obligatorio."),

    modelo_descripcion: Yup.string()
      .trim()
      .max(100, "Modelo/descripción muy largo.")
      .nullable()
      .optional(),

    nombre_dueno: Yup.string()
      .trim()
      .min(3, "El nombre del dueño debe tener al menos 3 caracteres.")
      .max(150, "Nombre muy largo.")
      .matches(
        /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/,
        "Nombre inválido. Use solo letras y espacios."
      )
      .required("El nombre del dueño es obligatorio."),

    identificacion_dueno: Yup.string()
      .trim()
      .min(5, "La identificación debe tener al menos 5 caracteres.")
      .max(20, "Identificación muy larga.")
      .matches(
        /^[A-Za-z0-9]+$/,
        "Identificación inválida. Use solo letras y números."
      )
      .required("La identificación es obligatoria."),

    genero_dueno: Yup.string()
      .oneOf(["Masculino", "Femenino", "N/A"])
      .default("N/A"),

    lugar_asignado_default: Yup.string()
      .trim()
      .max(100, "Lugar asignado muy largo.")
      .nullable()
      .optional(),

    activo: Yup.boolean().default(true),
  });

  /**
   * @const {object} formik
   * @description Instancia de Formik creada con `useFormik`.
   */
  const formik = useFormik({
    // Valor inicial: un objeto que contiene un array 'vehicles'
    initialValues: {
      vehicles: [initialVehicleValues],
    },
    // Esquema de validación: un objeto que espera un array 'vehicles'
    validationSchema: Yup.object({
      vehicles: Yup.array()
        .of(vehicleValidationSchema) // Cada ítem del array debe cumplir el schema individual
        .min(1, "Debes agregar al menos un vehículo."),
    }),

    validateOnChange: true, // Re-valida al cambiar (necesario para campos condicionales)
    validateOnBlur: true,

    /**
     * @function onSubmit
     * @description Se ejecuta al enviar el formulario (si es válido).
     * @param {object} values - Valores actuales (ej. { vehicles: [...] }).
     * @param {object} formikHelpers - Ayudantes de Formik.
     */
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setSubmitting(true);
      try {
        // El backend espera el array 'vehiclesData', que es 'values.vehicles'
        await api.post("/api/parqueadero/vehiculos", values.vehicles);

        toast.success(
          `¡${values.vehicles.length} vehículo(s) creado(s) exitosamente!`
        );
        resetForm(); // Limpia el formulario
        if (onSuccess) {
          onSuccess(); // Llama al callback (cierra modal, refresca datos)
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Ocurrió un error al crear los vehículos.";
        setFieldError("apiError", errorMessage); // Muestra error en el footer
        toast.error(errorMessage);
        console.error("Error al crear vehículos:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
