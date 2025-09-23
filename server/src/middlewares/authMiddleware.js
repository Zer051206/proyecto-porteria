import { verifyAccessToken, generateAccessToken } from "../utils/tokenUtils.js";
import * as userModel from "../models/userModel.js";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import {
  InvalidTokenError,
  AccountDisabledError,
} from "../utils/customErrors.js";

/**
 * @file: Middleware de autenticación de usuarios.
 * @author M.M
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

      const tokenData = await refreshTokenModel.findValidRefreshToken(
        refreshToken
      );
      if (!tokenData) {
        throw new InvalidTokenError(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );
      }

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
