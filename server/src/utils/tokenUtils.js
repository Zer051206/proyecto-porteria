/**
 * @file tokenUtils.js
 * @module Utils
 * @description Colección de funciones de utilidad para la generación, verificación y gestión de JSON Web Tokens (JWT).
 * Este módulo se integra con la configuración centralizada en `jwt.config.js` para asegurar consistencia y seguridad.
 * @requires jsonwebtoken
 * @requires crypto
 * @requires ../config/jwt.config.js
 */

import jwt from "jsonwebtoken";
import crypto from "crypto";
import jwtConfig from "../config/jwt.config.js";

/**
 * @function generateAccessToken
 * @description Genera un Access Token (JWT) para un usuario.
 * @param {object} userPayload - Objeto con los datos del usuario para incluir en el payload del token.
 * @returns {string} El Access Token firmado y con tiempo de expiración.
 */
export const generateAccessToken = (userPayload) => {
  // Se utilizan el secreto y el tiempo de expiración definidos en la configuración central.
  return jwt.sign(userPayload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  });
};

/**
 * @function verifyAccessToken
 * @description Verifica la validez de un Access Token.
 * @param {string} token - El Access Token JWT a verificar.
 * @returns {object} La carga útil (payload) decodificada del token si es válido.
 * @throws {JsonWebTokenError|TokenExpiredError} Si el token es inválido o ha expirado.
 */
export const verifyAccessToken = (token) => {
  // jwt.verify ya lanza errores específicos (JsonWebTokenError, TokenExpiredError)
  // que serán capturados por nuestro errorMiddleware, por lo que no es necesario un try/catch aquí.
  return jwt.verify(token, jwtConfig.accessSecret);
};

/**
 * @function generateRefreshToken
 * @description Genera un Refresh Token criptográficamente seguro.
 * @returns {string} Una cadena hexadecimal aleatoria de 64 bytes.
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * @function getRefreshTokenExpiration
 * @description Calcula la fecha de expiración para un nuevo Refresh Token.
 * @returns {Date} Un objeto Date que representa la fecha y hora de expiración.
 */
export const getRefreshTokenExpiration = () => {
  const expiration = new Date();
  // Se utiliza el número de días definido en la configuración central.
  expiration.setDate(expiration.getDate() + jwtConfig.refreshExpiresIn);
  return expiration;
};
