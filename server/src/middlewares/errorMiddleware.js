/**
 * @file errorMiddleware.js
 * @module Middlewares
 * @description Middleware de manejo de errores centralizado para Express. Captura todos los errores
 * lanzados en la aplicación, los registra y formatea una respuesta HTTP estandarizada.
 * @requires ../utils/customErrors.js
 * @requires zod
 * @requires jsonwebtoken
 * @requires sequelize
 * @requires ../config/logger.js
 */

import logger from "../config/logger.js";
import { AppError } from "../utils/customErrors.js";
import { ZodError } from "zod";
import pkg from "jsonwebtoken";
import {
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "sequelize";

const { JsonWebTokenError, TokenExpiredError } = pkg;

/**
 * @function errorHandler
 * @description Middleware de Express que maneja todos los errores de la aplicación.
 * @param {Error} err - El objeto de error capturado.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} _next - Función next de Express (sin usar).
 * @returns {void} Envía una respuesta JSON estandarizada.
 */
const errorHandler = (err, req, res, _next) => {
  // 1. REGISTRAMOS EL ERROR
  // Pino maneja el objeto 'err' de forma nativa, incluyendo el stack trace.
  logger.error(
    err,
    `Error capturado en la ruta: ${req.method} ${req.originalUrl}`
  );

  // 2. DETERMINAMOS EL CÓDIGO DE ESTADO Y EL MENSAJE
  let statusCode = 500;
  let message = "Ha ocurrido un error inesperado en el servidor.";
  let errors = null;

  // Manejo de nuestros errores personalizados (todos heredan de AppError)
  if (err instanceof AppError) {
    statusCode = err.status;
    message = err.message;
  }
  // Manejo de errores de validación de Zod
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Error de validación en los datos de la solicitud.";
    errors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }
  // Manejo de errores de JWT
  else if (
    err instanceof JsonWebTokenError ||
    err instanceof TokenExpiredError
  ) {
    statusCode = 401;
    message = "Token inválido o expirado. Acceso no autorizado.";
  }
  // Manejo de errores específicos de Sequelize
  else if (err instanceof UniqueConstraintError) {
    statusCode = 409; // Conflict
    message = "El registro ya existe. Uno de los campos únicos ya está en uso.";
    errors = err.errors.map((e) => ({ path: e.path, message: e.message }));
  } else if (err instanceof ForeignKeyConstraintError) {
    statusCode = 409; // Conflict
    message = "No se puede realizar la operación debido a registros asociados.";
  } else if (err instanceof SequelizeValidationError) {
    statusCode = 400;
    message = "Error de validación de la base de datos.";
    errors = err.errors.map((e) => ({ path: e.path, message: e.message }));
  } else if (err instanceof DatabaseError) {
    statusCode = 500;
    message = "Error interno de la base de datos.";
  }

  // Para errores genéricos 500 en desarrollo, mostramos el mensaje real para facilitar la depuración.
  if (process.env.NODE_ENV !== "production" && statusCode === 500 && !errors) {
    message = err.message;
  }

  // 3. ENVIAMOS LA RESPUESTA
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errors && { errors }), // Incluye 'errors' solo si no es nulo
  });
};

export default errorHandler;
