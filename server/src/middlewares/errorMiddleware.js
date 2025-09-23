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

const errorHandler = (err, req, res, next) => {
  console.error("Error capturado:", err);

  let statusCode = 500;
  let message = "Ha ocurrido un error inesperado en el servidor.";
  let errors = null;

  // Manejar errores personalizados de la aplicación
  if (
    err instanceof AuthError ||
    err instanceof VisitError ||
    err instanceof PackageError ||
    err instanceof ApiError
  ) {
    statusCode = err.status || 500;
    message = err.message;
  }

  // Manejar errores de validación de Zod
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Error de validación en los datos de la solicitud.";
    errors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }

  // Manejar errores de JWT
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

  // Manejar errores de validación genéricos (si los hubiera)
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Error de validación.";
    errors = err.errors;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errors && { errors }), // Incluir 'errors' solo si no es nulo
  });
};

export default errorHandler;
