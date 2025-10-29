/**
 * @file customErrors.js
 * @module Utils/Errors
 * @description Define una jerarquía de clases de error personalizadas, todas heredando de una clase base AppError.
 * Esto estandariza el manejo de errores operacionales en toda la aplicación.
 */

/**
 * @class AppError
 * @description Clase base para todos los errores operacionales controlados de la aplicación.
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @constructor
   * @param {string} message - El mensaje de error legible.
   * @param {number} status - El código de estado HTTP asociado.
   */
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name; // Asegura que el nombre del error sea el de la clase hija
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- ERRORES DE AUTENTICACIÓN Y USUARIO ---

/**
 * @class UserNotFoundOrInvalidPasswordError
 * @description Error para credenciales incorrectas o si el usuario no existe.
 * @extends AppError
 */
export class UserNotFoundOrInvalidPasswordError extends AppError {
  constructor(
    message = "La cuenta no existe o las credenciales son incorrectas."
  ) {
    super(message, 401); // 401 Unauthorized es el estándar para logins fallidos.
  }
}

/**
 * @class UserAlreadyExistsError
 * @description Error para cuando se intenta registrar un usuario con un correo o ID que ya existe.
 * @extends AppError
 */
export class UserAlreadyExistsError extends AppError {
  constructor(
    message = "El correo electrónico o la identificación ya están registrados."
  ) {
    super(message, 409); // 409 Conflict
  }
}

/**
 * @class AccountDisabledError
 * @description Error para intentos de login a una cuenta que existe pero ha sido desactivada.
 * @extends AppError
 */
export class AccountDisabledError extends AppError {
  constructor(
    message = "La cuenta está desactivada, contacte al administrador."
  ) {
    super(message, 403); // 403 Forbidden
  }
}

// --- ERRORES DE TOKEN Y AUTORIZACIÓN ---

/**
 * @class InvalidTokenError
 * @description Error para tokens JWT inválidos, malformados o no proporcionados.
 * @extends AppError
 */
export class InvalidTokenError extends AppError {
  constructor(message = "El token proporcionado es inválido o no existe.") {
    super(message, 401);
  }
}

/**
 * @class MissingApiKeyError
 * @description Error específico para cuando no se proporciona la API Key requerida en las cabeceras.
 * @extends AppError
 */
export class MissingApiKeyError extends AppError {
  constructor(
    message = "Falta la API Key requerida en la cabecera X-API-Key o Authorization: ApiKey."
  ) {
    super(message, 401); // 401 Unauthorized es apropiado para credenciales faltantes.
  }
}

/**
 * @class ForbiddenError
 * @description Error para cuando un usuario autenticado no tiene los permisos necesarios.
 * @extends AppError
 */
export class ForbiddenError extends AppError {
  constructor(message = "Acceso denegado. No tienes los permisos necesarios.") {
    super(message, 403);
  }
}

// --- ERRORES DE LÓGICA DE NEGOCIO (VISITAS Y PAQUETES) ---

/**
 * @class DuplicateError
 * @description Error para cuando hay se intenta crear algun recurso con un ID ya usado.
 * @extends AppError
 */
export class DuplicateError extends AppError {
  constructor(message = "Ya existe un recurso con el mismo identificador.") {
    super(message, 409);
  }
}

/**
 * @class ActiveVisitDontExistsError
 * @description Error para cuando no se encuentra una visita activa para finalizar.
 * @extends AppError
 */
export class ActiveVisitDontExistsError extends AppError {
  constructor(message = "No existe ninguna visita activa asociada a este ID.") {
    super(message, 404);
  }
}

// --- ERRORES GENÉRICOS DE SOLICITUD Y DATOS ---

/**
 * @class NotFoundError
 * @description Error genérico para cuando un recurso solicitado no se encuentra.
 * @extends AppError
 */
export class NotFoundError extends AppError {
  constructor(message = "El recurso solicitado no fue encontrado.") {
    super(message, 404);
  }
}

/**
 * @class BadRequestError
 * @description Error para datos de solicitud malformados o faltantes.
 * @extends AppError
 */
export class BadRequestError extends AppError {
  constructor(
    message = "Los datos proporcionados son inválidos o están incompletos."
  ) {
    super(message, 400);
  }
}

/**
 * @class InvalidIdError
 * @description Error específico para indicar que un ID proporcionado en la solicitud
 * @extends AppError
 */
export class InvalidIdError extends AppError {
  constructor(message = "El ID proporcionado no es válido.") {
    super(message, 400);
  }
}

/**
 * @class ConflictError
 * @description Error para indicar que una solicitud no pudo ser procesada debido a un conflicto
 * con el estado actual del recurso (ej. recurso ya existe, estado inválido para la acción).
 * @extends AppError
 */
export class ConflictError extends AppError {
  constructor(
    message = "La solicitud entra en conflicto con el estado actual del recurso."
  ) {
    super(message, 409);
  }
}
