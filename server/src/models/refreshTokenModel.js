/**
 * @file refreshTokenModel.js
 * @module refreshTokenModel
 * @description Módulo de modelos para la gestión de Refresh Tokens. Maneja la persistencia,
 * la verificación de validez, la revocación individual y masiva, y la limpieza de tokens expirados.
 */
import { getPool } from "../config/db.config.js";
import { DatabaseConnectionError } from "../utils/customErrors.js";

/**
 * @async
 * @function saveRefreshToken
 * @description Guarda un nuevo refresh token asociado a un usuario en la base de datos.
 * @param {number} userId - ID del usuario.
 * @param {string} refreshToken - El token de refresco a guardar.
 * @param {Date} expiredAt - Marca de tiempo de cuándo expira el token.
 * @returns {Promise<object>} Promesa que resuelve con el resultado de la inserción.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const saveRefreshToken = async (userId, refreshToken, expiredAt) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      INSERT INTO refresh_tokens (id_usuario, token, expira_en) 
      VALUES (?, ?, ?)
    `;

    const result = await connect.query(query, [
      userId,
      refreshToken,
      expiredAt,
    ]);
    return result;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar guardar el refresh token: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function findValidRefreshToken
 * @description Busca un refresh token en la base de datos que sea válido (no expirado ni revocado)
 * y que pertenezca a un usuario activo. Devuelve los datos básicos del usuario si se encuentra.
 * @param {string} refreshToken - El token a verificar.
 * @returns {Promise<object | null>} Promesa que resuelve con los datos del usuario (id, correo, rol) o null si el token es inválido.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const findValidRefreshToken = async (refreshToken) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      SELECT u.id_usuario, u.correo, u.rol, u.activo
      FROM refresh_tokens rt 
      JOIN usuarios u ON rt.id_usuario = u.id_usuario
      WHERE rt.token = ?
      AND rt.expira_en > NOW()
      AND rt.revocado = FALSE
      AND u.activo = 1
    `;
    const rows = await connect.query(query, [refreshToken]);

    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al buscar un refresh token válido: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function revokeRefreshToken
 * @description Marca un refresh token específico como revocado (`revocado = 1`), invalidándolo para su uso futuro.
 * Se usa típicamente para el proceso de *logout*.
 * @param {string} refreshToken - El token a revocar.
 * @returns {Promise<object>} Promesa que resuelve con el resultado de la actualización.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const revokeRefreshToken = async (refreshToken) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      UPDATE refresh_tokens SET revocado = 1
      WHERE token = ? 
    `;
    const result = await connect.query(query, [refreshToken]);
    return result;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar revocar la refresh token: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function revokeAllUserTokens
 * @description Revoca (`revocado = 1`) todos los refresh tokens activos para un usuario específico.
 * Se usa típicamente para forzar el cierre de sesión en todos los dispositivos.
 * @param {number} userId - ID del usuario cuyos tokens serán revocados.
 * @returns {Promise<object>} Promesa que resuelve con el resultado de la actualización.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const revokeAllUserTokens = async (userId) => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      UPDATE refresh_tokens SET revocado = 1
      WHERE id_usuario = ?
    `;
    const result = await connect.query(query, [userId]);
    return result;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar revocar todos los token del usuario: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};

/**
 * @async
 * @function cleanExpiresTokens
 * @description Elimina físicamente de la base de datos todos los tokens que hayan expirado
 * (`expira_en < NOW()`) o que hayan sido marcados como revocados.
 * Diseñada para ser ejecutada periódicamente por un proceso programado (cron job).
 * @returns {Promise<object>} Promesa que resuelve con el resultado de la operación DELETE.
 * @throws {DatabaseConnectionError} Si ocurre un error de conexión o consulta.
 */
export const cleanExpiresTokens = async () => {
  let connect;
  try {
    const pool = getPool();
    connect = await pool.getConnection();
    const query = `
      DELETE from refresh_tokens 
      WHERE expira_en < NOW() OR revocado = 1
      `;

    const result = await connect.query(query);

    return result;
  } catch (error) {
    throw new DatabaseConnectionError(
      `Error en la base de datos al intentar limpiar los tokens expirados: ${error.message}`
    );
  } finally {
    if (connect) connect.release();
  }
};
