/**
 * @file userRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'User'.
 * Encapsula todas las consultas a la base de datos para la tabla 'usuarios' utilizando Sequelize.
 * @requires ../models/index.js
 */

import db from "../models/index.js";
const User = db.User;

/**
 * @async
 * @function findByEmail
 * @description Busca un usuario por su correo electrónico. No excluye el hash de la contraseña para el proceso de login.
 * @param {string} email - El correo electrónico del usuario a buscar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<User|null>} El objeto del usuario completo si se encuentra, o null.
 */
export const findByEmail = async (email, options = {}) => {
  return User.findOne({ where: { correo: email }, ...options });
};

/**
 * @async
 * @function findById
 * @description Busca un usuario por su clave primaria (ID). Excluye el hash de la contraseña.
 * @param {number} id - El ID del usuario a buscar.
 * @returns {Promise<User|null>} El objeto del usuario (sin hash) si se encuentra, o null.
 */
export const findById = async (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ["contrasena_hash"] },
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de usuario en la base de datos.
 * @param {object} userData - Los datos del usuario a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<User>} El objeto del usuario recién creado.
 */
export const create = async (userData, options = {}) => {
  return User.create(userData, options);
};

/**
 * @async
 * @function update
 * @description Actualiza los datos de un usuario existente por su ID.
 * @param {number} id - El ID del usuario a actualizar.
 * @param {object} updateData - Un objeto con los campos y nuevos valores a actualizar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<User|null>} El objeto del usuario actualizado si la operación fue exitosa, o null.
 */
export const update = async (id, updateData, options = {}) => {
  const [rowsAffected] = await User.update(updateData, {
    where: { id_usuario: id },
    ...options,
  });

  if (rowsAffected > 0) {
    // Devuelve el usuario actualizado (sin el hash) para confirmar los cambios.
    return findById(id);
  }
  return null;
};

/**
 * @async
 * @function updateLastLogin
 * @description Actualiza el campo `ultimo_login` de un usuario a la fecha y hora actual.
 * @param {number} id_usuario - El ID del usuario.
 * @returns {Promise<Array<number>>} Un array con el número de filas afectadas (debería ser [1]).
 */
export const updateLastLogin = async (id_usuario) => {
  return User.update(
    { ultimo_login: new Date() },
    { where: { id_usuario: id_usuario } }
  );
};
