/**
 * @file visitRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Visit'.
 * Encapsula todas las consultas a la base de datos para la tabla 'visitas' utilizando Sequelize.
 * @requires ../models/index.js
 */

import db from "../models/index.js";
const Visit = db.Visit;
const User = db.User;
const Area = db.Area;
const IdentificationType = db.IdentificationType;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todas las visitas con sus relaciones principales.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para filtros y ordenación).
 * @returns {Promise<Array<Visit>>} Un array de todos los objetos de visita.
 */
export const findAll = async (options = {}) => {
  return Visit.findAll({
    include: [
      { model: User, as: "EntryUser", attributes: ["nombre", "apellido"] },
      { model: User, as: "ExitUser", attributes: ["nombre", "apellido"] },
      { model: Area, attributes: ["nombre_area"] },
      { model: IdentificationType, attributes: ["descripcion"] },
    ],
    ...options,
  });
};

/**
 * @async
 * @function findById
 * @description Busca una visita específica por su clave primaria (ID) con sus relaciones.
 * @param {number} id - El ID de la visita a buscar.
 * @returns {Promise<Visit|null>} El objeto de la visita si se encuentra, o null.
 */
export const findById = async (id) => {
  return Visit.findByPk(id, {
    include: [
      { model: User, as: "EntryUser" },
      { model: User, as: "ExitUser" },
      { model: Area },
      { model: IdentificationType },
    ],
  });
};

/**
 * @async
 * @function findActiveByIdentification
 * @description Busca una visita que esté activa (estado = true) por la identificación del visitante.
 * @param {string} identificacion - El número de identificación del visitante.
 * @returns {Promise<Visit|null>} El objeto de la visita activa si se encuentra, o null.
 */
export const findActiveByIdentification = async (identificacion) => {
  return Visit.findOne({
    where: {
      identificacion: identificacion,
      estado: true,
    },
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de visita en la base de datos.
 * @param {object} visitData - Los datos de la visita a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<Visit>} El objeto de la visita recién creada.
 */
export const create = async (visitData, options = {}) => {
  return Visit.create(visitData, options);
};

/**
 * @async
 * @function update
 * @description Actualiza los datos de una visita existente por su ID.
 * @param {number} id - El ID de la visita a actualizar.
 * @param {object} updateData - Un objeto con los campos y nuevos valores a actualizar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<Visit|null>} El objeto de la visita actualizado si la operación fue exitosa, o null.
 */
export const update = async (id, updateData, options = {}) => {
  const [rowsAffected] = await Visit.update(updateData, {
    where: { id_visita: id },
    ...options,
  });

  if (rowsAffected > 0) {
    return findById(id);
  }
  return null;
};
