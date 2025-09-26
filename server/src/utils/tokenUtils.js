/**
 * @file tokenUtils.js
 * @module tokenUtils
 * @description Colección de funciones de utilidad para la generación, verificación y gestión de la expiración de Access Tokens (JWT) y Refresh Tokens.
 */
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * @function generateAccessToken
 * @description Esta funcion se encarga generar un accesstoken para el usuario.
 * @param {Object} user - Objeto del usuario que contiene la información para el payload del token.
 * @param {number} user.id_usuario - ID único del usuario.
 * @param {string} user.correo - Correo electrónico del usuario.
 * @param {string} user.rol - Rol o perfil del usuario.
 * @returns {string} AccessToken firmado con expiración de 15 minutos.
 */
export const generateAccessToken = (user) => {
  const payload = {
    userId: user.id_usuario,
    correo: user.correo,
    rol: user.rol,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * @function generateRefreshToken
 * @description Esta funcion se encarga de generar un refreshtoken para el usuario.
 * @returns {string} RefreshToken generado como una cadena hexadecimal aleatoria de 64 bytes.
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * @function verifyAccessToken
 * @description Esta funcion se encarga de verificar que el token del usuario es válido.
 * @param {string} token - El token de acceso JWT a verificar.
 * @returns {object} Decoded payload - La carga útil (payload) decodificada del token si es válido.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Token de acceso inválido o expirado");
  }
};

/**
 * @function getRefreshTokenExpiration
 * @description Esta funcion se encarga de generar una expiracion de 7 dias al refreshtoken.
 * @returns {Date} Plazo de expiracion - Un objeto Date que representa la fecha y hora de expiración (+7 días a partir de ahora).
 */
export const getRefreshTokenExpiration = () => {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);
  return expiration;
};
