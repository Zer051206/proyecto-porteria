/**
 * @file visitSchema.js
 * @module Schemas
 * @description Define los esquemas de validación (usando Zod) para las operaciones de gestión de visitas.
 * @requires zod
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} visitEntrySchema
 * @description Esquema para la validación del registro de entrada de un visitante.
 * Realiza una transformación para unificar el nombre y el apellido.
 */
export const visitEntrySchema = z
  .object({
    nombre_visitante: z
      .string({ required_error: "El nombre es obligatorio." })
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres."),
    apellido: z
      .string({ required_error: "El apellido es obligatorio." })
      .trim()
      .min(3, "El apellido debe tener al menos 3 caracteres."),
    telefono: z.coerce
      .string({ required_error: "El teléfono es obligatorio." })
      .trim()
      .min(7, "El teléfono debe tener al menos 7 caracteres."),
    identificacion: z.coerce
      .string({ required_error: "La identificación es obligatoria." })
      .min(1, "La identificación es obligatoria."),
    id_tipo_identificacion: z.coerce
      .number({ required_error: "El tipo de ID es obligatorio." })
      .int()
      .positive("Debe seleccionar un tipo de ID."),
    empresa: z.string().trim().max(100).optional(),
    nombre_destinatario: z
      .string({ required_error: "El nombre del destinatario es obligatorio." })
      .trim()
      .min(3, "El destinatario debe tener al menos 3 caracteres."),
    id_area: z.coerce
      .number({ required_error: "El área a visitar es obligatoria." })
      .int()
      .positive("Debe seleccionar un área."),
    motivo: z
      .string({ required_error: "El motivo de la visita es obligatorio." })
      .trim()
      .min(10, "El motivo debe tener al menos 10 caracteres."),
    observaciones: z.string().optional(),
    firma_base64: z
      .string({ required_error: "La firma es obligatoria." })
      .min(1, "La firma no puede estar vacía."),
  })
  .transform((data) => ({
    ...data,
    nombre_visitante: `${data.nombre_visitante} ${data.apellido}`.trim(),
    apellido: undefined,
  }));

/**
 * @const {z.ZodObject} visitExitSchema
 * @description Esquema para la validación de la finalización (salida) de una visita.
 */
export const visitExitSchema = z.object({
  visitId: z.coerce.number().int().positive("El ID de la visita es inválido."),
});
