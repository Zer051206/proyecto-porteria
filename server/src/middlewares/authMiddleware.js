/**
 * @file authMiddleware.js
 * @module authMiddleware
 * @description Middleware de autenticación principal. Se encarga de verificar el Access Token,
 * y en caso de que este haya expirado, intenta usar el Refresh Token para generar uno nuevo
 * también verifica que el usuario asociado esté activo.
 */

import { verifyAccessToken, generateAccessToken } from "../utils/tokenUtils.js";
import * as userModel from "../repositories/userRepository.js";
import * as refreshTokenModel from "../repositories/refreshTokenRepository.js";
import {
  InvalidTokenError,
  AccountDisabledError,
} from "../utils/customErrors.js";

/**
 * @async
 * @function authMiddleware
 * @description Verifica la autenticación del usuario a través de cookies (Access Token y Refresh Token).
 * Si el Access Token expira, intenta renovarlo usando el Refresh Token.
 * Si la autenticación es exitosa, adjunta `req.user` con los datos del usuario.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Llama a `next()` si la autenticación es exitosa, o a `next(error)` si falla.
 * @throws {InvalidTokenError} Si no se encuentran tokens o si el Refresh Token es inválido/expirado.
 * @throws {AccountDisabledError} Si el usuario asociado al token no está activo.
 */
const authMiddleware = async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  let decoded = null;

  try {
    // Intenta verificar el access token
    if (accessToken) {
      decoded = verifyAccessToken(accessToken);
    } else {
      // Si no hay access token, intenta usar el refresh token
      if (!refreshToken) {
        throw new InvalidTokenError(
          "Acceso no autorizado. Token no proporcionado."
        );
      }

      /**
       * @const {object} tokenData - Datos del token de refresco obtenidos de la base de datos.
       */
      const tokenData = await refreshTokenModel.findValidRefreshToken(
        refreshToken
      );
      if (!tokenData) {
        throw new InvalidTokenError(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );
      }

      // Generar nuevo Access Token y establecer cookie
      const newAccessToken = generateAccessToken({
        id_usuario: tokenData.id_usuario,
        correo: tokenData.correo,
        rol: tokenData.rol,
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        path: "/",
      });

      decoded = verifyAccessToken(newAccessToken);
    }

    // Si el access token fue válido o renovado, verifica el estado del usuario.
    const user = await userModel.checkIfUserIsActive(decoded.userId);
    if (!user) {
      throw new AccountDisabledError(
        "Acceso denegado. La cuenta no está activada."
      );
    }

    // Si todo es correcto, adjunta la información del usuario a la solicitud.
    req.user = {
      userId: decoded.userId,
      email: decoded.correo,
      rol: decoded.rol,
    };
    next();
  } catch (error) {
    // Si cualquier error ocurre en el proceso, se lo pasamos al siguiente middleware de errores.
    next(error);
  }
};

export default authMiddleware;
