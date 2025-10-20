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
 * Realiza una transformación para unificar `nombre_visitante` y `apellido` en un solo campo.
 */
export const visitEntrySchema = z
  .object({
    nombre_visitante: z
      .string({ required_error: "El nombre es obligatorio." })
      .trim()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
      .max(100, { message: "El nombre no puede tener más de 100 caracteres." }),

    apellido: z
      .string({ required_error: "El apellido es obligatorio." })
      .trim()
      .min(3, { message: "El apellido debe tener al menos 3 caracteres." })
      .max(100, {
        message: "El apellido no puede tener más de 100 caracteres.",
      }),

    telefono: z.coerce
      .string({ required_error: "El teléfono es obligatorio." })
      .trim()
      .min(7, { message: "El teléfono debe tener al menos 7 caracteres." })
      .max(15, { message: "El teléfono no puede tener más de 15 caracteres." }),

    identificacion: z.coerce
      .string({ required_error: "La identificación es obligatoria." })
      .min(1, { message: "La identificación es obligatoria." }),

    id_tipo_identificacion: z.coerce
      .number({ required_error: "El tipo de ID es obligatorio." })
      .int()
      .positive("Debe seleccionar un tipo de ID."),

    empresa: z
      .string()
      .trim()
      .max(100, { message: "La empresa no puede tener más de 100 caracteres." })
      .optional(),

    nombre_destinatario: z
      .string({
        required_error: "El nombre de la persona a visitar es obligatorio.",
      })
      .trim()
      .min(3, {
        message: "El nombre del destinatario debe tener al menos 3 caracteres.",
      })
      .max(100, {
        message:
          "El nombre del destinatario no puede tener más de 100 caracteres.",
      }),

    id_area: z.coerce
      .number({ required_error: "El área a visitar es obligatoria." })
      .int()
      .positive("Debe seleccionar un área."),

    motivo: z
      .string({ required_error: "El motivo de la visita es obligatorio." })
      .trim()
      .min(10, {
        message: "El motivo de la visita debe tener al menos 10 caracteres.",
      })
      .max(255, { message: "El motivo no puede tener más de 255 caracteres." }),

    observaciones: z.string().optional(),
  })
  .transform((data) => {
    return {
      ...data,
      nombre_visitante: `${data.nombre_visitante} ${data.apellido}`.trim(),
      apellido: undefined, // Se elimina el campo 'apellido' del objeto final.
    };
  });

/**
 * @const {z.ZodObject} visitExitSchema
 * @description Esquema para la validación de la finalización (salida) de una visita.
 * Solo requiere el ID de la visita a finalizar.
 */
export const visitExitSchema = z.object({
  visitId: z.coerce.number().int().positive("El ID de la visita es inválido."),
});
