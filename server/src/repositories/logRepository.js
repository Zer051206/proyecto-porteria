/**
 * @file logRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Log'.
 * Encapsula todas las consultas a la base de datos para la tabla 'logs' utilizando Sequelize.
 * @requires ../models/index.js
 */

import db from "../models/index.js";
const Log = db.Log;
const User = db.User;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los registros de log con el usuario asociado.
 * @param {object} [options={}] - Opciones adicionales de Sequelize.
 * @returns {Promise<Array<Log>>} Un array de todos los objetos de log.
 */
export const findAll = async (options = {}) => {
  return Log.findAll({
    include: { model: User, attributes: ["nombre", "apellido", "rol"] },
    ...options,
  });
};

/**
 * @async
 * @function findByUserId
 * @description Busca y devuelve todos los registros de log realizados por un usuario específico.
 * @param {number} id_usuario - El ID del usuario.
 * @returns {Promise<Array<Log>>} Un array de los logs encontrados.
 */
export const findByUserId = async (id_usuario) => {
  return Log.findAll({
    where: { id_usuario: id_usuario },
    include: [{ model: User, attributes: ["nombre", "apellido", "rol"] }],
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de log en la base de datos.
 * @param {object} logData - Los datos del log a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<Log>} El objeto del log recién creado.
 */
export const create = async (logData, options = {}) => {
  return Log.create(logData, options);
};
