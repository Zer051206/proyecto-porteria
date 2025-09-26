/**
 * @file authService.js
 * @module authService
 * @description Capa de servicio para la gestión de la autenticación de usuarios:
 * registro, login con contraseña, manejo de tokens (refresh/logout) y autenticación OAuth.
 * Contiene la lógica de negocio para la verificación de credenciales, hashing de contraseñas
 * y gestión de tokens de acceso y refresh.
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as tokenUtils from "../utils/tokenUtils.js";
import * as userModel from "../models/userModel.js";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import {
  UserAlreadyExistsError,
  UserNotFoundOrInvalidPasswordError,
  AccountDisabledError,
  InvalidTokenError,
} from "../utils/customErrors.js";

/**
 * @async
 * @function registerUser
 * @description Verifica si un usuario con el correo electrónico proporcionado ya existe.
 * Si no existe, hashea la contraseña y crea un nuevo usuario.
 * @param {object} validatedData - Objeto con los datos validados del usuario (nombre, apellido, correo, password).
 * @returns {Promise<object>} Promesa que resuelve con la información básica del usuario creado.
 * @throws {UserAlreadyExistsError} Si ya existe un usuario con ese correo electrónico.
 */
export const registerUser = async (validatedData) => {
  try {
    const { nombre, apellido, correo, password } = validatedData;
    const userDb = await userModel.findByEmail(correo);

    if (userDb) {
      throw new UserAlreadyExistsError();
    }

    const contrasena_hash = await bcrypt.hash(password, 10);
    const userForDB = {
      nombre,
      apellido,
      correo,
      contrasena_hash: contrasena_hash,
    };

    const userCreated = await userModel.createUser(userForDB);
    return {
      message: "Usuario registrado exitosamente",
      usuario: {
        id: userCreated.id_usuario,
        nombre: userCreated.nombre,
        apellido: userCreated.apellido,
        correo: userCreated.correo,
        rol: userCreated.rol,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function loginUser
 * @description Realiza el login de un usuario con correo/contraseña.
 * Verifica la existencia del usuario, el estado de la cuenta, y la coincidencia de la contraseña.
 * Genera y guarda el par de Access Token y Refresh Token.
 * @param {object} validatedData - Objeto con los datos validados del usuario (correo, password).
 * @returns {Promise<object>} Promesa que resuelve con el Access Token, Refresh Token y los datos del usuario.
 * @throws {UserNotFoundOrInvalidPasswordError} Si el usuario no existe, no tiene contraseña o la contraseña es incorrecta.
 * @throws {AccountDisabledError} Si la cuenta del usuario no está activa.
 */
export const loginUser = async (validatedData) => {
  try {
    const { correo, password } = validatedData;

    const userDb = await userModel.findByEmail(correo);

    if (!userDb || !userDb.contrasena_hash) {
      // Unificamos el error para no dar pistas sobre la existencia del usuario
      throw new UserNotFoundOrInvalidPasswordError();
    }

    if (!userDb.activo) {
      throw new AccountDisabledError();
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userDb.contrasena_hash
    );
    if (!isPasswordCorrect) {
      throw new UserNotFoundOrInvalidPasswordError();
    }

    // Generación y guardado de tokens
    const accessToken = tokenUtils.generateAccessToken(userDb);
    const refreshToken = tokenUtils.generateRefreshToken();
    const refreshTokenExpires = tokenUtils.getRefreshTokenExpiration();

    await refreshTokenModel.saveRefreshToken(
      userDb.id_usuario,
      refreshToken,
      refreshTokenExpires
    );

    await userModel.updateLastLogin(userDb.id_usuario);

    return {
      accessToken,
      refreshToken,
      user: {
        id: userDb.id_usuario,
        nombre: userDb.nombre,
        apellido: userDb.apellido,
        correo: userDb.correo,
        rol: userDb.rol,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function refreshAccessToken
 * @description Renueva el Access Token utilizando un Refresh Token válido.
 * @param {string} refreshToken - El token de refresco enviado por el cliente.
 * @returns {Promise<object>} Promesa que resuelve con el nuevo Access Token y datos básicos del usuario.
 * @throws {InvalidTokenError} Si el refresh token es nulo, inválido o ha expirado.
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new InvalidTokenError("El refresh token es requerido.");
    }

    const tokenData = await refreshTokenModel.findValidRefreshToken(
      refreshToken
    );

    if (!tokenData) {
      // Importante: No se elimina el refresh token de la base de datos aquí. Se asume que el token
      // ya no existe (expirado, revocado, o nunca existió), por lo que simplemente se rechaza.
      throw new InvalidTokenError("Refresh token inválido o expirado.");
    }

    const newAccessToken = tokenUtils.generateAccessToken({
      id_usuario: tokenData.id_usuario,
      correo: tokenData.correo,
      rol: tokenData.rol,
    });

    return {
      accessToken: newAccessToken,
      user: {
        id: tokenData.id_usuario,
        correo: tokenData.correo,
        rol: tokenData.rol,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function logoutUser
 * @description Revoca (elimina) el Refresh Token de la base de datos, cerrando la sesión de manera efectiva.
 * @param {string} refreshToken - El token de refresco a revocar.
 * @returns {Promise<object>} Promesa que resuelve con un mensaje de éxito.
 */
export const logoutUser = async (refreshToken) => {
  try {
    if (refreshToken) {
      await refreshTokenModel.revokeRefreshToken(refreshToken);
    }
    return { message: "Logout exitoso" };
  } catch (error) {
    throw error;
  }
};

/**
 * @async
 * @function handleOauthLogin
 * @description Maneja el proceso de inicio de sesión/registro a través de OAuth (Google/Microsoft).
 * Crea el usuario si no existe, vincula la cuenta si el correo existe, y genera el par de tokens de sesión.
 * @param {object} oauthData - Objeto con los datos validados del proveedor OAuth.
 * @returns {Promise<object>} Promesa que resuelve con el Access Token, Refresh Token y los datos del usuario.
 * @throws {UserAlreadyExistsError} Si la cuenta está vinculada a un proveedor diferente.
 */
export const handleOauthLogin = async (oauthData) => {
  try {
    const { nombre, apellido, correo, id_oauth, proveedor_oauth } = oauthData;

    let userDb = await userModel.findByEmail(correo);

    if (!userDb) {
      // 1. USUARIO NUEVO: Se crea el usuario con los datos de OAuth.
      userDb = await userModel.createUser({
        nombre,
        apellido,
        correo,
        id_oauth,
        proveedor_oauth,
      });
    } else if (!userDb.id_oauth) {
      // 2. USUARIO EXISTENTE SIN VINCULACIÓN: Se vincula la cuenta de la DB existente al proveedor OAuth.
      const updateData = {
        id_oauth: id_oauth,
        proveedor_oauth: proveedor_oauth,
      };
      userDb = await userModel.updateUser(userDb.id_usuario, updateData);
    } else if (userDb.id_oauth !== id_oauth) {
      // 3. VALIDACIÓN DE CONFLICTO: Si la cuenta está vinculada a otro proveedor (ID diferente).
      throw new UserAlreadyExistsError("Cuenta vinculada a otro proveedor.");
    }

    // 4. GENERACIÓN DE TOKENS (Flujo unificado para login/registro/vinculación)
    const accessToken = tokenUtils.generateAccessToken(userDb);
    const refreshToken = tokenUtils.generateRefreshToken();
    const refreshTokenExpires = tokenUtils.getRefreshTokenExpiration();

    await refreshTokenModel.saveRefreshToken(
      userDb.id_usuario,
      refreshToken,
      refreshTokenExpires
    );

    await userModel.updateLastLogin(userDb.id_usuario);

    return {
      accessToken,
      refreshToken,
      user: {
        id: userDb.id_usuario,
        nombre: userDb.nombre,
        apellido: userDb.apellido,
        correo: userDb.correo,
        rol: userDb.rol,
      },
    };
  } catch (error) {
    throw error;
  }
};
