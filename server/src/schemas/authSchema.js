// server/schemas/userSchema.js

import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es obligatorio",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
  
  lastName: z
    .string()
    .trim()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede tener más de 50 caracteres" }),
  
  email: z
    .string()
    .trim()
    .email({ message: "El correo electrónico no es válido" }),

  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});