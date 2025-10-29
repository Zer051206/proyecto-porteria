/**
 * @file vehicleSchema.js
 * @module Schemas
 * @description Define los esquemas de validación (usando Zod) para las operaciones de gestión de vehículos.
 * Incluye esquemas para la creación de uno o múltiples vehículos y para la actualización.
 * @requires zod
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} vehicleBaseSchema
 * @description Esquema base para la validación de los datos de un único vehículo.
 * Incluye validaciones para todos los campos de la tabla `vehiculos` y
 * refinamientos para lógica condicional (placa requerida según tipo, género requerido para motos).
 * Este esquema es la base para los esquemas de creación y actualización.
 */
const vehicleBaseSchema = z
  .object({
    placa: z
      .string()
      .max(10, { message: "La placa no debe exceder los 10 caracteres." })
      .regex(/^(|[A-Z0-9]{1,10})$/, {
        message: "Placa inválida. Use mayúsculas y números.",
      })
      .nullable() // Permite null
      .optional(), // Permite undefined o no incluirlo
    tipo_vehiculo: z.enum(["Carro", "Moto", "Bicicleta", "Otros"], {
      required_error: "El tipo de vehículo es obligatorio.",
      invalid_type_error:
        "Seleccione un tipo de vehículo válido (Carro, Moto, Bicicleta, Otros).",
    }),
    modelo_descripcion: z
      .string()
      .max(100, {
        message: "El modelo/descripción no debe exceder los 100 caracteres.",
      })
      .nullable()
      .optional(),
    nombre_dueno: z
      .string()
      .min(3, {
        message: "El nombre del dueño debe tener al menos 3 caracteres.",
      })
      .max(150, {
        message: "El nombre del dueño no debe exceder los 150 caracteres.",
      })
      .regex(/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/, {
        message: "Nombre inválido. Use solo letras y espacios.",
      }), // Regex para nombres (incluye ñ y acentos)
    identificacion_dueno: z.coerce
      .string()
      .min(5, {
        message: "La identificación debe tener al menos 5 caracteres.",
      })
      .max(20, {
        message: "La identificación no debe exceder los 20 caracteres.",
      })
      .regex(/^[A-Za-z0-9]+$/, {
        message: "Identificación inválida. Use solo letras y números.",
      }),
    genero_dueno: z
      .enum(["Masculino", "Femenino", "N/A"], {
        invalid_type_error: "Seleccione un género válido.",
      })
      .default("N/A"),
    lugar_asignado_default: z
      .string()
      .max(100, {
        message: "El lugar asignado no debe exceder los 100 caracteres.",
      })
      .nullable()
      .optional(),
    activo: z.boolean().optional().default(true),
    codigo_sensor: z
      .string()
      .max(100, {
        message: "El código del sensor no debe exceder los 100 caracteres.",
      })
      .nullable()
      .optional()
      .refine((val) => !val || val.trim().length > 0, {
        // Si se proporciona, no debe estar vacío
        message: "El código del sensor no puede estar vacío si se proporciona.",
        path: ["codigo_sensor"],
      }),
  })
  // Refinamiento 1: Placa obligatoria excepto para Bicicleta y Otros
  .refine(
    (data) => {
      // Si NO es Bicicleta, la placa es requerida y no debe ser null/undefined/vacía
      if (
        data.tipo_vehiculo !== "Bicicleta" &&
        data.tipo_vehiculo !== "Otros"
      ) {
        return data.placa && data.placa.trim().length > 0;
      }
      return true; // Si es Bicicleta, la placa puede ser null o string vacío
    },
    {
      message: "La placa es obligatoria para Carros y Motos.",
      path: ["placa"],
    }
  );

/**
 * @const {z.ZodArray} createVehiclesSchema
 * @description Esquema para la validación de la creación de uno o más vehículos.
 * Asegura que la entrada sea un array que contenga al menos un objeto
 * que cumpla con `vehicleBaseSchema`.
 */
export const createVehiclesSchema = z
  .array(vehicleBaseSchema)
  .min(1, { message: "Debe agregar al menos un vehículo." });

/**
 * @const {z.ZodObject} updateVehicleSchema
 * @description Esquema para la validación de la actualización de un vehículo.
 * Utiliza `.partial()` sobre `vehicleBaseSchema`, lo que hace que todos los campos
 * sean opcionales. Permite enviar solo los campos que se desean modificar.
 * Las validaciones internas de cada campo (longitud, regex, etc.) se mantienen.
 */
export const updateVehicleSchema = vehicleBaseSchema.partial();
