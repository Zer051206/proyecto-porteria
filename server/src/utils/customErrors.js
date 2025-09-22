/**
 * @class AuthError
 * @description Clase base para errores de autenticación.
 */
export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * @class UserAlreadyExistsError
 * @description Error para cuando el correo electrónico ya está registrado.
 */
export class UserAlreadyExistsError extends AuthError {
  constructor() {
    super("El correo electrónico ya está registrado.", 409);
    this.name = "UserAlreadyExistsError";
  }
}

/**
 * @class UserNotFoundOrInvalidPasswordError
 * @description Error para credenciales incorrectas.
 */
export class UserNotFoundOrInvalidPasswordError extends AuthError {
  constructor() {
    super("Credenciales incorrectas.", 401);
    this.name = "UserNotFoundOrInvalidPasswordError";
  }
}

/**
 * @class AccountDisabledError
 * @description Error para cuentas desactivadas.
 */
export class AccountDisabledError extends AuthError {
  constructor() {
    super("La cuenta está desactivada, contacte al administrador.", 403);
    this.name = "AccountDisabledError";
  }
}

/**
 * @class PackageError
 * @description Clase base para errores en los crud de los paquetes.
 */
export class PackageError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PackageError";
    this.status = status;
  }
}

/**
 * @class DuplicateGuideError
 * @description Error cuando ya existe un paquete con la misma guía.
 */
export class DuplicateGuideError extends PackageError {
  constructor() {
    super("Ya existe un paquete con la misma guia en este proceso.", 409);
    this.name = "DupllicateGuideError";
  }
}

/**
 * @class PackageCreateError
 * @description Error cuando falla el registro de un paquete.
 */
export class PackageCreateError extends PackageError {
  constructor() {
    super("No se pudo registrar el paquete", 500);
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

/**
 * @class VisitExistsError
 * @description Error cuando ya hay una visita activa con la misma identificación.
 */
export class VisitExistsError extends VisitError {
  constructor() {
    super("Una visita con la misma identificación ya está activa", 409);
    this.name = "VisitExistError";
  }
}

/**
 * @class AreaDontExistsError
 * @description Error cuando el área seleccionada para una visita no existe.
 */
export class AreaDontExistsError extends VisitError {
  constructor() {
    super("El área seleccionada no existe", 400);
    this.name = "AreaDontExistsError";
  }
}

/**
 * @class ActiveVisitDontExists
 * @description Error cuando no existe una visita activa para el ID proporcionado.
 */
export class ActiveVisitDontExists extends VisitError {
  constructor() {
    super(
      "No existe ninguna visita activa ahora mismo asociado a este id",
      404
    );
    this.name = "ActiveVisitDontExists";
  }
}

/**
 * @class UpdateVisitError
 * @description Error cuando falla la actualización del estado de una visita (ej. al terminarla).
 */
export class UpdateVisitError extends VisitError {
  constructor() {
    super("No se pudo terminar la visita", 500);
    this.name = "UpdateVisitError";
  }
}

/**
 * @class VisitIdInvalidError
 * @description Error cuando el ID de visita proporcionado no es válido.
 */
export class VisitIdInvalidError extends VisitError {
  constructor() {
    super("El id proporcionado no es válido", 400);
    this.name = "VisitIdInvalidError";
  }
}
