/**
 * @file userSchema.js
 * @module userSchema
 * @description Define los esquemas de validación (usando Zod) para las operaciones
 * de autenticación de usuarios: registro, inicio de sesión (login) y autenticación
 * a través de OAuth.
 */
import { z } from "zod";

/**
 * @const {z.ZodObject} registerSchema
 * @description Esquema de validación para el registro de nuevos usuarios.
 * Requiere nombre, apellido, correo electrónico (formato válido) y una contraseña de mínimo 6 caracteres.
 */
export const registerSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es obligatorio.",
      invalid_type_error: "El nombre debe ser una cadena de texto.",
    })
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres." }),

  apellido: z
    .string({
      required_error: "El apellido es obligatorio.",
      invalid_type_error: "El apellido debe ser una cadena de texto.",
    })
    .trim()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
    .max(50, { message: "El apellido no puede tener más de 50 caracteres." }),

  correo: z
    .string({
      required_error: "El correo es obligatorio.",
      invalid_type_error: "El correo debe ser una cadena de texto.",
    })
    .trim()
    .email({ message: "El correo electrónico no es válido." }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria.",
      invalid_type_error: "La contraseña debe ser una cadena de texto.",
    })
    .min(6, { message: "La contraseña debe tener al menos 6 carácteres." }),
});

/**
 * @const {z.ZodObject} loginSchema
 * @description Esquema de validación para el inicio de sesión (login) de usuarios.
 * Requiere correo electrónico (formato válido) y una contraseña de mínimo 6 caracteres.
 */
export const loginSchema = z.object({
  correo: z
    .string({
      required_error: "El correo es obligatorio.",
      invalid_type_error: "El correo debe ser una cadena de texto.",
    })
    .trim()
    .email({ message: "El correo electronico no es válido." }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria.",
      invalid_type_error: "La contraseña debe ser una cadena de texto",
    })
    .min(6, { message: "La contraseña debe tener al menos 6 carácteres" }),
});

/**
 * @const {z.ZodObject} oauthSchema
 * @description Esquema de validación para los datos recibidos de un proveedor OAuth (Google/Microsoft).
 * Realiza una transformación para estandarizar los campos de nombre/apellido en el formato local.
 * @property {z.ZodEnum} proveedor_oauth - Debe ser 'google' o 'microsoft'.
 */
export const oauthSchema = z
  .object({
    email: z.string().email(),
    given_name: z.string().optional(), // De Google
    family_name: z.string().optional(), // De Google
    firstName: z.string().optional(), // De Microsoft
    lastName: z.string().optional(), // De Microsoft
    id_oauth: z.string(),
    proveedor_oauth: z.enum(["google", "microsoft"]),
  })
  .transform((data) => {
    return {
      correo: data.email,
      nombre: data.given_name || data.firstName || null,
      apellido: data.family_name || data.lastName || null,
      id_oauth: data.id_oauth,
      proveedor_oauth: data.proveedor_oauth,
    };
  });
