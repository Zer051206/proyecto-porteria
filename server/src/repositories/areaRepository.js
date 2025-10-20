/**
 * @file areaRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Area'.
 * @requires ../models/index.js
 */

import db from "../models/index.js";
const Area = db.Area;

/**
 * @async
 * @function findById
 * @description Busca un área específica por su clave primaria (ID).
 * @param {number} id - El ID del área a buscar.
 * @returns {Promise<Area|null>} El objeto del área si se encuentra, o null.
 */
export const findById = async (id) => {
  return Area.findByPk(id);
};

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todas las áreas.
 * @returns {Promise<Array<Area>>} Un array de todos los objetos de área.
 */
export const findAll = async () => {
  return Area.findAll();
};
