/**
 * @file customErrors.js
 * @module customErrors
 * @description Módulo que define clases de errores personalizadas (extienden la clase base Error)
 * con códigos de estado HTTP específicos, facilitando la gestión y el manejo de errores en el backend.
 */

/**
 * @class AuthError
 * @description Clase base para errores de autenticación (código 401).
 * @augments Error
 */
export class AuthError extends Error {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=401] - Código de estado HTTP por defecto.
   */
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * @class AuthenticationError
 * @description Error para cuando el usuario no tiene acceso autorizado (codigo 401).
 * @augments AuthError
 */
export class AuthenticationError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(
    message = "Acceso no autorizado. Por favor, inicia sesión con tu cuenta."
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * @class ExpiredTokenError
 * @description Error para cuando la sesión del usuario expiró (codigo 401).
 * @augments AuthError
 */
export class ExpiredTokenError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(
    message = "Sesión expirada. Por favor, vuelve a iniciar sesión para continuar."
  ) {
    super(message);
    this.name = "ExpiredTokenError";
  }
}

/**
 * @class InvalidTokenError
 * @description Error para cuando el token del usuario no es válido o directamente no existe (codigo 401).
 * @augments AuthError
 */
export class InvalidTokenError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(
    message = "El token de acceso proporcionado es inválido o no existe."
  ) {
    super(message);
    this.name = "InvalidTokenError";
  }
}

/**
 * @class ForbiddenError
 * @description Error para cuando el usuario está autenticado pero no autorizado (código 403).
 * @augments Error
 */
export class ForbiddenError extends Error {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=403] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "Acceso denegado. Tu cuenta no tiene los permisos para realizar esta acción.",
    status = 403
  ) {
    super(message);
    this.name = "ForbiddenError";
    this.status = status;
  }
}

/**
 * @class UserAlreadyExistsError
 * @description Error para cuando el correo electrónico ya está registrado (código 409).
 * @augments AuthError
 */
export class UserAlreadyExistsError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=409] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "El correo electrónico ya está registrado.",
    status = 409
  ) {
    super(message, status);
    this.name = "UserAlreadyExistsError";
  }
}

/**
 * @class UserNotFoundOrInvalidPasswordError
 * @description Error para credenciales incorrectas o si el usuario no exite (código 404).
 * @augments AuthError
 */
export class UserNotFoundOrInvalidPasswordError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=404] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "La cuenta no existe o las credenciales son incorrectas.",
    status = 404
  ) {
    super(message, status);
    this.name = "UserNotFoundOrInvalidPasswordError";
  }
}

/**
 * @class AccountDisabledError
 * @description Error para cuentas desactivadas (código 401).
 * @augments AuthError
 */
export class AccountDisabledError extends AuthError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(
    message = "La cuenta está desactivada, contacte al administrador."
  ) {
    super(message);
    this.name = "AccountDisabledError";
  }
}

/**
 * @class DatabaseConnectionError
 * @description Error para problemas de conexión con la base de datos (código 500).
 * @augments Error
 */
export class DatabaseConnectionError extends Error {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=500] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "No fue posible conectar con la base de datos.",
    status = 500
  ) {
    super(message);
    this.name = "DatabaseConnectionError";
    this.status = status;
  }
}

/**
 * @class PackageError
 * @description Clase base para errores en los CRUD de los paquetes.
 * @augments Error
 */
export class PackageError extends Error {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=400] - Código de estado HTTP por defecto.
   */
  constructor(message, status = 400) {
    super(message);
    this.name = "PackageError";
    this.status = status;
  }
}

/**
 * @class InvalidPackageIdError
 * @description Error para cuando el id del paquete proporcionado no sea válido (codigo 400).
 * @augments PackageError
 */
export class InvalidPackageIdError extends PackageError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=400] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "El id del paquete proporcionado no es válido",
    status = 400
  ) {
    super(message, status);
    this.name = "InvalidPackageIdError";
  }
}

/**
 * @class DuplicateGuideError
 * @description Error cuando ya existe un paquete con la misma guía en el mismo proceso (código 409).
 * @augments PackageError
 */
export class DuplicateGuideError extends PackageError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=409] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "Ya existe un paquete con la misma guia en este proceso.",
    status = 409
  ) {
    super(message, status);
    this.name = "DuplicateGuideError";
  }
}

/**
 * @class PackageCreateError
 * @description Error cuando falla el registro de un paquete (código 500).
 * @augments PackageError
 */
export class PackageCreateError extends PackageError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=500] - Código de estado HTTP por defecto.
   */
  constructor(message = "No se pudo registrar el paquete.", status = 500) {
    super(message, status);
    this.name = "PackageCreateError";
  }
}

/**
 * @class VisitError
 * @description Clase base para errores en los CRUD de las visitas.
 * @augments Error
 */
export class VisitError extends Error {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=400] - Código de estado HTTP por defecto.
   */
  constructor(message, status = 400) {
    super(message);
    this.name = "VisitError";
    this.status = status;
  }
}

/**
 * @class SignatureDontExistsError
 * @description Error para cuando no se proporcione la firma del visitante (codigo 404).
 * @augments VisitError
 */
export class SignatureDontExistsError extends VisitError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=404] - Código de estado HTTP por defecto.
   */
  constructor(message = "La firma del visitante es obligatoria", status = 404) {
    super(message, status);
    this.name = "SignatureDontExistsError";
  }
}

/**
 * @class InvalidVisitIdError
 * @description Error para cuando el id de la visita proporcionado no es válido (codigo 400).
 * @augments VisitError
 */
export class InvalidVisitIdError extends VisitError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=400] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "El id de la visita proporcionado no es válido",
    status = 400
  ) {
    super(message, status);
    this.name = "InvalidVisitIdError";
  }
}

/**
 * @class VisitExistsError
 * @description Error para cuando ya hay una visita activa con la misma identificación (código 409).
 * @augments VisitError
 */
export class VisitExistsError extends VisitError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=409] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "Una visita con la misma identificación ya está activa.",
    status = 409
  ) {
    super(message, status);
    this.name = "VisitExistsError";
  }
}

/**
 * @class AreaDontExistsError
 * @description Error para cuando el área seleccionada para una visita no existe (código 404).
 * @augments VisitError
 */
export class AreaDontExistsError extends VisitError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=404] - Código de estado HTTP por defecto.
   */
  constructor(message = "El área seleccionada no existe.", status = 404) {
    super(message, status);
    this.name = "AreaDontExistsError";
  }
}

/**
 * @class ActiveVisitDontExists
 * @description Error para cuando no existe una visita activa para el ID proporcionado (código 404).
 * @augments VisitError
 */
export class ActiveVisitDontExists extends VisitError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=404] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "No existe ninguna visita activa ahora mismo asociada a este ID.",
    status = 404
  ) {
    super(message, status);
    this.name = "ActiveVisitDontExists";
  }
}

/**
 * @class UpdateVisitError
 * @description Error para cuando falla la actualización del estado de una visita (ej. al terminarla) (código 500).
 * @augments VisitError
 */
export class UpdateVisitError extends VisitError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=500] - Código de estado HTTP por defecto.
   */
  constructor(message = "No se pudo terminar la visita.", status = 500) {
    super(message, status);
    this.name = "UpdateVisitError";
  }
}

/**
 * @class VisitIdInvalidError
 * @description Error para cuando el ID de visita proporcionado no es válido (código 400).
 * @augments VisitError
 */
export class VisitIdInvalidError extends VisitError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=400] - Código de estado HTTP por defecto.
   */
  constructor(message = "El ID proporcionado no es válido.", status = 400) {
    super(message, status);
    this.name = "VisitIdInvalidError";
  }
}

/**
 * @class ApiError
 * @description Clase base para errores de la API.
 * @augments Error
 */
export class ApiError extends Error {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=500] - Código de estado HTTP por defecto.
   */
  constructor(message, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * @class ApiFetchError
 * @description Error para cuando ocurre un fallo al obtener información de la API (código 500).
 * @augments ApiError
 */
export class ApiFetchError extends ApiError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   */
  constructor(message = "Ocurrió un error al obtener la información.") {
    super(message);
    this.name = "ApiFetchError";
  }
}

/**
 * @class ApiNoActiveVisitError
 * @description Error para cuando no hay visitas activas en la API (código 404).
 * @augments ApiError
 */
export class ApiNoActiveVisitError extends ApiError {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=404] - Código de estado HTTP por defecto.
   */
  constructor(message = "No hay visitas activas.", status = 404) {
    super(message, status);
    this.name = "ApiNoActiveVisitError";
  }
}

/**
 * @class NoValidUpdateDataError
 * @description Error para cuando una operación de actualización es llamada sin
 * datos válidos (código 400).
 * @augments Error
 */
export class NoValidUpdateDataError extends Error {
  /**
   * @param {string} [message] - Mensaje de error personalizado.
   * @param {number} [status=400] - Código de estado HTTP por defecto.
   */
  constructor(
    message = "No se proporcionaron datos válidos para actualizar el registro.",
    status = 400 // Se utiliza 'status' para consistencia con otras clases
  ) {
    super(message);
    this.name = "NoValidUpdateDataError";
    this.status = status; // Cambiado de 'statusCode' a 'status' para estandarización
  }
}
