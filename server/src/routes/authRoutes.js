//src/routes/authRoutes.js
import { Router } from "express";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import * as authController from "../controllers/authController.js";
import rateLimit from "express-rate-limit";
import { InvalidTokenError } from "../utils/customErrors.js";

/**
 * @file - // * This file contains the authentication routes.
 * @author M.M
 */

const router = Router();

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

router.post("/register", loginLimiter, authController.registerUser);

router.post("/login", loginLimiter, authController.loginUser);

router.post("/refresh", loginLimiter, authController.refreshToken);

router.post("/logout", authController.logoutUser);

// La ruta /me lanza errores que serán capturados por el middleware global.
router.get("/me", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new InvalidTokenError("El token de refresco es requerido.");
  }

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

export default router;
