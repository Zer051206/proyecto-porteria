/**
 * @file packageSchema.js
 * @module Schemas
 * @description Define los esquemas de validación (usando Zod) para las operaciones de paquetes.
 * Incluye lógica condicional para documentos, radicados y firmas.
 * @requires zod
 */
import { z } from "zod";

// --- IDs Fijos ---
const ID_TIPO_DOCUMENTO = 2;
const ID_AREA_CONTABILIDAD = 3;

/**
 * @const {z.ZodObject} receivePackageSchema
 * @description Esquema para la validación del registro de recepción de un paquete.
 * Contiene lógica condicional compleja para Documentos y Radicados.
 */
export const receivePackageSchema = z
  .object({
    id_tipo_paquete: z.coerce
      .number({ required_error: "El tipo de paquete es obligatorio." })
      .int()
      .positive("Debe seleccionar un tipo de paquete."),
    tipo_operacion: z.string({
      required_error: "El tipo de operacion es obligatorio.",
    }),
    id_area: z.coerce
      .number({ required_error: "El área es obligatoria." })
      .int()
      .positive("Debe seleccionar un área."),
    nombre_destinatario: z
      .string({ required_error: "El destinatario es obligatorio." })
      .trim()
      .min(3, "El destinatario debe tener al menos 3 caracteres."),
    guia: z.string().trim().max(50).nullable().optional(),
    empresa_transporte: z.string().trim().max(100).nullable().optional(),
    mensajero_nombre: z.string().trim().max(255).nullable().optional(),
    observaciones: z.string().trim().nullable().optional(),
    proveedor: z.preprocess(
      (val) => (val === "" ? null : val), // Si es "", lo vuelve null
      z.string().trim().max(150).nullable().optional() // Valida el resultado
    ),
    op: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce
        .number()
        .int("La OP debe ser un entero.")
        .positive("La OP debe ser positiva.")
        .nullable()
        .optional()
    ),
    referencia: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce
        .number()
        .int("La Referencia debe ser un entero.")
        .positive("La Referencia debe ser positiva.")
        .nullable()
        .optional()
    ),
    cantidad: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce.number().int().positive().nullable().optional()
    ),

    // --- Campos Condicionales (Documento / Radicado) ---
    es_radicado: z.boolean().optional().default(false),
    referencia_radicado: z.string().trim().max(100).nullable().optional(),
    nombre_recibe_documento: z.string().trim().max(150).nullable().optional(),

    // Firmas (Base64) - se validan como string no vacío en .refine
    path_firma_recibe_documento: z.string().nullable().optional(),
    path_firma_validador: z.string().nullable().optional(),
    path_firma_entregador: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.id_tipo_paquete === ID_TIPO_DOCUMENTO) {
        // Se requiere nombre y firma del receptor
        return (
          data.nombre_recibe_documento &&
          data.nombre_recibe_documento.trim().length > 2 &&
          data.path_firma_recibe_documento &&
          data.path_firma_recibe_documento.length > 0
        );
      }
      return true;
    },
    {
      message:
        "Para 'Documento', el nombre y la firma de quien recibe son obligatorios.",
      path: ["nombre_recibe_documento"],
    }
  )
  .refine((data) => {
    if (data.es_radicado) {
      // Se requiere la referencia Y las TRES firmas
      const refOk =
        data.referencia_radicado && data.referencia_radicado.trim().length > 0;
      const firmasOk =
        data.path_firma_validador &&
        data.path_firma_validador.length > 0 &&
        data.path_firma_entregador &&
        data.path_firma_entregador.length > 0 &&
        // (La firma del receptor ya es requerida por ser 'Documento')
        data.path_firma_recibe_documento &&
        data.path_firma_recibe_documento.length > 0;
      // Y el área debe ser Contabilidad
      const areaOk = data.id_area === ID_AREA_CONTABILIDAD;

      if (!refOk) {
        return {
          message: "El N° de Referencia es obligatorio para radicados.",
          path: ["referencia_radicado"],
        };
      }
      if (!firmasOk) {
        return {
          message:
            "Las 3 firmas (receptor, validador, entregador) son obligatorias para radicados.",
          path: ["path_firma_validador"],
        };
      }
      if (!areaOk) {
        return {
          message:
            "Los radicados solo pueden asignarse al área de Contabilidad.",
          path: ["id_area"],
        };
      }
    }
    return true; // No es un radicado, pasa
  });

/**
 * @const {z.ZodObject} sendPackageSchema
 * @description Esquema para la validación del registro de envío de un paquete.
 * Requiere las firmas del remitente y del validador (portero).
 */
export const sendPackageSchema = z.object({
  id_tipo_paquete: z.coerce
    .number()
    .int()
    .positive("Debe seleccionar un tipo."),
  tipo_operacion: z.string({
    required_error: "El tipo de operacion es obligatorio.",
  }),
  id_area: z.coerce
    .number()
    .int()
    .positive("El área del remitente es obligatoria."),
  nombre_remitente: z
    .string({ required_error: "El nombre del remitente es obligatorio." })
    .trim()
    .min(3, { message: "El nombre del remitente es obligatorio." }),
  destino_salida: z
    .string({ required_error: "El destino de salida es obligatorio." })
    .trim()
    .min(5, { message: "El destino de salida es obligatorio." }),
  guia: z.string().trim().max(50).nullable().optional(),
  conGuia: z.boolean().optional(),
  empresa_transporte: z.string().trim().max(100).nullable().optional(),
  mensajero_nombre: z.string().trim().max(255).nullable().optional(),
  observaciones: z.string().trim().nullable().optional(),
  proveedor: z.preprocess(
    (val) => (val === "" ? null : val), // Si es "", lo vuelve null
    z.string().trim().max(150).nullable().optional() // Valida el resultado
  ),
  op: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number()
      .int("La OP debe ser un entero.")
      .positive("La OP debe ser positiva.")
      .nullable()
      .optional()
  ),
  referencia: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number()
      .int("La Referencia debe ser un entero.")
      .positive("La Referencia debe ser positiva.")
      .nullable()
      .optional()
  ),
  cantidad: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().int().positive().nullable().optional()
  ),

  // --- Firmas de Envío (Base64) ---
  path_firma_validador_envio: z
    .string({
      required_error: "La firma del validador (portero) es obligatoria.",
    })
    .min(1, "La firma del validador no puede estar vacía."),
  path_firma_remitente: z
    .string({
      required_error: "La firma del remitente (empleado) es obligatoria.",
    })
    .min(1, "La firma del remitente no puede estar vacía."),
});
