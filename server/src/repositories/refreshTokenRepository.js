/**
 * @file refreshTokenRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'RefreshToken'.
 * Encapsula todas las consultas a la base de datos para la tabla 'refresh_tokens' utilizando Sequelize.
 * @requires ../models/index.js
 * @requires sequelize
 */

import db from "../models/index.js";
import { Op } from "sequelize";

const RefreshToken = db.RefreshToken;
const User = db.User;

/**
 * @async
 * @function create
 * @description Guarda un nuevo Refresh Token en la base de datos.
 * @param {object} tokenData - Datos del token a crear.
 * @param {number} tokenData.id_usuario - ID del usuario.
 * @param {string} tokenData.token - El valor del token.
 * @param {Date} tokenData.expira_en - La fecha de expiración.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<RefreshToken>} El objeto del Refresh Token recién creado.
 */
export const create = async (tokenData, options = {}) => {
  return RefreshToken.create(tokenData, options);
};

/**
 * @async
 * @function findValidToken
 * @description Busca un refresh token que sea válido (no expirado, no revocado) y que pertenezca a un usuario activo.
 * @param {string} token - El token a verificar.
 * @returns {Promise<object | null>} Un objeto plano con los datos del usuario si el token es válido, o null si no.
 */
export const findValidToken = async (token) => {
  const tokenData = await RefreshToken.findOne({
    where: {
      token: token,
      revocado: false,
      expira_en: { [Op.gt]: new Date() },
    },
    include: [
      {
        model: User,
        where: { activo: true }, // Asegura que el usuario asociado también esté activo.
        attributes: ["id_usuario", "correo", "rol"],
      },
    ],
  });

  if (!tokenData || !tokenData.User) {
    return null;
  }

  // Devuelve solo los datos del usuario para ser usados en la creación del nuevo accessToken.
  return tokenData.User.dataValues;
};

/**
 * @async
 * @function revokeToken
 * @description Marca un refresh token específico como revocado. Se usa para el logout.
 * @param {string} token - El token a revocar.
 * @returns {Promise<number>} El número de filas afectadas (1 o 0).
 */
export const revokeToken = async (token) => {
  const [rowsAffected] = await RefreshToken.update(
    { revocado: true },
    {
      where: {
        token: token,
        revocado: false,
      },
    }
  );
  return rowsAffected;
};

/**
 * @async
 * @function revokeAllForUser
 * @description Revoca todos los refresh tokens activos para un usuario específico.
 * @param {number} id_usuario - ID del usuario cuyos tokens serán revocados.
 * @returns {Promise<number>} El número de filas afectadas.
 */
export const revokeAllForUser = async (id_usuario) => {
  const [rowsAffected] = await RefreshToken.update(
    { revocado: true },
    {
      where: {
        id_usuario: id_usuario,
        revocado: false,
      },
    }
  );
  return rowsAffected;
};

/**
 * @async
 * @function cleanExpiredAndRevoked
 * @description Elimina físicamente de la base de datos todos los tokens expirados o revocados.
 * Ideal para ser ejecutado periódicamente por un cron job.
 * @returns {Promise<number>} El número de filas eliminadas.
 */
export const cleanExpiredAndRevoked = async () => {
  return RefreshToken.destroy({
    where: {
      [Op.or]: [{ expira_en: { [Op.lt]: new Date() } }, { revocado: true }],
    },
  });
};
