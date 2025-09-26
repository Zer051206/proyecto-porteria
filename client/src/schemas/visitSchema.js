/**
 * @file visitSchema.js
 * @module ValidationSchemas
 * @description Esquema de validación para los datos de una nueva Visita utilizando la librería Yup.
 * Define las reglas de obligatoriedad y el tipo de dato para cada campo del formulario.
 */
import * as Yup from "yup";

/**
 * @const {Yup.ObjectSchema} VisitSchema
 * @description Esquema de validación Yup para el objeto de una Visita.
 * Asegura que los campos requeridos estén presentes y tengan el tipo de dato correcto
 * antes de ser enviados al backend.
 *
 * @property {Yup.StringSchema} nombre_visitante - Nombre completo del visitante. Requerido.
 * @property {Yup.StringSchema} telefono - Número de teléfono del visitante. Requerido.
 * @property {Yup.StringSchema} identificacion - Número de identificación del visitante. Requerido.
 * @property {Yup.NumberSchema} id_tipo_identificacion - ID del tipo de identificación (e.g., Cédula, Pasaporte). Requerido.
 * @property {Yup.StringSchema | Yup.NullableSchema} empresa - Nombre de la empresa de procedencia. Opcional (nullable).
 * @property {Yup.StringSchema} nombre_destinatario - Nombre de la persona o departamento a visitar. Requerido.
 * @property {Yup.NumberSchema} id_area - ID del área/departamento a visitar. Requerido.
 * @property {Yup.StringSchema | Yup.NullableSchema} observaciones - Comentarios o notas adicionales. Opcional (nullable).
 */
const VisitSchema = Yup.object({
  nombre_visitante: Yup.string().required("El nombre completo es obligatorio."),
  telefono: Yup.string().required("El telefono es obligatorio"),
  identificacion: Yup.string().required("La identificacion es obligatoria."),
  id_tipo_identificacion: Yup.number().required(
    "El tipo de identificacion es obligatoria."
  ),
  empresa: Yup.string().nullable(),
  nombre_destinatario: Yup.string().required("El destinatario es obligatorio."),
  id_area: Yup.number().required("El área es obligatoria"),
  observaciones: Yup.string().nullable(),
});

export default VisitSchema;
