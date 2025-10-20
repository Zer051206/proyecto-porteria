/**
 * @file authController.js
 * @module authController
 * @description Controladores para todas las operaciones de autenticación: registro, login,
 * renovación de token (refresh), logout y manejo de callbacks de OAuth (Google/Microsoft).
 * Se encarga de la validación de datos (Zod) y la manipulación de cookies.
 */
import {
  registerSchema,
  loginSchema,
  oauthSchema,
} from "../schemas/authSchema.js";
import * as authService from "../services/authService.js";
import passport from "passport";

/**
 * @async
 * @function registerUser
 * @description Registra un nuevo usuario. Valida los datos con `registerSchema` y llama
 * al servicio de autenticación para crear el usuario.
 * @param {object} req - Objeto de solicitud de Express (contiene req.body).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 201 y el objeto del nuevo usuario.
 */
export const registerUser = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const newUser = await authService.registerUser(validatedData);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function loginUser
 * @description Inicia la sesión de un usuario. Valida credenciales, llama al servicio
 * de login y establece las cookies `accessToken` (15m) y `refreshToken` (7d).
 * @param {object} req - Objeto de solicitud de Express (contiene req.body).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200, mensaje de éxito y el objeto de usuario.
 */
export const loginUser = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);

      // Establecer Access Token (15 minutos)
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        path: "/",
      });

      // Establecer Refresh Token (7 días)
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function refreshToken
 * @description Renueva el Access Token utilizando el Refresh Token proporcionado en las cookies.
 * @param {object} req - Objeto de solicitud de Express (contiene req.cookies.refreshToken).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y establece una nueva cookie `accessToken`.
 */
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refreshAccessToken(refreshToken);

    // Establecer nuevo Access Token (15 minutos)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Token renovado exitosamente.",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function logoutUser
 * @description Cierra la sesión del usuario invalidando el Refresh Token en la base de datos
 * y eliminando las cookies `accessToken` y `refreshToken`.
 * @param {object} req - Objeto de solicitud de Express (contiene req.cookies.refreshToken).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y mensaje de logout exitoso.
 */
export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logoutUser(refreshToken);

    // Eliminar ambas cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({
      message: "logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function handleGoogleCallback
 * @description Controlador de callback para la autenticación de Google.
 * Recibe datos del usuario a través de Passport/req.user, los valida y establece las cookies de sesión.
 * @param {object} req - Objeto de solicitud de Express (contiene req.user tras la autenticación de Passport).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y las cookies de sesión.
 */
export const handleGoogleCallback = async (req, res, next) => {
  try {
    // req.user contiene el resultado de Passport/OAuth
    const oauthData = oauthSchema.parse(req.user);
    const result = await authService.handleOauthLogin(oauthData);

    // Establecer Access Token (15 minutos)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    // Establecer Refresh Token (7 días)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login OAuth exitoso",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function handleMicrosoftCallback
 * @description Controlador de callback para la autenticación de Microsoft.
 * Recibe datos del usuario a través de Passport/req.user, los valida y establece las cookies de sesión.
 * @param {object} req - Objeto de solicitud de Express (contiene req.user tras la autenticación de Passport).
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar errores al middleware global.
 * @returns {Promise<void>} Responde con un estado 200 y las cookies de sesión.
 */
export const handleMicrosoftCallback = async (req, res, next) => {
  try {
    // req.user contiene el resultado de Passport/OAuth
    const oauthData = oauthSchema.parse(req.user);
    const result = await authService.handleOauthLogin(oauthData);

    // Establecer Access Token (15 minutos)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    // Establecer Refresh Token (7 días)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login OAuth exitoso",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};
