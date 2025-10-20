/**
 * @file authService.js
 * @module Services
 * @description Capa de servicio para la gestión de la autenticación de usuarios.
 * Contiene la lógica de negocio para registro, login, manejo de tokens y autenticación OAuth.
 * @requires bcrypt
 * @requires ../repositories/userRepository.js
 * @requires ../repositories/refreshTokenRepository.js
 * @requires ../utils/tokenUtils.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */

import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository.js";
import * as refreshTokenRepository from "../repositories/refreshTokenRepository.js";
import * as tokenUtils from "../utils/tokenUtils.js";
import {
  UserAlreadyExistsError,
  UserNotFoundOrInvalidPasswordError,
  AccountDisabledError,
  InvalidTokenError,
} from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @private
 * @async
 * @function _generateAndSaveTokens
 * @description Función auxiliar interna para generar y guardar el par de tokens (acceso y refresco).
 * @param {object} user - El objeto del usuario para el cual se generarán los tokens.
 * @returns {Promise<{accessToken: string, refreshToken: string, userPayload: object}>}
 */
const _generateAndSaveTokens = async (user) => {
  const userPayload = {
    id_usuario: user.id_usuario,
    correo: user.correo,
    rol: user.rol,
  };

  const accessToken = tokenUtils.generateAccessToken(userPayload);
  const refreshToken = tokenUtils.generateRefreshToken();
  const refreshTokenExpires = tokenUtils.getRefreshTokenExpiration();

  await refreshTokenRepository.create({
    id_usuario: user.id_usuario,
    token: refreshToken,
    expira_en: refreshTokenExpires,
  });

  await userRepository.updateLastLogin(user.id_usuario);

  return { accessToken, refreshToken, userPayload };
};

/**
 * @async
 * @function registerUser
 * @description Registra un nuevo usuario en el sistema.
 * @param {object} validatedData - Datos validados del usuario.
 * @returns {Promise<object>} Información del usuario creado.
 * @throws {UserAlreadyExistsError} Si el correo ya está registrado.
 */
export const registerUser = async (validatedData) => {
  const { correo, password, ...restOfData } = validatedData;

  const existingUser = await userRepository.findByEmail(correo);
  if (existingUser) {
    logger.warn({ email: correo }, "Intento de registro con correo duplicado.");
    throw new UserAlreadyExistsError();
  }

  const contrasena_hash = await bcrypt.hash(password, 10);
  const userForDB = { ...restOfData, correo, contrasena_hash, rol: "portero" }; // rol por defecto

  const userCreated = await userRepository.create(userForDB);

  logger.info(
    { userId: userCreated.id_usuario, email: correo },
    "Nuevo usuario registrado exitosamente."
  );

  const { contrasena_hash: _, ...safeUser } = userCreated.dataValues;
  return safeUser;
};

/**
 * @async
 * @function loginUser
 * @description Autentica a un usuario y genera sus tokens de sesión.
 * @param {object} validatedData - Datos de login validados (correo y password).
 * @returns {Promise<object>} Objeto con los tokens y los datos del usuario.
 * @throws {UserNotFoundOrInvalidPasswordError|AccountDisabledError}
 */
export const loginUser = async (validatedData) => {
  const { correo, password } = validatedData;
  const userDb = await userRepository.findByEmail(correo);

  if (!userDb || !userDb.contrasena_hash) {
    logger.warn(
      { email: correo },
      "Intento de login fallido: usuario no encontrado o sin contraseña."
    );
    throw new UserNotFoundOrInvalidPasswordError();
  }

  if (!userDb.activo) {
    logger.warn(
      { email: correo, userId: userDb.id_usuario },
      "Intento de login fallido: cuenta inactiva."
    );
    throw new AccountDisabledError();
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    userDb.contrasena_hash
  );
  if (!isPasswordCorrect) {
    logger.warn(
      { email: correo, userId: userDb.id_usuario },
      "Intento de login fallido: contraseña incorrecta."
    );
    throw new UserNotFoundOrInvalidPasswordError();
  }

  logger.info(
    { userId: userDb.id_usuario, email: correo },
    "Inicio de sesión exitoso."
  );

  const { accessToken, refreshToken, userPayload } =
    await _generateAndSaveTokens(userDb);

  return { accessToken, refreshToken, user: userPayload };
};

/**
 * @async
 * @function refreshAccessToken
 * @description Renueva un accessToken utilizando un refreshToken válido.
 * @param {string} refreshToken - El token de refresco.
 * @returns {Promise<object>} Objeto con el nuevo accessToken y los datos del usuario.
 * @throws {InvalidTokenError} Si el refreshToken es inválido.
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken)
    throw new InvalidTokenError("El refresh token es requerido.");

  const userData = await refreshTokenRepository.findValidToken(refreshToken);
  if (!userData)
    throw new InvalidTokenError("Refresh token inválido o expirado.");

  logger.info(
    { userId: userData.id_usuario },
    "Token de acceso renovado exitosamente."
  );

  const newAccessToken = tokenUtils.generateAccessToken(userData);
  return { accessToken: newAccessToken, user: userData };
};

/**
 * @async
 * @function logoutUser
 * @description Cierra la sesión de un usuario revocando su refreshToken.
 * @param {string} refreshToken - El token de refresco a invalidar.
 * @returns {Promise<object>}
 */
export const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await refreshTokenRepository.revokeToken(refreshToken);
    logger.info("Refresh token revocado durante el logout.");
  }
  return { message: "Logout exitoso" };
};

/**
 * @async
 * @function handleOauthLogin
 * @description Maneja el flujo de login/registro para proveedores OAuth.
 * @param {object} oauthData - Datos del perfil obtenidos del proveedor OAuth.
 * @returns {Promise<object>} Objeto con los tokens y los datos del usuario.
 * @throws {UserAlreadyExistsError} Si el correo ya está vinculado a otro proveedor OAuth.
 */
export const handleOauthLogin = async (oauthData) => {
  const { nombre, apellido, correo, id_oauth, proveedor_oauth } = oauthData;
  let userDb = await userRepository.findByEmail(correo);

  if (!userDb) {
    logger.info(
      { email: correo, provider: proveedor_oauth },
      "Creando nuevo usuario vía OAuth."
    );
    userDb = await userRepository.create({
      nombre,
      apellido,
      correo,
      id_oauth,
      proveedor_oauth,
      rol: "portero",
      activo: true, // Los usuarios OAuth se activan por defecto
    });
  } else if (!userDb.id_oauth) {
    logger.info(
      { email: correo, provider: proveedor_oauth },
      "Vinculando cuenta existente a proveedor OAuth."
    );
    userDb = await userRepository.update(userDb.id_usuario, {
      id_oauth,
      proveedor_oauth,
    });
  } else if (userDb.id_oauth !== id_oauth) {
    logger.warn(
      {
        email: correo,
        provider: proveedor_oauth,
        existingProvider: userDb.proveedor_oauth,
      },
      "Conflicto de proveedores OAuth."
    );
    throw new UserAlreadyExistsError(
      "Esta cuenta de correo ya está vinculada a otro proveedor de inicio de sesión."
    );
  }

  logger.info(
    { userId: userDb.id_usuario, email: correo, provider: proveedor_oauth },
    "Inicio de sesión OAuth exitoso."
  );

  const { accessToken, refreshToken, userPayload } =
    await _generateAndSaveTokens(userDb);

  return { accessToken, refreshToken, user: userPayload };
};
