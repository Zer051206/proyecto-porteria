/**
 * @file packageSchema.js
 * @module Schemas
 * @description Define los esquemas de validación (usando Zod) para las operaciones de gestión de paquetes.
 * @requires zod
 */

import { z } from "zod";

/**
 * @const {z.ZodObject} basePackageSchema
 * @description Esquema base que contiene los campos comunes para todas las operaciones de paquetes.
 * Otros esquemas más específicos extenderán este para añadir sus propios campos.
 */
const basePackageSchema = z.object({
  id_tipo_paquete: z.coerce
    .number({ required_error: "El tipo de paquete es obligatorio." })
    .int()
    .positive("Debe seleccionar un tipo de paquete."),

  guia: z
    .string({ invalid_type_error: "El número de guía debe ser texto." })
    .trim()
    .min(5, { message: "El número de guía debe tener al menos 5 caracteres." })
    .max(50, {
      message: "El número de guía no puede tener más de 50 caracteres.",
    })
    .optional()
    .nullable(),

  id_area: z.coerce
    .number({ required_error: "El área es obligatoria." })
    .int()
    .positive("Debe seleccionar un área."),

  empresa_transporte: z
    .string({ invalid_type_error: "La empresa debe ser texto." })
    .trim()
    .max(100, {
      message: "La empresa de transporte no puede tener más de 100 caracteres.",
    })
    .optional()
    .nullable(),

  mensajero_nombre: z
    .string({ invalid_type_error: "El nombre del mensajero debe ser texto." })
    .trim()
    .max(255, {
      message: "El nombre del mensajero no puede tener más de 255 caracteres.",
    })
    .optional()
    .nullable(),

  observaciones: z
    .string({ invalid_type_error: "Las observaciones deben ser texto." })
    .trim()
    .max(500, {
      message: "Las observaciones no pueden tener más de 500 caracteres.",
    })
    .optional()
    .nullable(),
});

/**
 * @const {z.ZodObject} receivePackageSchema
 * @description Esquema para la recepción de un paquete. Extiende el schema base y añade el `nombre_destinatario`.
 */
export const receivePackageSchema = basePackageSchema.extend({
  nombre_destinatario: z
    .string({ required_error: "El nombre del destinatario es obligatorio." })
    .trim()
    .min(5, {
      message: "El nombre del destinatario debe tener al menos 5 caracteres.",
    })
    .max(100, {
      message:
        "El nombre del destinatario no puede tener más de 100 caracteres.",
    }),
});

/**
 * @const {z.ZodObject} sendPackageSchema
 * @description Esquema para el envío de un paquete. Extiende el schema base y añade `nombre_remitente` y `destino_salida`.
 */
export const sendPackageSchema = basePackageSchema.extend({
  nombre_remitente: z
    .string({ required_error: "El nombre del remitente es obligatorio." })
    .trim()
    .min(5, {
      message: "El nombre del remitente debe tener al menos 5 caracteres.",
    })
    .max(100, {
      message: "El nombre del remitente no puede tener más de 100 caracteres.",
    }),

  destino_salida: z
    .string({ required_error: "El destino de salida es obligatorio." })
    .trim()
    .min(5, {
      message: "El destino de salida debe tener al menos 5 caracteres.",
    })
    .max(100, {
      message: "El destino de salida no puede tener más de 100 caracteres.",
    }),
});

/**
 * @const {z.ZodArray} createReceivePackageSchema
 * @description Esquema para el endpoint de creación, que espera un array de paquetes de recepción.
 */
export const createReceivePackageSchema = z
  .array(receivePackageSchema)
  .min(1, "Debes agregar al menos un paquete.");

/**
 * @const {z.ZodArray} createSendPackageSchema
 * @description Esquema para el endpoint de creación, que espera un array de paquetes de envío.
 */
export const createSendPackageSchema = z
  .array(sendPackageSchema)
  .min(1, "Debes agregar al menos un paquete.");
