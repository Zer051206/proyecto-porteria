/**
 * @file authRoutes.js
 * @module authRoutes
 * @description Define todas las rutas relacionadas con la autenticación de usuarios (registro, login,
 * refresh de tokens, logout) y la verificación de sesión (`/me`). Aplica límites de tasa (rate limiting)
 * a las rutas sensibles a ataques de fuerza bruta.
 */
import { Router } from "express";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import * as authController from "../controllers/authController.js";
import rateLimit from "express-rate-limit";
import { InvalidTokenError } from "../utils/customErrors.js";

const router = Router();

/**
 * @const {Function} loginLimiter
 * @description Middleware de Rate Limiting que limita el número de peticiones
 * (máximo 10 intentos fallidos en 15 minutos) a las rutas de autenticación
 * sensibles (register, login, refresh).
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo de 10 intentos fallidos por IP
  message: {
    success: false,
    message: "Demasiados intentos. Por favor, intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route POST /auth/register
 * @description Registra un nuevo usuario en el sistema. Protegido contra ataques de fuerza bruta.
 * @access Public
 * @middleware loginLimiter - Límite de tasa para prevenir ataques de fuerza bruta.
 * @handler authController.registerUser
 */
router.post("/register", loginLimiter, authController.registerUser);

/**
 * @route POST /auth/login
 * @description Permite a un usuario iniciar sesión, emitiendo un Access Token y un Refresh Token (en cookie).
 * @access Public
 * @middleware loginLimiter - Límite de tasa para prevenir ataques de fuerza bruta.
 * @handler authController.loginUser
 */
router.post("/login", loginLimiter, authController.loginUser);

/**
 * @route POST /auth/refresh
 * @description Utiliza el Refresh Token (en cookie) para emitir un nuevo Access Token.
 * @access Public
 * @middleware loginLimiter - Límite de tasa para prevenir ataques de fuerza bruta.
 * @handler authController.refreshToken
 */
router.post("/refresh", loginLimiter, authController.refreshToken);

/**
 * @route POST /auth/logout
 * @description Cierra la sesión del usuario eliminando el Refresh Token de la base de datos y la cookie.
 * @access Public
 * @handler authController.logoutUser
 */
router.post("/logout", authController.logoutUser);

/**
 * @route GET /auth/me
 * @description Verifica el estado de autenticación del usuario usando el Refresh Token en las cookies.
 * Si es válido, devuelve la información básica del usuario.
 * @access Private/Protected
 * @middleware Maneja la verificación de token y base de datos directamente en la ruta.
 * @throws {InvalidTokenError} Si el Refresh Token no existe o es inválido/expirado.
 */
router.get("/me", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new InvalidTokenError("El token de refresco es requerido.");
  }

  /**
   * @description Busca el token de refresco en la base de datos para verificar su validez y obtener datos del usuario.
   * @type {object | null}
   */
  const tokenData = await refreshTokenModel.findValidRefreshToken(refreshToken);

  if (!tokenData) {
    throw new InvalidTokenError("Sesión expirada o token inválido.");
  }

  res.json({
    authenticated: true,
    user: {
      id: tokenData.id_usuario,
      correo: tokenData.correo,
      rol: tokenData.rol,
    },
  });
});

/**
 * @description Exporta el enrutador de Express configurado con las rutas de autenticación.
 * @type {Router}
 */
export default router;
