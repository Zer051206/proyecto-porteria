/**
 * @file authSchema.js
 * @module Schemas
 * @description Define los esquemas de validación (usando Zod) para las operaciones de autenticación.
 * @requires zod
 */

import { z } from "zod";

/**
 * @const {z.ZodObject} registerSchema
 * @description Esquema para la validación del registro de nuevos usuarios.
 */
export const registerSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es obligatorio.",
    })
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres." }),

  apellido: z
    .string({
      required_error: "El apellido es obligatorio.",
    })
    .trim()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
    .max(50, { message: "El apellido no puede tener más de 50 caracteres." }),

  correo: z
    .string({
      required_error: "El correo es obligatorio.",
    })
    .trim()
    .email({ message: "El correo electrónico no es válido." }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, {
      message:
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
    }),
});

/**
 * @const {z.ZodObject} loginSchema
 * @description Esquema para la validación del inicio de sesión.
 */
export const loginSchema = z.object({
  correo: z
    .string({
      required_error: "El correo es obligatorio.",
    })
    .trim()
    .email({ message: "El correo electrónico no es válido." }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(1, { message: "La contraseña no puede estar vacía." }),
});

/**
 * @const {z.ZodObject} oauthSchema
 * @description Esquema para validar y transformar los datos recibidos de un proveedor OAuth.
 * Estandariza los diferentes formatos de nombre/apellido de Google y Microsoft.
 */
export const oauthSchema = z
  .object({
    email: z.string().email(),
    given_name: z.string().optional(), // de Google
    family_name: z.string().optional(), // de Google
    firstName: z.string().optional(), // de Microsoft
    lastName: z.string().optional(), // de Microsoft
    id_oauth: z.string(),
    proveedor_oauth: z.enum(["google", "microsoft"]),
  })
  .transform((data) => {
    return {
      correo: data.email,
      nombre: data.given_name || data.firstName || "Usuario",
      apellido: data.family_name || data.lastName || "Externo",
      id_oauth: data.id_oauth,
      proveedor_oauth: data.proveedor_oauth,
    };
  });
