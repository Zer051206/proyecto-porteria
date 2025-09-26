/**
 * @file errorMiddleware.js
 * @module errorHandlerMiddleware
 * @description Middleware de manejo de errores centralizado para Express. Captura errores lanzados
 * en cualquier parte de la aplicación (rutas, controladores, middlewares) y formatea la respuesta
 * HTTP con un código de estado (statusCode) y un mensaje amigable para el cliente.
 */

import {
  AuthError,
  VisitError,
  PackageError,
  ApiError,
  DatabaseConnectionError,
} from "../utils/customErrors.js";
import { ZodError } from "zod";
import pkg from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = pkg;

/**
 * @function errorHandler
 * @description Middleware de manejo de errores de Express (firma de 4 parámetros).
 * Decide el código de estado HTTP y el mensaje de respuesta basándose en el tipo de error lanzado.
 * @param {Error} err - Objeto de error lanzado (puede ser una instancia de error estándar o personalizado).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware (usualmente no se llama).
 * @returns {void} Envía una respuesta JSON con el formato de error estandarizado.
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error capturado:", err, err.message);

  let statusCode = 500;
  let message = "Ha ocurrido un error inesperado en el servidor.";
  let errors = null;

  // Manejar errores personalizados de la aplicación (ej: 400, 403, 404, etc.)
  if (
    err instanceof AuthError ||
    err instanceof VisitError ||
    err instanceof PackageError ||
    err instanceof ApiError
  ) {
    statusCode = err.status || 500;
    message = err.message;
  }

  // Manejar errores de validación de Zod (peticiones con formato inválido)
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Error de validación en los datos de la solicitud.";
    errors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }

  // Manejar errores de JWT (Autenticación)
  else if (
    err instanceof JsonWebTokenError ||
    err instanceof TokenExpiredError
  ) {
    statusCode = 401;
    message = "Token inválido o expirado. Acceso no autorizado.";
  }

  // Manejar errores de conexión a la base de datos
  else if (err instanceof DatabaseConnectionError) {
    statusCode = 500;
    message =
      "Estamos experimentando problemas técnicos. Por favor, inténtelo de nuevo más tarde.";
  }

  // Manejar errores de validación genéricos (si los hubiera, ej. Mongoose u otros)
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Error de validación.";
    errors = err.errors;
  } else if (err.name === "NoValidUpdateDataError") {
    statusCode = 400;
    message = err.message;
  }
  /**
   * @description Envía la respuesta de error estandarizada al cliente.
   * La respuesta incluye el código de estado, un indicador de éxito (false), el mensaje
   * de error y, opcionalmente, una lista de errores detallados (para validaciones).
   */
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errors && { errors }), // Incluir 'errors' solo si no es nulo
  });
};

export default errorHandler;
