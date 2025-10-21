/**
 * @file authController.js
 * @module Controllers
 * @description Controlador para las operaciones de autenticación.
 * Maneja el registro, login, renovación y cierre de sesión, devolviendo tokens en el
 * cuerpo de la respuesta JSON para ser gestionados por el cliente (SPA).
 * @requires ../schemas/authSchema.js
 * @requires ../services/authService.js
 * @requires ../config/logger.js
 */

import {
  registerSchema,
  loginSchema,
  oauthSchema,
} from "../schemas/authSchema.js";
import * as authService from "../services/authService.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function registerUser
 * @description Registra un nuevo usuario.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar errores al middleware global.
 */
export const registerUser = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    logger.info(
      { email: validatedData.correo },
      "Intento de registro de nuevo usuario."
    );
    const newUser = await authService.registerUser(validatedData);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function loginUser
 * @description Inicia la sesión de un usuario y devuelve los tokens en el cuerpo de la respuesta.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar errores al middleware global.
 */
export const loginUser = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);

    // Devuelve los tokens y los datos del usuario en el cuerpo de la respuesta JSON.
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function refreshToken
 * @description Renueva el Access Token utilizando un Refresh Token del body.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar errores al middleware global.
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    logger.info("Intento de renovación de token de acceso.");

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Token renovado exitosamente.",
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function logoutUser
 * @description Cierra la sesión del usuario invalidando el Refresh Token.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar errores al middleware global.
 */
export const logoutUser = async (req, res, next) => {
  try {
    // También leemos el refreshToken desde las cookies para el logout.
    const { refreshToken } = req.cookies;
    await authService.logoutUser(refreshToken);

    // Limpiamos la cookie del navegador.
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function handleGoogleCallback
 * @description Controlador de callback para la autenticación de Google.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar errores al middleware global.
 */
export const handleGoogleCallback = async (req, res, next) => {
  try {
    const oauthData = oauthSchema.parse(req.user);
    const result = await authService.handleOauthLogin(oauthData);

    res.status(200).json({
      message: "Login OAuth exitoso",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function handleMicrosoftCallback
 * @description Controlador de callback para la autenticación de Microsoft.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar errores al middleware global.
 */
export const handleMicrosoftCallback = async (req, res, next) => {
  try {
    const oauthData = oauthSchema.parse(req.user);
    const result = await authService.handleOauthLogin(oauthData);

    res.status(200).json({
      message: "Login OAuth exitoso",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function getMe
 * @description Endpoint protegido que devuelve la información del usuario actualmente autenticado.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getMe = (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
};
