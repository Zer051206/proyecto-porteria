import { z } from 'zod' 

export const visitEntrySchema = z.object({
  nombre_visitante: z.string({
    required_error: "El nombre completo del visitante es obligatorio",
    invalid_type_error: "El nombre completo debe ser una cadena de texto"
  })
  .trim()
  .min(5, { message: "El nombre completo debe tener al menos 5 caracteres" })
  .max(100, { message: "El nombre completo no puede tener más de 100 caracteres" }),

  telefono: z.string({
    required_error: "El teléfono es obligatorio",
    invalid_type_error: "El teléfono debe ser una cadena de texto"
  }).trim()
  .min(7, { message: "El teléfono debe tener al menos 7 caracteres" })
  .max(15, { message: "El teléfono no puede tener más de 15 caracteres" }),
  
  identificacion: z.number({
    required_error: "La identificación es obligatoria",
    invalid_type_error: "La identificación debe ser un número"
  })
  .min(1, { message: "La identificación debe ser un número positivo" }),

  id_tipo_identificacion: z.number({
    required_error: "El tipo de identificación es obligatorio",
    invalid_type_error: "El tipo de identificación debe ser un número"
  })
  .min(1, { message: "El tipo de identificación debe ser un número positivo" }),

  empresa: z.string({
    invalid_type_error: "La empresa debe ser una cadena de texto"
  }).trim()
  .max(100, { message: "El nombre de la empresa no puede tener más de 100 caracteres" })
  .optional(),

  nombre_destinatario: z.string({
    required_error: "El nombre de la persona a visitar es obligatoria",
    invalid_type_error: "El nombre de la persona a visitar debe ser una cadena de texto"
  })
  .trim()
  .min(5, { message: "El nombre de la persona a visitar debe tener al menos 5 caracteres" })
  .max(100, { message: "El nombre de la persona a visitar no puede tener más de 100 caracteres" }),

  id_area: z.number({
    required_error: "El área a visitar es obligatoria",
    invalid_type_error: "El área a visitar debe ser un número"
  })
  .min(1, { message: "El área a visitar debe ser un número positivo" }),

  motivo: z.string({
    required_error: "El motivo de la visita es obligatorio",
    invalid_type_error: "El motivo de la visita debe ser una cadena de texto"
  })
  .trim()
  .min(10, { message: "El motivo de la visita debe tener al menos 10 caracteres" })
  .max(255, { message: "El motivo de la visita no puede tener más de 255 caracteres" }),

  observaciones: z.string({
    invalid_type_error: "Las observaciones deben ser una cadena de texto"
  })
});