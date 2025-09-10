import { z } from 'zod';

export const packageSchemaReceive = z.object({
  id_tipo_paquete: z.number({
    required_error: "El tipo de paquete es obligatorio",
    invalid_type_error: "El tipo de paquete debe ser un número"
  })
  .min(1, { message: "El tipo de paquete debe ser un número positivo" }),
  nombre_destinatario: z.string({
    required_error: "El nombre del destinatario es obligatorio",
    invalid_type_error: "El nombre del destinatario debe ser una cadena de texto"
  })
  .trim()
  .min(5, { message: "El nombre del destinatario debe tener al menos 5 caracteres" })
  .max(100, { message: "El nombre del destinatario no puede tener más de 100 caracteres" }),
  id_area: z.number({
    required_error: "El área es obligatoria",
    invalid_type_error: "El área debe ser un número"
  })
  .min(1, { message: "El área debe ser un número positivo" }),
  guia: z.string({
    required_error: "El número de guía es obligatorio", 
    invalid_type_error: "El número de guía debe ser una cadena de texto"
  })
  .trim()
  .min(5, { message: "El número de guía debe tener al menos 5 caracteres" })
  .max(50, { message: "El número de guía no puede tener más de 50 caracteres" })
  .optional(),
  empresa: z.string({
    invalid_type_error: "La empresa de transporte debe ser una cadena de texto"
  })
  .trim()
  .max(100, { message: "La empresa de transporte no puede tener más de 100 caracteres" })
  .optional(),
  mensajero_nombre: z.string({
    invalid_type_error: "El nombre del mensajero debe ser una cadena de texto"
  })
  .trim()
  .max(255, { message: "El nombre del mensajero no puede tener más de 255 caracteres" })
  .optional(),
  observaciones: z.string({
    invalid_type_error: "Las observaciones deben ser una cadena de texto"
  })
  .trim()
  .max(500, { message: "Las observaciones no pueden tener más de 500 caracteres" })
  .optional(),
});

export const packageSchemaSend = z.object({
  id_tipo_paquete: z.number({
    required_error: "El tipo de paquete es obligatorio",
    invalid_type_error: "El tipo de paquete debe ser un número"
  })
  .min(1, { message: "El tipo de paquete debe ser un número positivo" }),
  nombre_destinatario: z.string({
    required_error: "El nombre del destinatario es obligatorio",  
    invalid_type_error: "El nombre del destinatario debe ser una cadena de texto"
  })
  .trim()
  .min(5, { message: "El nombre del destinatario debe tener al menos 5 caracteres" })
  .max(100, { message: "El nombre del destinatario no puede tener más de 100 caracteres" }),
  id_area: z.number({
    required_error: "El área es obligatoria",
    invalid_type_error: "El área debe ser un número"
  })
  .min(1, { message: "El área debe ser un número positivo" }),
  guia: z.string({
    invalid_type_error: "El número de guía debe ser una cadena de texto"
  })
  .trim()
  .min(5, { message: "El número de guía debe tener al menos 5 caracteres" })
  .max(50, { message: "El número de guía no puede tener más de 50 caracteres" })
  .optional(),
  empresa: z.string({
    invalid_type_error: "La empresa de transporte debe ser una cadena de texto"
  })
  .trim()
  .max(100, { message: "La empresa de transporte no puede tener más de 100 caracteres" })
  .optional(),
  mensajero_nombre: z.string({
    invalid_type_error: "El nombre del mensajero debe ser una cadena de texto"
  })
  .trim()
  .max(255, { message: "El nombre del mensajero no puede tener más de 255 caracteres" })
  .optional(),
  observaciones: z.string({
    invalid_type_error: "Las observaciones deben ser una cadena de texto"
  })
  .trim()
  .max(500, { message: "Las observaciones no pueden tener más de 500 caracteres" })
  .optional(),
  destino_salida : z.string({
    required_error: "El destino de salida es obligatorio",
    invalid_type_error: "El destino de salida debe ser una cadena de texto"
  })
  .trim()
  .min(5, { message: "El destino de salida debe tener al menos 5 caracteres" })
  .max(100, { message: "El destino de salida no puede tener más de 100 caracteres" })
});