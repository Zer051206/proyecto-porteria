import { verifyAccessToken, generateAccessToken } from "../utils/tokenUtils.js";
import * as userModel from "../models/userModel.js";
import * as refreshTokenModel from "../models/refreshTokenModel.js";

const authMiddleware = async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  let decoded = null;

  try {
    // Verificar el access token
    if (accessToken) {
      decoded = verifyAccessToken(accessToken);
    }
  } catch (tokenError) {
    // Si el access token es inválido o expiró, procedemos a intentar renovarlo.
    console.log(
      "Access token inválido, intentando renovar:",
      tokenError.message
    );

    if (refreshToken) {
      try {
        // Buscar el refresh token válido en la base de datos
        const tokenData = await refreshTokenModel.findValidRefreshToken(
          refreshToken
        );

        if (tokenData) {
          // Generar un nuevo access token
          const newAccessToken = generateAccessToken({
            id_usuario: tokenData.id_usuario,
            correo: tokenData.correo,
            rol: tokenData.rol,
          });

          // Establecer la nueva cookie
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/",
          });

          // Decodificar el nuevo token
          decoded = verifyAccessToken(newAccessToken);
        } else {
          // Si el refresh token no es válido, lanzar un error para que la sesión termine
          throw new Error("Refresh token inválido o expirado.");
        }
      } catch (refreshError) {
        // Capturar errores del proceso de renovación
        return res.status(401).json({
          message: "Sesión expirada. Por favor, inicia sesión nuevamente.",
          needsLogin: true,
        });
      }
    }
  }

  // Si después de ambos intentos (access y refresh) no tenemos un token decodificado
  if (!decoded) {
    return res.status(401).json({
      message: "Acceso no autorizado. Token no proporcionado o inválido.",
      needsLogin: true,
    });
  }

  try {
    // Verificar que el usuario está activo en la base de datos
    const isActive = await userModel.checkIfUserIsActive(decoded.id_usuario);
    if (!isActive) {
      const error = new Error("Acceso denegado. La cuenta no está activada");
      error.needsLogin = true;
      throw error;
    }

    // Si todo es correcto, adjuntar la información del usuario a la solicitud y continuar
    req.user = {
      userId: decoded.id_usuario,
      email: decoded.correo,
      rol: decoded.rol,
    };
    next();
  } catch (error) {
    // Capturar cualquier otro error y enviarlo al siguiente middleware de errores
    return next(error);
  }
};

export default authMiddleware;
