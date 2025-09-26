/**
 * @file packageSchema.js
 * @module packageSchema
 * @description Define los esquemas de validación (usando Zod) para las operaciones
 * de gestión de paquetes: recepción (entrada) y envío (salida).
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} packageSchemaReceive
 * @description Esquema de validación para el registro de recepción de un paquete (entrada).
 * Requiere el tipo de paquete, destinatario y área, con campos opcionales para la guía,
 * empresa de transporte y mensajero.
 */
export const packageSchemaReceive = z.object({
  id_tipo_paquete: z.coerce
    .number({
      required_error: "El tipo de paquete es obligatorio",
      invalid_type_error: "El tipo de paquete debe ser un número",
    })
    .min(1, { message: "El tipo de paquete debe ser un número positivo" }),
  nombre_destinatario: z
    .string({
      required_error: "El nombre del destinatario es obligatorio",
      invalid_type_error:
        "El nombre del destinatario debe ser una cadena de texto",
    })
    .trim()
    .min(5, {
      message: "El nombre del destinatario debe tener al menos 5 caracteres",
    })
    .max(100, {
      message:
        "El nombre del destinatario no puede tener más de 100 caracteres",
    }),
  id_area: z.coerce
    .number({
      required_error: "El área es obligatoria",
      invalid_type_error: "El área debe ser un número",
    })
    .min(1, { message: "El área debe ser un número positivo" }),
  guia: z
    .string({
      required_error: "El número de guía es obligatorio",
      invalid_type_error: "El número de guía debe ser una cadena de texto",
    })
    .trim()
    .min(5, { message: "El número de guía debe tener al menos 5 caracteres" })
    .max(50, {
      message: "El número de guía no puede tener más de 50 caracteres",
    })
    .nullable()
    .optional(),
  empresa_transporte: z
    .string({
      invalid_type_error:
        "La empresa de transporte debe ser una cadena de texto",
    })
    .trim()
    .max(100, {
      message: "La empresa de transporte no puede tener más de 100 caracteres",
    })
    .nullable()
    .optional(),
  mensajero_nombre: z
    .string({
      invalid_type_error:
        "El nombre del mensajero debe ser una cadena de texto",
    })
    .trim()
    .max(255, {
      message: "El nombre del mensajero no puede tener más de 255 caracteres",
    })
    .nullable()
    .optional(),
  observaciones: z
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .trim()
    .max(500, {
      message: "Las observaciones no pueden tener más de 500 caracteres",
    })
    .nullable()
    .optional(),
});

/**
 * @const {z.ZodObject} packageSchemaSend
 * @description Esquema de validación para el registro de envío de un paquete (salida).
 * Incluye todos los campos de recepción más el campo obligatorio 'destino_salida',
 * pero se enfoca en el nombre del remitente.
 */
export const packageSchemaSend = z.object({
  id_tipo_paquete: z.coerce
    .number({
      required_error: "El tipo de paquete es obligatorio",
      invalid_type_error: "El tipo de paquete debe ser un número",
    })
    .min(1, { message: "El tipo de paquete debe ser un número positivo" }),
  nombre_remitente: z
    .string({
      required_error: "El nombre del remitente es obligatorio",
      invalid_type_error:
        "El nombre del remitente debe ser una cadena de texto",
    })
    .trim()
    .min(5, {
      message: "El nombre del remitente debe tener al menos 5 caracteres",
    })
    .max(100, {
      message: "El nombre del remitente no puede tener más de 100 caracteres",
    }),
  id_area: z.coerce
    .number({
      required_error: "El área es obligatoria",
      invalid_type_error: "El área debe ser un número",
    })
    .min(1, { message: "El área debe ser un número positivo" }),
  guia: z.coerce
    .string({
      invalid_type_error: "El número de guía debe ser una cadena de texto",
    })
    .trim()
    .min(5, { message: "El número de guía debe tener al menos 5 caracteres" })
    .max(50, {
      message: "El número de guía no puede tener más de 50 caracteres",
    })
    .nullable()
    .optional(),
  empresa_transporte: z
    .string({
      invalid_type_error:
        "La empresa de transporte debe ser una cadena de texto",
    })
    .trim()
    .max(100, {
      message: "La empresa de transporte no puede tener más de 100 caracteres",
    })
    .optional(),
  mensajero_nombre: z
    .string({
      invalid_type_error:
        "El nombre del mensajero debe ser una cadena de texto",
    })
    .trim()
    .max(255, {
      message: "El nombre del mensajero no puede tener más de 255 caracteres",
    })
    .nullable()
    .optional(),
  observaciones: z
    .string({
      invalid_type_error: "Las observaciones deben ser una cadena de texto",
    })
    .trim()
    .max(500, {
      message: "Las observaciones no pueden tener más de 500 caracteres",
    })
    .nullable()
    .optional(),
  destino_salida: z
    .string({
      required_error: "El destino de salida es obligatorio",
      invalid_type_error: "El destino de salida debe ser una cadena de texto",
    })
    .trim()
    .min(5, {
      message: "El destino de salida debe tener al menos 5 caracteres",
    })
    .max(100, {
      message: "El destino de salida no puede tener más de 100 caracteres",
    }),
});
