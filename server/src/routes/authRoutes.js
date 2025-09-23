//src/routes/authRoutes.js
import { Router } from "express";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import * as authController from "../controllers/authController.js";
import { InvalidTokenError } from "../utils/customErrors.js";

/**
 * @file - // * This file contains the authentication routes.
 * @author M.M
 */

const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/refresh", authController.refreshToken);

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
