/**
 * @class AuthError
 * @description Clase base para errores de autenticación (código 401).
 */
export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export class AuthenticationError extends AuthError {
  constructor(
    message = "Acceso no autorizado. Por favor, inicia sesión con tu cuenta."
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ExpiredTokenError extends AuthError {
  constructor(
    message = "Sesión expirada. Por favor, vuelve a iniciar sesión para continuar."
  ) {
    super(message);
    this.name = "ExpiredTokenError";
  }
}

export class InvalidTokenError extends AuthError {
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
 */
export class ForbiddenError extends Error {
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
 */
export class UserAlreadyExistsError extends AuthError {
  constructor(
    message = "El correo electrónico ya está registrado.",
    status = 409
  ) {
    super(message);
    this.name = "UserAlreadyExistsError";
    this.status = status;
  }
}

/**
 * @class UserNotFoundOrInvalidPasswordError
 * @description Error para credenciales incorrectas (código 401).
 */
export class UserNotFoundOrInvalidPasswordError extends AuthError {
  constructor(
    message = "La cuenta no existe o las credenciales son incorrectas."
  ) {
    super(message);
    this.name = "UserNotFoundOrInvalidPasswordError";
  }
}

/**
 * @class AccountDisabledError
 * @description Error para cuentas desactivadas (código 401).
 */
export class AccountDisabledError extends AuthError {
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
 */
export class DatabaseConnectionError extends Error {
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
 */
export class PackageError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PackageError";
    this.status = status;
  }
}

export class InvalidPackageIdError extends PackageError {
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
 * @description Error cuando ya existe un paquete con la misma guía (código 409).
 */
export class DuplicateGuideError extends PackageError {
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
 */
export class PackageCreateError extends PackageError {
  constructor(message = "No se pudo registrar el paquete.", status = 500) {
    super(message, status);
    this.name = "PackageCreateError";
  }
}

/**
 * @class VisitError
 * @description Clase base para errores de gestión de visitas.
 */
export class VisitError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "VisitError";
    this.status = status;
  }
}

export class SignatureDontExistsError extends VisitError {
  constructor(message = "La firma del visitante es obligatoria", status = 404) {
    super(message, status);
    this.name = "SignatureDontExistsError";
  }
}

export class invalidVisitIdError extends VisitError {
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
 * @description Error cuando ya hay una visita activa con la misma identificación (código 409).
 */
export class VisitExistsError extends VisitError {
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
 * @description Error cuando el área seleccionada para una visita no existe (código 404).
 */
export class AreaDontExistsError extends VisitError {
  constructor(message = "El área seleccionada no existe.", status = 404) {
    super(message, status);
    this.name = "AreaDontExistsError";
  }
}

/**
 * @class ActiveVisitDontExists
 * @description Error cuando no existe una visita activa para el ID proporcionado (código 404).
 */
export class ActiveVisitDontExists extends VisitError {
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
 * @description Error cuando falla la actualización del estado de una visita (ej. al terminarla) (código 500).
 */
export class UpdateVisitError extends VisitError {
  constructor(message = "No se pudo terminar la visita.", status = 500) {
    super(message, status);
    this.name = "UpdateVisitError";
  }
}

/**
 * @class VisitIdInvalidError
 * @description Error cuando el ID de visita proporcionado no es válido (código 400).
 */
export class VisitIdInvalidError extends VisitError {
  constructor(message = "El ID proporcionado no es válido.", status = 400) {
    super(message, status);
    this.name = "VisitIdInvalidError";
  }
}

/**
 * @class ApiError
 * @description Clase base para errores de la API.
 */
export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * @class ApiFetchError
 * @description Error cuando ocurre un fallo al obtener información de la API (código 500).
 */
export class ApiFetchError extends ApiError {
  constructor(message = "Ocurrió un error al obtener la información.") {
    super(message);
    this.name = "ApiFetchError";
  }
}

/**
 * @class ApiNoActiveVisitError
 * @description Error cuando no hay visitas activas en la API (código 404).
 */
export class ApiNoActiveVisitError extends ApiError {
  constructor(message = "No hay visitas activas.", status = 404) {
    super(message, status);
    this.name = "ApiNoActiveVisitError";
  }
}
