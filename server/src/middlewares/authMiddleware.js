/**
 * @file authMiddleware.js
 * @module Middlewares
 * @description Middleware de autenticación principal que protege las rutas de la API.
 * @requires ../utils/tokenUtils.js
 * @requires ../repositories/userRepository.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */

import { verifyAccessToken } from "../utils/tokenUtils.js";
import * as userRepository from "../repositories/userRepository.js";
import {
  InvalidTokenError,
  AccountDisabledError,
} from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function authMiddleware
 * @description Verifica el token de acceso (JWT) proporcionado en la cabecera 'Authorization'.
 * Si el token es válido y el usuario asociado está activo, adjunta los datos del usuario a `req.user`.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void}
 * @throws {InvalidTokenError} Si la cabecera de autorización falta o el token es inválido.
 * @throws {AccountDisabledError} Si la cuenta del usuario no existe o está inactiva.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new InvalidTokenError(
        "Acceso no autorizado. Token no proporcionado."
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Buscamos el usuario en la base de datos para asegurar que existe y está activo.
    const user = await userRepository.findById(decoded.id_usuario);

    if (!user || !user.activo) {
      logger.warn(
        { userId: decoded.id_usuario },
        "Intento de acceso con cuenta inválida o inactiva."
      );
      throw new AccountDisabledError();
    }

    // Adjuntamos la información del usuario a la petición para su uso en los controladores.
    req.user = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
