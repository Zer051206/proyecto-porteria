// src/utils/customErrors.js

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
 * @class packageError
 * @description Clase base para errores en los crud de los paquetes
 */
export class PackageError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PackageError";
    this.status = status;
  }
}

export class DuplicateGuideError extends PackageError {
  constructor() {
    super("Ya existe un paquete con la misma guia en este proceso.", 409);
    this.name = "DupllicateGuideError";
  }
}

export class PackageCreateError extends PackageError {
  constructor() {
    super("No se pudo registrar el paquete", 500);
    this.name = "PackageCreateError";
  }
}

export class VisitError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "VisitError";
    this.status = status;
  }
}

export class VisitExistsError extends VisitError {
  constructor() {
    super("Una visita con la misma identificación ya está activa", 409);
    this.name = "VisitExistError";
  }
}

export class AreaDontExistsError extends VisitError {
  constructor() {
    super("El área seleccionada no existe", 400);
    this.name = "AreaDontExistsError";
  }
}

export class ActiveVisitDontExists extends VisitError {
  constructor() {
    super(
      "No existe ninguna visita activa ahora mismo asociado a este id",
      404
    );
    this.name = "ActiveVisitDontExists";
  }
}

export class UpdateVisitError extends VisitError {
  constructor() {
    super("No se pudo terminar la visita", 500);
    this.name = "UpdateVisitError";
  }
}

export class VisitIdInvalidError extends VisitError {
  constructor() {
    super("El id proporcionado no es válido", 400);
    this.name = "VisitIdInvalidError";
  }
}
