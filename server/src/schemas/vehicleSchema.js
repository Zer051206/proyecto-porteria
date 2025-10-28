import { z } from "zod";

// --- Esquema Base ---
// Define la estructura y validaciones de un solo vehículo.
// Usado como base para creación y actualización.
const vehicleBaseSchema = z
  .object({
    placa: z
      .string()
      .max(10, { message: "La placa no debe exceder los 10 caracteres." })
      .regex(/^[A-Z0-9]{1,10}$/, {
        message: "Placa inválida. Use mayúsculas y números.",
      })
      .nullable() // Permite null
      .optional(), // Permite undefined o no incluirlo
    tipo_vehiculo: z.enum(["Carro", "Moto", "Bicicleta"], {
      required_error: "El tipo de vehículo es obligatorio.",
      invalid_type_error:
        "Seleccione un tipo de vehículo válido (Carro, Moto, Bicicleta).",
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
    identificacion_dueno: z
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
  .refine(
    (data) => {
      // Si NO es Bicicleta, la placa es requerida y no debe ser null/undefined/vacía
      if (data.tipo_vehiculo !== "Bicicleta") {
        return data.placa && data.placa.trim().length > 0;
      }
      return true; // Si es Bicicleta, la placa puede ser null o string vacío
    },
    {
      message: "La placa es obligatoria para Carros y Motos.",
      path: ["placa"],
    }
  )
  .refine(
    (data) => {
      // Si es Moto, el género debe ser Masculino o Femenino
      if (data.tipo_vehiculo === "Moto") {
        return (
          data.genero_dueno === "Masculino" || data.genero_dueno === "Femenino"
        );
      }
      return true;
    },
    {
      message: "Debe seleccionar el género del conductor para Motos.",
      path: ["genero_dueno"],
    }
  );

// --- Esquema de Creación (Array) ---
// Define que la entrada debe ser un array con al menos un objeto
// que cumpla con el esquema base.
export const createVehiclesSchema = z
  .array(vehicleBaseSchema)
  .min(1, { message: "Debe agregar al menos un vehículo." });

// --- Esquema de Actualización ---
// Toma el esquema base y hace todos los campos opcionales.
export const updateVehicleSchema = vehicleBaseSchema.partial();
